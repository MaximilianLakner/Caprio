import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { UpdatePasswordForm } from "./update-password-form";

export const metadata: Metadata = {
  title: "Neues Passwort",
  description: "Lege ein neues Passwort für dein Caprio-Konto fest.",
};

export default function PasswortNeuPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-20">
      <div className="flex flex-col items-center text-center">
        <Logo className="h-12 w-12" />
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">
          Neues Passwort festlegen
        </h1>
        <p className="mt-2 text-ink-soft">
          Wähle ein neues Passwort für dein Konto.
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-line bg-cream p-6 shadow-[0_18px_50px_-32px_rgba(42,36,33,0.25)]">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
