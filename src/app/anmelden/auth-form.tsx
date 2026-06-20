"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, Loader2, Info, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/logo";
import { signIn, signUp } from "./actions";

export function AuthForm({ redirectTo }: { redirectTo?: string }) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loginState, loginAction, loginPending] = useActionState(signIn, null);
  const [registerState, registerAction, registerPending] = useActionState(signUp, null);

  const pending = loginPending || registerPending;

  return (
    <>
      <div className="flex flex-col items-center text-center">
        <Logo className="h-11 w-11" />
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">
          Willkommen bei Caprio
        </h1>
        <p className="mt-2 text-ink-soft">
          {tab === "login"
            ? "Melde dich an, um Boxen zu mieten oder anzubieten."
            : "Erstelle ein kostenloses Konto."}
        </p>
      </div>

      {/* Tab toggle */}
      <div className="mt-8 flex rounded-xl border border-line bg-paper/60 p-1">
        {(["login", "register"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              tab === t
                ? "bg-cream text-ink shadow-sm"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {t === "login" ? "Anmelden" : "Registrieren"}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-cream p-6 shadow-[0_18px_50px_-32px_rgba(42,36,33,0.25)]">
        {tab === "login" ? (
          <form action={loginAction} className="space-y-4">
            <Field label="E-Mail" icon={<Mail size={16} />} name="email" type="email" placeholder="du@beispiel.de" />
            <Field label="Passwort" icon={<Lock size={16} />} name="password" type="password" placeholder="••••••••" />
            {loginState?.error && <ErrorBanner message={loginState.error} />}
            <SubmitButton label="Anmelden" pending={pending} />
          </form>
        ) : (
          <form action={registerAction} className="space-y-4">
            <Field label="Dein Name" icon={<User size={16} />} name="name" type="text" placeholder="Max Mustermann" />
            <Field label="E-Mail" icon={<Mail size={16} />} name="email" type="email" placeholder="du@beispiel.de" />
            <Field label="Passwort" icon={<Lock size={16} />} name="password" type="password" placeholder="mindestens 6 Zeichen" />
            {registerState?.error && <ErrorBanner message={registerState.error} />}
            {registerState?.message && <SuccessBanner message={registerState.message} />}
            <SubmitButton label="Konto erstellen" pending={pending} />
          </form>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Lieber erst schauen?{" "}
        <Link href="/dachboxen" className="font-medium text-clay-600 hover:underline">
          Boxen entdecken
        </Link>
      </p>
    </>
  );
}

function Field({
  label,
  icon,
  name,
  type,
  placeholder,
}: {
  label: string;
  icon: React.ReactNode;
  name: string;
  type: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-taupe-700">
        {label}
      </label>
      <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-line bg-cream px-3 focus-within:border-clay-500 transition-colors">
        <span className="text-taupe-500">{icon}</span>
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required
          className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-taupe-500"
        />
      </div>
    </div>
  );
}

function SubmitButton({ label, pending }: { label: string; pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-semibold text-cream transition-transform hover:-translate-y-px disabled:opacity-60"
    >
      {pending && <Loader2 size={15} className="animate-spin" />}
      {label}
    </button>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <p className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs leading-relaxed text-red-700">
      <Info size={14} className="mt-0.5 shrink-0" />
      {message}
    </p>
  );
}

function SuccessBanner({ message }: { message: string }) {
  return (
    <p className="flex items-start gap-2 rounded-lg bg-blush-100 p-3 text-xs leading-relaxed text-clay-600">
      <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
      {message}
    </p>
  );
}
