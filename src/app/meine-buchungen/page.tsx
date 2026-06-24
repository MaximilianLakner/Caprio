import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, MapPin, CalendarDays } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BookingActions } from "./booking-actions";

export const metadata: Metadata = {
  title: "Meine Buchungen",
  description: "Deine gemieteten Dachboxen bei Caprio.",
};

const STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: "Wartet auf Zahlung", cls: "bg-paper text-taupe-500" },
  paid: { label: "Bezahlt", cls: "bg-blush-100 text-clay-600" },
  handover_confirmed: { label: "Übergeben", cls: "bg-blush-100 text-clay-600" },
  completed: { label: "Abgeschlossen", cls: "bg-paper text-taupe-500" },
  cancelled: { label: "Storniert", cls: "bg-paper text-taupe-500" },
  refunded: { label: "Erstattet", cls: "bg-paper text-taupe-500" },
  expired: { label: "Abgelaufen", cls: "bg-paper text-taupe-500" },
};

function fmt(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function MeineBuchungenPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/anmelden?redirect=/meine-buchungen");

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, dachboxen(title, city, images)")
    .eq("renter_id", user.id)
    .neq("status", "expired")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-3 py-12 sm:px-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-taupe-700">
          Mein Bereich
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Meine Buchungen
        </h1>
      </div>

      {status === "erfolg" && (
        <p className="mt-6 flex items-start gap-2 rounded-2xl bg-blush-100 p-4 text-sm text-clay-600">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          Zahlung erfolgreich! Deine Buchung ist bestätigt. Den Treffpunkt klärst
          du jetzt direkt mit dem Vermieter.
        </p>
      )}

      {!bookings || bookings.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-taupe-300 bg-paper/40 px-6 py-20 text-center">
          <p className="font-display text-xl font-semibold">Noch keine Buchungen</p>
          <p className="mt-2 text-ink-soft">
            Finde eine Dachbox und sichere dir deinen Reisezeitraum.
          </p>
          <Link
            href="/dachboxen"
            className="mt-6 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream"
          >
            Boxen ansehen
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((b) => {
            const box = Array.isArray(b.dachboxen) ? b.dachboxen[0] : b.dachboxen;
            const s = STATUS[b.status] ?? STATUS.pending;
            const canCancel =
              new Date(`${b.start_date}T00:00:00`).getTime() - Date.now() >
              48 * 3600 * 1000;
            return (
              <div
                key={b.id}
                className="rounded-2xl border border-line bg-cream p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold">
                      {box?.title ?? "Dachbox"}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {box?.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarDays size={13} />
                        {fmt(b.start_date)} – {fmt(b.end_date)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-display text-lg font-semibold">
                      {(b.amount_total / 100).toFixed(0)} €
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${s.cls}`}
                    >
                      {s.label}
                    </span>
                  </div>
                </div>

                {b.status === "paid" && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                    <p className="text-xs text-ink-soft">
                      Box erhalten? Bestätige die Übergabe – danach wird der
                      Vermieter ausgezahlt. Kostenlose Stornierung bis 48 Std.
                      vor Abholung.
                    </p>
                    <BookingActions bookingId={b.id} canCancel={canCancel} />
                  </div>
                )}

                {b.status === "completed" && (
                  <p className="mt-3 border-t border-line pt-3 text-xs text-ink-soft">
                    Übergabe bestätigt – der Vermieter wurde ausgezahlt. Gute Reise!
                  </p>
                )}
                {b.status === "cancelled" && (
                  <p className="mt-3 border-t border-line pt-3 text-xs text-ink-soft">
                    Storniert – der Betrag wurde dir vollständig erstattet.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
