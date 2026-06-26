import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, ArrowRight, Banknote, CheckCircle2, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getPayoutStatus } from "@/lib/stripe/account-status";
import { startHostOnboarding } from "@/lib/actions/connect";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = {
  title: "Profil",
  description: "Bearbeite dein Caprio-Profil.",
};

export default async function ProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ stripe_error?: string; stripe?: string }>;
}) {
  const { stripe_error: stripeError } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/anmelden?redirect=/profil");

  const [{ data: profile }, { count }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("dachboxen")
      .select("*", { count: "exact", head: true })
      .eq("host_id", user.id),
  ]);

  const fullName: string = profile?.name ?? "";
  const [firstName, ...rest] = fullName.split(" ");
  const lastName = rest.join(" ");
  const boxCount = count ?? 0;

  const payout = process.env.STRIPE_SECRET_KEY
    ? await getPayoutStatus(profile?.stripe_account_id)
    : { hasAccount: false, payoutsEnabled: false, detailsSubmitted: false };

  return (
    <div className="mx-auto max-w-2xl px-3 py-14 sm:px-8">
      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-taupe-700">
          Mein Bereich
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Profil bearbeiten
        </h1>
        <p className="mt-3 text-ink-soft">
          Aktualisiere deinen Namen und dein Profilbild.
        </p>
      </div>

      <div className="rounded-lg border border-line bg-cream p-6 sm:p-8">
        <ProfileForm
          firstName={firstName ?? ""}
          lastName={lastName}
          name={profile?.name}
          email={user.email!}
          avatarUrl={profile?.avatar_url ?? null}
        />
      </div>

      {/* Payouts / Stripe Connect */}
      <div className="mt-6 rounded-lg border border-line bg-cream p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blush-100">
            <Banknote size={18} className="text-clay-600" />
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-ink">Auszahlungen</p>
              {payout.payoutsEnabled && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blush-100 px-2 py-0.5 text-xs font-semibold text-clay-600">
                  <CheckCircle2 size={12} />
                  Aktiv
                </span>
              )}
            </div>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              {payout.payoutsEnabled
                ? "Du kannst Boxen vermieten und Auszahlungen empfangen. Das Geld erhältst du nach bestätigter Übergabe."
                : payout.hasAccount
                  ? "Dein Stripe-Onboarding ist noch nicht abgeschlossen. Schließ es ab, um Auszahlungen zu empfangen."
                  : "Richte Auszahlungen über Stripe ein, damit du deine Box vermieten und Geld empfangen kannst."}
            </p>

            {stripeError && (
              <p className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs leading-relaxed text-red-700">
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>
                  Stripe-Onboarding konnte nicht gestartet werden: {stripeError}
                </span>
              </p>
            )}

            {!payout.payoutsEnabled && (
              <form action={startHostOnboarding} className="mt-4">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-px"
                >
                  {payout.hasAccount ? "Onboarding fortsetzen" : "Auszahlungen einrichten"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Uploaded boxes shortcut */}
      <Link
        href="/meine-boxen"
        className="mt-6 flex items-center justify-between rounded-lg border border-line bg-cream p-5 transition-colors hover:border-taupe-300"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blush-100">
            <Package size={18} className="text-clay-600" />
          </span>
          <div>
            <p className="font-semibold text-ink">Meine Dachboxen</p>
            <p className="text-sm text-ink-soft">
              {boxCount === 0
                ? "Noch keine Box inseriert"
                : `${boxCount} ${boxCount === 1 ? "Box" : "Boxen"} inseriert`}
            </p>
          </div>
        </div>
        <ArrowRight size={18} className="text-ink-soft" />
      </Link>
    </div>
  );
}
