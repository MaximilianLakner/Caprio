import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, MapPin, CalendarDays, ShieldCheck, KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getPayoutStatus } from "@/lib/stripe/account-status";
import { daysInclusive } from "@/lib/dates";
import { ReviewForm } from "./review-form";

export const metadata: Metadata = { title: "Buchung prüfen" };

function fmt(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function BuchenPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { id } = await params;
  const { from, to } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/anmelden?redirect=/dachboxen/${id}/buchen?from=${from}%26to=${to}`);
  }

  if (!from || !to) redirect(`/dachboxen/${id}`);

  const { data: box } = await supabase
    .from("dachboxen")
    .select("id, title, city, price_per_day, host_id, profiles(name, stripe_account_id)")
    .eq("id", id)
    .single();

  if (!box) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Box nicht buchbar</h1>
        <p className="mt-3 text-ink-soft">
          Diese Box ist nicht für eine Buchung verfügbar.
        </p>
        <Link href="/dachboxen" className="mt-6 inline-block font-medium text-clay-600 hover:underline">
          Zurück zu allen Boxen
        </Link>
      </div>
    );
  }

  const host = Array.isArray(box.profiles) ? box.profiles[0] : box.profiles;
  const payout = await getPayoutStatus(host?.stripe_account_id);
  const days = daysInclusive(from, to);
  const total = Number(box.price_per_day) * days;

  return (
    <div className="mx-auto max-w-xl px-3 py-12 sm:px-8">
      <Link
        href={`/dachboxen/${id}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} />
        Zurück zur Box
      </Link>

      <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Buchung prüfen
      </h1>

      <div className="mt-8 space-y-3">
        {/* Box + host */}
        <div className="rounded-2xl border border-line bg-cream p-5">
          <h2 className="font-display text-lg font-semibold">{box.title}</h2>
          <div className="mt-3 space-y-2 text-sm text-ink-soft">
            <p className="flex items-center gap-2">
              <MapPin size={15} className="text-taupe-500" />
              {box.city}
              <span className="text-taupe-300">·</span>
              Vermietet von {host?.name ?? "—"}
            </p>
            <p className="flex items-center gap-2">
              <CalendarDays size={15} className="text-taupe-500" />
              {fmt(from)} – {fmt(to)} ({days} {days === 1 ? "Tag" : "Tage"})
            </p>
            <p className="flex items-start gap-2">
              <KeyRound size={15} className="mt-0.5 shrink-0 text-taupe-500" />
              Den genauen Treffpunkt und die Kontaktdaten erhältst du direkt nach
              der bezahlten Buchung.
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="rounded-2xl border border-line bg-cream p-5">
          <div className="flex items-center justify-between text-sm text-ink-soft">
            <span>
              {Number(box.price_per_day)} € × {days} {days === 1 ? "Tag" : "Tage"}
            </span>
            <span className="text-ink">{total} €</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-line pt-3 font-semibold">
            <span>Gesamt</span>
            <span className="font-display text-xl">{total} €</span>
          </div>
          <p className="mt-2 text-xs text-ink-soft">
            Keine zusätzlichen Gebühren für dich – Service- und Zahlungsgebühren
            trägt der Vermieter.
          </p>
        </div>

        {/* Trust */}
        <div className="flex items-start gap-2 rounded-2xl border border-line bg-paper/40 p-4 text-sm text-ink-soft">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-clay-600" />
          Kostenlose Stornierung bis 48 Stunden vor Abholung. Dein Geld wird bis
          zur Übergabe sicher gehalten.
        </div>

        {/* Pay */}
        {payout.payoutsEnabled ? (
          <div className="rounded-2xl border border-line bg-cream p-5">
            <ReviewForm boxId={box.id} from={from} to={to} />
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-taupe-300 bg-paper/40 p-5 text-sm text-ink-soft">
            Diese Box ist gerade nicht buchbar – der Vermieter hat seine
            Auszahlungen noch nicht eingerichtet.
          </p>
        )}
      </div>
    </div>
  );
}
