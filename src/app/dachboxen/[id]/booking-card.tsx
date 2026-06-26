"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Info, ArrowRight } from "lucide-react";

type Range = { start_date: string; end_date: string };

function daysInclusive(from: string, to: string): number {
  if (!from || !to) return 0;
  const a = new Date(`${from}T00:00:00`);
  const b = new Date(`${to}T00:00:00`);
  const diff = Math.round((b.getTime() - a.getTime()) / 86_400_000) + 1;
  return diff > 0 ? diff : 0;
}

/** Inclusive overlap between the selection and any booked range (ISO strings compare lexically). */
function hasConflict(from: string, to: string, ranges: Range[]): boolean {
  if (!from || !to) return false;
  return ranges.some((r) => from <= r.end_date && r.start_date <= to);
}

export function BookingCard({
  boxId,
  pricePerDay,
  rating,
  reviews,
  bookable,
  bookedRanges = [],
}: {
  boxId: string;
  pricePerDay: number;
  rating?: number | null;
  reviews?: number | null;
  bookable: boolean;
  bookedRanges?: Range[];
}) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const days = daysInclusive(from, to);
  const total = days * pricePerDay;
  const conflict = hasConflict(from, to, bookedRanges);
  const valid = days > 0 && !conflict;

  function proceed() {
    if (!valid) return;
    router.push(`/dachboxen/${boxId}/buchen?from=${from}&to=${to}`);
  }

  return (
    <div className="rounded-lg border border-line bg-cream p-6 shadow-[0_18px_50px_-30px_rgba(42,36,33,0.4)]">
      <div className="flex items-baseline justify-between">
        <p>
          <span className="font-display text-3xl font-semibold">{pricePerDay} €</span>
          <span className="text-ink-soft"> / Tag</span>
        </p>
        {reviews && reviews > 0 ? (
          <span className="flex items-center gap-1 text-sm">
            <Star size={14} className="fill-clay-500 text-clay-500" />
            <span className="font-medium">{rating?.toFixed(2)}</span>
            <span className="text-ink-soft">· {reviews}</span>
          </span>
        ) : (
          <span className="rounded-full bg-blush-100 px-2.5 py-1 text-xs font-semibold text-clay-600">
            Neu
          </span>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-lg border border-line">
        <label className="border-r border-line p-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-taupe-700">
            Von
          </span>
          <input
            type="date"
            min={today}
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              if (to && e.target.value > to) setTo(e.target.value);
            }}
            className="mt-1 w-full bg-transparent text-sm outline-none"
          />
        </label>
        <label className="p-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-taupe-700">
            Bis
          </span>
          <input
            type="date"
            min={from || today}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 w-full bg-transparent text-sm outline-none"
          />
        </label>
      </div>

      {conflict && (
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700">
          <Info size={14} className="mt-0.5 shrink-0" />
          In diesem Zeitraum ist die Box teilweise schon gebucht. Bitte wähl
          andere Tage.
        </p>
      )}

      {days > 0 && !conflict && (
        <dl className="mt-5 space-y-2.5 text-sm">
          <div className="flex justify-between text-ink-soft">
            <dt>
              {pricePerDay} € × {days} {days === 1 ? "Tag" : "Tage"}
            </dt>
            <dd className="text-ink">{total} €</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 font-semibold">
            <dt>Gesamt</dt>
            <dd>{total} €</dd>
          </div>
        </dl>
      )}

      {bookable ? (
        <button
          type="button"
          onClick={proceed}
          disabled={!valid}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-semibold text-cream transition-transform enabled:hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
        >
          {days === 0 ? "Zeitraum wählen" : "Weiter zur Buchung"}
          {valid && <ArrowRight size={16} />}
        </button>
      ) : (
        <p className="mt-5 rounded-lg bg-paper/60 p-3 text-center text-xs leading-relaxed text-ink-soft">
          Diese Box ist aktuell nicht buchbar.
        </p>
      )}

      {bookable && (
        <p className="mt-4 flex items-start gap-2 rounded-lg bg-paper/60 p-3 text-xs leading-relaxed text-ink-soft">
          <Info size={14} className="mt-0.5 shrink-0 text-taupe-500" />
          Sichere Zahlung über Stripe. Dein Geld wird treuhänderisch gehalten und
          erst nach der Übergabe an den Vermieter ausgezahlt.
        </p>
      )}
    </div>
  );
}
