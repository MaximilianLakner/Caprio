"use client";

import { useState } from "react";

const HOST_SHARE = 0.9;

export function EarningsEstimator() {
  const [price, setPrice] = useState(13);
  const [days, setDays] = useState(20);

  const gross = price * days;
  const net = Math.round(gross * HOST_SHARE);

  return (
    <div className="rounded-xl border border-line bg-cream p-7 shadow-[0_18px_50px_-32px_rgba(42,36,33,0.4)] sm:p-9">
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Tagespreis</label>
            <span className="font-display text-lg font-semibold">{price} €</span>
          </div>
          <input
            type="range"
            min={5}
            max={25}
            step={1}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-3 w-full accent-clay-600"
          />
          <div className="mt-1 flex justify-between text-xs text-ink-soft">
            <span>5 €</span>
            <span>25 €</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Vermietete Tage / Jahr</label>
            <span className="font-display text-lg font-semibold">{days}</span>
          </div>
          <input
            type="range"
            min={5}
            max={120}
            step={5}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="mt-3 w-full accent-clay-600"
          />
          <div className="mt-1 flex justify-between text-xs text-ink-soft">
            <span>5</span>
            <span>120</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-1 rounded-lg bg-ink p-7 text-center text-cream">
        <p className="text-sm text-cream/70">Geschätzter Verdienst pro Jahr</p>
        <p className="font-display text-5xl font-semibold">
          {net.toLocaleString("de-DE")} €
        </p>
        <p className="text-xs text-cream/60">
          nach 10 % Servicegebühr · {price} € × {days} Tage
        </p>
      </div>
    </div>
  );
}
