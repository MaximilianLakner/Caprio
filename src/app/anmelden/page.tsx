import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Lock, Info } from "lucide-react";
import { Logo } from "@/components/logo";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Anmelden",
  description: "Melde dich bei Dachgut an oder erstelle ein Konto.",
};

export default function AnmeldenPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-20">
      <div className="flex flex-col items-center text-center">
        <Logo className="h-11 w-11" />
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">
          Willkommen bei {SITE_NAME}
        </h1>
        <p className="mt-2 text-ink-soft">
          Melde dich an, um Boxen zu mieten oder deine eigene anzubieten.
        </p>
      </div>

      {/* Visual-only form — auth via Supabase kommt später */}
      <div className="mt-10 rounded-3xl border border-line bg-cream p-7 shadow-[0_18px_50px_-32px_rgba(42,36,33,0.35)]">
        <label className="text-xs font-semibold uppercase tracking-wider text-taupe-700">
          E-Mail
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-line px-3">
          <Mail size={16} className="text-taupe-500" />
          <input
            type="email"
            placeholder="du@beispiel.de"
            disabled
            className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-taupe-500"
          />
        </div>

        <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-taupe-700">
          Passwort
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-line px-3">
          <Lock size={16} className="text-taupe-500" />
          <input
            type="password"
            placeholder="••••••••"
            disabled
            className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-taupe-500"
          />
        </div>

        <button
          type="button"
          disabled
          className="mt-6 w-full cursor-not-allowed rounded-full bg-ink py-3 text-sm font-semibold text-cream opacity-40"
        >
          Anmelden
        </button>

        <p className="mt-5 flex items-start gap-2 rounded-xl bg-paper/60 p-3 text-xs leading-relaxed text-ink-soft">
          <Info size={14} className="mt-0.5 shrink-0 text-taupe-500" />
          Die Anmeldung über Supabase ist für die nächste Ausbaustufe geplant. Im
          aktuellen MVP kannst du schon frei stöbern.
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Lieber erst schauen?{" "}
        <Link href="/dachboxen" className="font-medium text-clay-600 hover:underline">
          Boxen ansehen
        </Link>
      </p>
    </div>
  );
}
