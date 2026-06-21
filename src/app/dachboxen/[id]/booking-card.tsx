"use client";

import { useState } from "react";
import { Star, Info } from "lucide-react";

const SERVICE_FEE_RATE = 0.1;

function daysBetween(from: string, to: string): number {
  if (!from || !to) return 0;
  const a = new Date(from);
  const b = new Date(to);
  const diff = Math.round((b.getTime() - a.getTime()) / 86_400_000);
  return diff > 0 ? diff : 0;
}

export function BookingCard({
  pricePerDay,
  rating,
  reviews,
}: {
  pricePerDay: number;
  rating?: number | null;
  reviews?: number | null;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const days = daysBetween(from, to);
  const subtotal = days * pricePerDay;
  const fee = Math.round(subtotal * SERVICE_FEE_RATE);
  const total = subtotal + fee;

  return (
    <div className="rounded-3xl border border-line bg-cream p-6 shadow-[0_18px_50px_-30px_rgba(42,36,33,0.4)]">
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

      <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-2xl border border-line">
        <label className="border-r border-line p-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-taupe-700">
            Von
          </span>
          <input
            type="date"
            min={today}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
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

      {days > 0 && (
        <dl className="mt-5 space-y-2.5 text-sm">
          <div className="flex justify-between text-ink-soft">
            <dt>
              {pricePerDay} € × {days} {days === 1 ? "Tag" : "Tage"}
            </dt>
            <dd className="text-ink">{subtotal} €</dd>
          </div>
          <div className="flex justify-between text-ink-soft">
            <dt>Servicegebühr</dt>
            <dd className="text-ink">{fee} €</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 font-semibold">
            <dt>Gesamt</dt>
            <dd>{total} €</dd>
          </div>
        </dl>
      )}

      <button
        type="button"
        disabled={days === 0}
        className="mt-5 w-full rounded-full bg-ink py-3.5 text-sm font-semibold text-cream transition-transform enabled:hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
      >
        {days === 0 ? "Zeitraum wählen" : "Unverbindlich anfragen"}
      </button>

      <p className="mt-4 flex items-start gap-2 rounded-xl bg-paper/60 p-3 text-xs leading-relaxed text-ink-soft">
        <Info size={14} className="mt-0.5 shrink-0 text-taupe-500" />
        Bezahlung über Stripe folgt in einer späteren Version. Aktuell ist die
        Anfrage unverbindlich – ihr klärt die Übergabe direkt miteinander.
      </p>
    </div>
  );
}
