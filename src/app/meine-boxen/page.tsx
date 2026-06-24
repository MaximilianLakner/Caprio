import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Plus,
  MapPin,
  ToggleLeft,
  ToggleRight,
  Trash2,
  LogOut,
  CalendarDays,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { RoofboxVisual } from "@/components/roofbox-visual";
import { signOut } from "@/lib/actions/auth";
import { deleteListing, toggleAvailability } from "./actions";

function fmt(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "short",
  });
}

export const metadata: Metadata = {
  title: "Meine Boxen",
  description: "Verwalte deine Caprio-Inserate.",
};

export default async function MeineBoxenPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/anmelden");

  const [{ data: listings }, { data: profile }, { data: hostBookings }] =
    await Promise.all([
      supabase
        .from("dachboxen")
        .select("*")
        .eq("host_id", user.id)
        .order("created_at", { ascending: false }),
      supabase.from("profiles").select("name").eq("id", user.id).single(),
      supabase
        .from("bookings")
        .select("*, dachboxen(title)")
        .eq("host_id", user.id)
        .in("status", ["paid", "completed"])
        .order("start_date", { ascending: false }),
    ]);

  return (
    <div className="mx-auto max-w-4xl px-3 py-12 sm:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-taupe-700">
            Mein Bereich
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Hallo, {profile?.name ?? user.email}
          </h1>
        </div>
        <Link
          href="/vermieten/inserat"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-px"
        >
          <Plus size={16} />
          Box inserieren
        </Link>
      </div>

      {/* Listings */}
      {!listings || listings.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-taupe-300 bg-paper/40 px-6 py-20 text-center">
          <p className="font-display text-xl font-semibold">
            Noch keine Boxen inseriert
          </p>
          <p className="mt-2 text-ink-soft">
            Inseriere deine erste Box – es dauert nur ein paar Minuten.
          </p>
          <Link
            href="/vermieten/inserat"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream"
          >
            <Plus size={15} />
            Erste Box anbieten
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="overflow-hidden rounded-2xl border border-line bg-cream"
            >
              <Link
                href={`/dachboxen/${listing.id}`}
                className="block aspect-[4/3] overflow-hidden bg-paper"
              >
                {listing.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                  />
                ) : (
                  <RoofboxVisual tone={0} className="h-full w-full" />
                )}
              </Link>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/dachboxen/${listing.id}`} className="min-w-0">
                      <h3 className="truncate font-display text-lg font-semibold transition-colors hover:text-clay-600">
                        {listing.title}
                      </h3>
                    </Link>
                    <p className="mt-1 flex items-center gap-1 text-sm text-ink-soft">
                      <MapPin size={13} />
                      {listing.city}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                      listing.is_available
                        ? "bg-blush-100 text-clay-600"
                        : "bg-paper text-taupe-500"
                    }`}
                  >
                    {listing.is_available ? "Aktiv" : "Pausiert"}
                  </span>
                </div>

                <p className="mt-3 font-display text-2xl font-semibold">
                  {listing.price_per_day} €
                  <span className="text-base font-normal text-ink-soft"> / Tag</span>
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                {/* Toggle availability */}
                <form
                  action={toggleAvailability.bind(
                    null,
                    listing.id,
                    listing.is_available
                  )}
                >
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
                  >
                    {listing.is_available ? (
                      <ToggleRight size={18} className="text-clay-600" />
                    ) : (
                      <ToggleLeft size={18} />
                    )}
                    {listing.is_available ? "Pausieren" : "Aktivieren"}
                  </button>
                </form>

                {/* Delete */}
                <form action={deleteListing.bind(null, listing.id)}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 transition-colors hover:text-red-700"
                  >
                    <Trash2 size={15} />
                    Löschen
                  </button>
                </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bookings on the host's boxes */}
      {hostBookings && hostBookings.length > 0 && (
        <div className="mt-14 border-t border-line pt-10">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Buchungen deiner Boxen
          </h2>
          <div className="mt-6 space-y-3">
            {hostBookings.map((b) => {
              const box = Array.isArray(b.dachboxen) ? b.dachboxen[0] : b.dachboxen;
              const paidOut = b.status === "completed";
              return (
                <div
                  key={b.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-cream p-4"
                >
                  <div>
                    <p className="font-semibold">{box?.title ?? "Dachbox"}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-soft">
                      <CalendarDays size={13} />
                      {fmt(b.start_date)} – {fmt(b.end_date)}
                    </p>
                  </div>
                  <div className="text-right">
                    {paidOut ? (
                      <>
                        <p className="font-display text-lg font-semibold text-clay-600">
                          + {((b.host_payout ?? 0) / 100).toFixed(2)} €
                        </p>
                        <p className="text-xs text-ink-soft">ausgezahlt</p>
                      </>
                    ) : (
                      <span className="rounded-full bg-blush-100 px-2.5 py-1 text-xs font-medium text-clay-600">
                        Wartet auf Übergabe
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sign out */}
      <div className="mt-14 border-t border-line pt-8">
        <form action={signOut}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            <LogOut size={15} />
            Abmelden
          </button>
        </form>
      </div>
    </div>
  );
}
