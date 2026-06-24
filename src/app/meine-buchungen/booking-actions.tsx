"use client";

import { useState, useTransition } from "react";
import { Loader2, Check, Info } from "lucide-react";
import { confirmHandover, cancelBooking } from "@/lib/actions/booking-manage";

export function BookingActions({
  bookingId,
  canCancel,
}: {
  bookingId: string;
  canCancel: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleConfirm() {
    if (
      !window.confirm(
        "Bestätigst du, dass du die Dachbox erhalten hast? Danach wird der Vermieter ausgezahlt."
      )
    )
      return;
    setError(null);
    startTransition(async () => {
      const res = await confirmHandover(bookingId);
      if (res?.error) setError(res.error);
    });
  }

  function handleCancel() {
    if (
      !window.confirm(
        "Buchung wirklich stornieren? Du erhältst den vollen Betrag zurück."
      )
    )
      return;
    setError(null);
    startTransition(async () => {
      const res = await cancelBooking(bookingId);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        {canCancel && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={pending}
            className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink disabled:opacity-50"
          >
            Stornieren
          </button>
        )}
        <button
          type="button"
          onClick={handleConfirm}
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream transition-transform hover:-translate-y-px disabled:opacity-50"
        >
          {pending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Check size={14} />
          )}
          Übergabe bestätigen
        </button>
      </div>
      {error && (
        <p className="flex items-start gap-1.5 text-xs text-red-700">
          <Info size={13} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
