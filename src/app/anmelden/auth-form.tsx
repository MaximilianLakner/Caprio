"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, User, Loader2, Info, CheckCircle2, ArrowLeft } from "lucide-react";
import { signIn, signUp, requestPasswordReset, signInWithProvider } from "./actions";

type Mode = "login" | "register" | "forgot";

export function AuthForm({ redirectTo }: { redirectTo?: string }) {
  const [mode, setMode] = useState<Mode>("login");
  const [loginState, loginAction, loginPending] = useActionState(signIn, null);
  const [registerState, registerAction, registerPending] = useActionState(signUp, null);
  const [resetState, resetAction, resetPending] = useActionState(requestPasswordReset, null);

  const pending = loginPending || registerPending || resetPending;

  const subtitle =
    mode === "login"
      ? "Melde dich an, um Boxen zu mieten oder anzubieten."
      : mode === "register"
        ? "Erstelle ein kostenloses Konto."
        : "Wir schicken dir einen Link zum Zurücksetzen.";

  return (
    <>
      <div className="flex flex-col items-center text-center">
        <Image
          src="/logo.png"
          alt="Caprio"
          width={922}
          height={636}
          className="h-24 w-auto"
          priority
        />
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">
          {mode === "forgot" ? "Passwort vergessen?" : "Willkommen bei Caprio"}
        </h1>
        <p className="mt-2 text-ink-soft">{subtitle}</p>
      </div>

      {/* Tab toggle (hidden in forgot mode) */}
      {mode !== "forgot" && (
        <div className="mt-8 flex rounded-xl border border-line bg-paper/60 p-1">
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setMode(t)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                mode === t
                  ? "bg-cream text-ink shadow-sm"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {t === "login" ? "Anmelden" : "Registrieren"}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-line bg-cream p-6 shadow-[0_18px_50px_-32px_rgba(42,36,33,0.25)]">
        {mode !== "forgot" && (
          <>
            <div className="space-y-2.5">
              <ProviderButton provider="google" label="Mit Google fortfahren" redirectTo={redirectTo}>
                <GoogleIcon />
              </ProviderButton>
              <ProviderButton provider="apple" label="Mit Apple fortfahren" redirectTo={redirectTo}>
                <AppleIcon />
              </ProviderButton>
            </div>
            <div className="my-5 flex items-center gap-3 text-xs font-medium text-taupe-500">
              <span className="h-px flex-1 bg-line" />
              oder mit E-Mail
              <span className="h-px flex-1 bg-line" />
            </div>
          </>
        )}

        {mode === "login" && (
          <form action={loginAction} className="space-y-4">
            {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}
            <Field label="E-Mail" icon={<Mail size={16} />} name="email" type="email" placeholder="du@beispiel.de" />
            <Field label="Passwort" icon={<Lock size={16} />} name="password" type="password" placeholder="••••••••" />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-xs font-medium text-clay-600 hover:underline"
              >
                Passwort vergessen?
              </button>
            </div>
            {loginState?.error && <ErrorBanner message={loginState.error} />}
            <SubmitButton label="Anmelden" pending={pending} />
          </form>
        )}

        {mode === "register" && (
          <form action={registerAction} className="space-y-4">
            {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Vorname" icon={<User size={16} />} name="firstName" type="text" placeholder="Max" />
              <Field label="Nachname" icon={<User size={16} />} name="lastName" type="text" placeholder="Mustermann" />
            </div>
            <Field label="E-Mail" icon={<Mail size={16} />} name="email" type="email" placeholder="du@beispiel.de" />
            <Field label="Passwort" icon={<Lock size={16} />} name="password" type="password" placeholder="mindestens 6 Zeichen" minLength={6} />
            <Field label="Passwort bestätigen" icon={<Lock size={16} />} name="passwordConfirm" type="password" placeholder="Passwort wiederholen" minLength={6} />
            {registerState?.error && <ErrorBanner message={registerState.error} />}
            {registerState?.message && <SuccessBanner message={registerState.message} />}
            <SubmitButton label="Konto erstellen" pending={pending} />
          </form>
        )}

        {mode === "forgot" && (
          <form action={resetAction} className="space-y-4">
            <Field label="E-Mail" icon={<Mail size={16} />} name="email" type="email" placeholder="du@beispiel.de" />
            {resetState?.error && <ErrorBanner message={resetState.error} />}
            {resetState?.message && <SuccessBanner message={resetState.message} />}
            <SubmitButton label="Link zum Zurücksetzen senden" pending={pending} />
            <button
              type="button"
              onClick={() => setMode("login")}
              className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              <ArrowLeft size={15} />
              Zurück zur Anmeldung
            </button>
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
  minLength,
}: {
  label: string;
  icon: React.ReactNode;
  name: string;
  type: string;
  placeholder: string;
  minLength?: number;
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
          minLength={minLength}
          className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-taupe-500"
        />
      </div>
    </div>
  );
}

function ProviderButton({
  provider,
  label,
  redirectTo,
  children,
}: {
  provider: "google" | "apple";
  label: string;
  redirectTo?: string;
  children: React.ReactNode;
}) {
  return (
    <form action={signInWithProvider}>
      <input type="hidden" name="provider" value={provider} />
      <input type="hidden" name="next" value={redirectTo ?? "/meine-boxen"} />
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2.5 rounded-full border border-line bg-cream py-2.5 text-sm font-medium text-ink transition-colors hover:border-taupe-300 hover:bg-paper/60"
      >
        {children}
        {label}
      </button>
    </form>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
      <path d="M16.37 1.43c.06 1.06-.33 2.08-1 2.83-.7.78-1.86 1.39-2.98 1.3-.08-1.04.42-2.1 1.06-2.78.72-.78 1.94-1.34 2.92-1.35ZM20.4 17.2c-.55 1.27-.82 1.84-1.53 2.96-.99 1.57-2.39 3.52-4.12 3.53-1.54.02-1.93-1-4.02-.99-2.09.01-2.52 1.01-4.06.99-1.73-.01-3.05-1.77-4.04-3.33C-.16 16.98-.45 11.84 1.26 9.11 2.47 7.17 4.39 6.04 6.19 6.04c1.83 0 2.98 1 4.5 1 1.47 0 2.36-1 4.48-1 1.6 0 3.3.87 4.51 2.38-3.96 2.17-3.32 7.82.72 8.78Z" />
    </svg>
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
