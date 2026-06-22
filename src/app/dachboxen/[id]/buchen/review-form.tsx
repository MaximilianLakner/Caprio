"use client";

import { useActionState } from "react";
import { Loader2, Info, Lock } from "lucide-react";
import { createBookingCheckout } from "@/lib/actions/booking";

export function ReviewForm({
  boxId,
  from,
  to,
}: {
  boxId: string;
  from: string;
  to: string;
}) {
  const [state, formAction, pending] = useActionState(createBookingCheckout, null);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="boxId" value={boxId} />
      <input type="hidden" name="from" value={from} />
      <input type="hidden" name="to" value={to} />

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-paper/40 p-4 text-sm">
        <input
          type="checkbox"
          name="agb"
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-clay-600"
        />
        <span className="leading-relaxed text-ink-soft">
          Ich akzeptiere die <span className="font-medium text-ink">Stornobedingungen</span>{" "}
          (kostenlos bis 48 Std. vor Abholung, danach keine Erstattung) und die
          Nutzungsbedingungen von Caprio.
        </span>
      </label>

      {state?.error && (
        <p className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <Info size={15} className="mt-0.5 shrink-0" />
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-px disabled:opacity-60"
      >
        {pending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Lock size={15} />
        )}
        Jetzt sicher bezahlen
      </button>

      <p className="text-center text-xs text-ink-soft">
        Sichere Zahlung über Stripe. Dein Geld wird treuhänderisch gehalten und
        erst nach bestätigter Übergabe an den Vermieter ausgezahlt.
      </p>
    </form>
  );
}
