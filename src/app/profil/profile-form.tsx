"use client";

import { useActionState, useRef, useState } from "react";
import { Loader2, Info, CheckCircle2, Camera } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { updateProfile } from "./actions";

export function ProfileForm({
  firstName,
  lastName,
  name,
  email,
  avatarUrl,
}: {
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  avatarUrl?: string | null;
}) {
  const [state, formAction, pending] = useActionState(updateProfile, null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="group relative rounded-full"
          aria-label="Profilbild ändern"
        >
          <Avatar
            name={name}
            email={email}
            src={preview ?? avatarUrl}
            className="h-20 w-20 text-xl"
          />
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-ink/0 text-cream opacity-0 transition group-hover:bg-ink/40 group-hover:opacity-100">
            <Camera size={20} />
          </span>
        </button>
        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-full border border-line bg-cream px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-taupe-300"
          >
            Profilbild wählen
          </button>
          <p className="mt-1.5 text-xs text-ink-soft">PNG oder JPG, max. 3 MB.</p>
        </div>
        <input
          ref={fileRef}
          type="file"
          name="avatar"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
      </div>

      {/* Name */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-taupe-700">
            Vorname
          </label>
          <input
            name="firstName"
            type="text"
            defaultValue={firstName}
            required
            className="mt-1.5 w-full rounded-lg border border-line bg-cream px-3 py-2.5 text-sm outline-none transition-colors focus:border-clay-500"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-taupe-700">
            Nachname
          </label>
          <input
            name="lastName"
            type="text"
            defaultValue={lastName}
            required
            className="mt-1.5 w-full rounded-lg border border-line bg-cream px-3 py-2.5 text-sm outline-none transition-colors focus:border-clay-500"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-taupe-700">
          E-Mail
        </label>
        <input
          type="email"
          value={email}
          disabled
          className="mt-1.5 w-full cursor-not-allowed rounded-lg border border-line bg-paper/60 px-3 py-2.5 text-sm text-ink-soft outline-none"
        />
      </div>

      {state?.error && (
        <p className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs leading-relaxed text-red-700">
          <Info size={14} className="mt-0.5 shrink-0" />
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="flex items-start gap-2 rounded-lg bg-blush-100 p-3 text-xs leading-relaxed text-clay-600">
          <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
          Profil gespeichert.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition-transform hover:-translate-y-px disabled:opacity-60"
      >
        {pending && <Loader2 size={15} className="animate-spin" />}
        Speichern
      </button>
    </form>
  );
}
