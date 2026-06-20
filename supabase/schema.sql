-- ============================================================
-- Caprio – Supabase Schema
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- 1. Profiles (one row per authenticated user)
create table if not exists public.profiles (
  id         uuid primary key references auth.users on delete cascade,
  name       text not null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

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

create policy "Listings are viewable by everyone"
  on public.dachboxen for select using (true);

create policy "Authenticated users can create listings"
  on public.dachboxen for insert with check (auth.uid() = host_id);

create policy "Users can update their own listings"
  on public.dachboxen for update using (auth.uid() = host_id);

create policy "Users can delete their own listings"
  on public.dachboxen for delete using (auth.uid() = host_id);
