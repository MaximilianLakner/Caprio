"use client";

import { useActionState } from "react";
import { Lock, Loader2, Info } from "lucide-react";
import { updatePassword } from "../anmelden/actions";

export function UpdatePasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, null);

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Neues Passwort" name="password" placeholder="mindestens 6 Zeichen" />
      <Field label="Passwort bestätigen" name="passwordConfirm" placeholder="Passwort wiederholen" />
      {state?.error && (
        <p className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs leading-relaxed text-red-700">
          <Info size={14} className="mt-0.5 shrink-0" />
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-semibold text-cream transition-transform hover:-translate-y-px disabled:opacity-60"
      >
        {pending && <Loader2 size={15} className="animate-spin" />}
        Passwort speichern
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-taupe-700">
        {label}
      </label>
      <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-line bg-cream px-3 transition-colors focus-within:border-clay-500">
        <span className="text-taupe-500">
          <Lock size={16} />
        </span>
        <input
          name={name}
          type="password"
          placeholder={placeholder}
          required
          minLength={6}
          className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-taupe-500"
        />
      </div>
    </div>
  );
}
