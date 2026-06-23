-- ============================================================
-- Caprio – Supabase Schema
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- 1. Profiles (one row per authenticated user)
create table if not exists public.profiles (
  id         uuid primary key references auth.users on delete cascade,
  name       text not null,
  avatar_url text,
  created_at timestamptz default now()
);

-- For databases created before avatar_url existed:
alter table public.profiles add column if not exists avatar_url text;

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create a profile row whenever a user registers
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Dachboxen listings
create table if not exists public.dachboxen (
  id            uuid default gen_random_uuid() primary key,
  title         text not null,
  brand         text not null,
  city          text not null,
  price_per_day numeric(6, 2) not null check (price_per_day > 0),
  volume        integer not null check (volume > 0),
  length_cm     integer not null check (length_cm > 0),
  max_load_kg   integer not null check (max_load_kg > 0),
  opening       text not null check (opening in ('einseitig', 'beidseitig')),
  description   text default '',
  features      text[] default '{}',
  is_available  boolean default true,
  host_id       uuid not null references public.profiles (id) on delete cascade,
  created_at    timestamptz default now()
);

alter table public.dachboxen enable row level security;

drop policy if exists "Listings are viewable by everyone" on public.dachboxen;
create policy "Listings are viewable by everyone"
  on public.dachboxen for select using (true);

drop policy if exists "Authenticated users can create listings" on public.dachboxen;
create policy "Authenticated users can create listings"
  on public.dachboxen for insert with check (auth.uid() = host_id);

drop policy if exists "Users can update their own listings" on public.dachboxen;
create policy "Users can update their own listings"
  on public.dachboxen for update using (auth.uid() = host_id);

drop policy if exists "Users can delete their own listings" on public.dachboxen;
create policy "Users can delete their own listings"
  on public.dachboxen for delete using (auth.uid() = host_id);

-- ============================================================
-- 3. Profile pictures — storage bucket "avatars" (public read)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Avatar images are publicly readable" on storage.objects;
create policy "Avatar images are publicly readable"
  on storage.objects for select using (bucket_id = 'avatars');

drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- 4. Box photos — images column + storage bucket "box-images"
-- ============================================================
alter table public.dachboxen add column if not exists images text[] default '{}';

insert into storage.buckets (id, name, public)
values ('box-images', 'box-images', true)
on conflict (id) do nothing;

drop policy if exists "Box images are publicly readable" on storage.objects;
create policy "Box images are publicly readable"
  on storage.objects for select using (bucket_id = 'box-images');

drop policy if exists "Users can upload their own box images" on storage.objects;
create policy "Users can upload their own box images"
  on storage.objects for insert
  with check (
    bucket_id = 'box-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete their own box images" on storage.objects;
create policy "Users can delete their own box images"
  on storage.objects for delete
  using (
    bucket_id = 'box-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- 5. Bookings + Stripe Connect (Zahlungen)
-- ============================================================

-- needed so a uuid (=) and a range (&&) can live in the same GiST index
create extension if not exists btree_gist;

-- Connected Stripe account of a host (for payouts)
alter table public.profiles add column if not exists stripe_account_id text;

create table if not exists public.bookings (
  id                   uuid default gen_random_uuid() primary key,
  box_id               uuid not null references public.dachboxen (id) on delete cascade,
  renter_id            uuid not null references public.profiles (id) on delete cascade,
  host_id              uuid not null references public.profiles (id) on delete cascade,
  start_date           date not null,
  end_date             date not null,
  -- inclusive range [start, end]; used by the no-overlap constraint
  during               daterange generated always as (daterange(start_date, end_date, '[]')) stored,
  status               text not null default 'pending'
                         check (status in ('pending','paid','handover_confirmed','completed','cancelled','refunded','expired')),
  amount_total         integer not null,        -- cents the renter pays
  marketplace_fee      integer not null default 0, -- cents Caprio keeps
  host_payout          integer,                 -- cents transferred to host (after handover)
  currency             text not null default 'eur',
  stripe_session_id    text,
  stripe_payment_intent text,
  stripe_transfer_id   text,
  expires_at           timestamptz,             -- pending holds expire
  created_at           timestamptz default now(),
  constraint valid_dates check (end_date >= start_date)
);

-- 🔒 Race-proof: the DB itself rejects any overlapping *active* booking for a box
alter table public.bookings drop constraint if exists no_overlapping_bookings;
alter table public.bookings add constraint no_overlapping_bookings
  exclude using gist (box_id with =, during with &&)
  where (status in ('pending','paid','handover_confirmed','completed'));

alter table public.bookings enable row level security;

drop policy if exists "Participants can view their bookings" on public.bookings;
create policy "Participants can view their bookings"
  on public.bookings for select
  using (auth.uid() = renter_id or auth.uid() = host_id);

drop policy if exists "Renters can create their own bookings" on public.bookings;
create policy "Renters can create their own bookings"
  on public.bookings for insert
  with check (auth.uid() = renter_id);

drop policy if exists "Participants can update their bookings" on public.bookings;
create policy "Participants can update their bookings"
  on public.bookings for update
  using (auth.uid() = renter_id or auth.uid() = host_id);

-- Booked date ranges for a box (no personal data) — feeds the calendar
create or replace function public.box_booked_ranges(p_box_id uuid)
returns table(start_date date, end_date date)
language sql security definer set search_path = public stable as $$
  select start_date, end_date
  from public.bookings
  where box_id = p_box_id
    and status in ('pending','paid','handover_confirmed','completed')
    and end_date >= current_date;
$$;
grant execute on function public.box_booked_ranges(uuid) to anon, authenticated;

-- Release abandoned pending holds so they stop blocking dates
create or replace function public.expire_stale_bookings()
returns void
language sql security definer set search_path = public as $$
  update public.bookings set status = 'expired'
  where status = 'pending' and expires_at is not null and expires_at < now();
$$;
grant execute on function public.expire_stale_bookings() to anon, authenticated;

-- ============================================================
-- 6. Befestigungsart (mounting type) auf Inseraten
-- ============================================================
alter table public.dachboxen add column if not exists mounting text;
