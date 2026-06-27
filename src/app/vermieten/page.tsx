import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Wallet,
  CalendarClock,
  Star,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { EarningsEstimator } from "./earnings-estimator";

export const metadata: Metadata = {
  title: "Box vermieten",
  description:
    "Verdiene mit deiner Dachbox, wenn du sie selbst nicht brauchst. Du bestimmst Preis, Verfügbarkeit und Mieter:innen.",
};

const reasons = [
  "Du legst Tagespreis und Verfügbarkeit selbst fest",
  "Du entscheidest, an wen du vermietest",
  "Kostenlos inserieren – Gebühr nur bei erfolgreicher Vermietung",
  "Deine Box amortisiert sich, statt Staub anzusetzen",
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Geprüfte Mieter:innen",
    text: "Verifizierte Profile und ehrliche Bewertungen – du siehst genau, wem du deine Box anvertraust.",
  },
  {
    icon: Wallet,
    title: "Kein Risiko, keine Grundgebühr",
    text: "Inserieren ist komplett kostenlos. Eine faire Gebühr fällt nur an, wenn du wirklich vermietest.",
  },
  {
    icon: CalendarClock,
    title: "Du behältst die Kontrolle",
    text: "Preis, Verfügbarkeit und jede Zusage bestimmst allein du. Deine Box, deine Regeln.",
  },
];

export default function VermietenPage() {
  return (
    <div className="pb-8">
      {/* ----------------------------------------------------------------- hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
        <div>
          <span
            className="animate-rise inline-flex items-center gap-2 rounded-full bg-blush-100 px-3 py-1 text-xs font-semibold text-clay-600"
            style={{ animationDelay: "60ms" }}
          >
            <Sparkles size={13} />
            Box vermieten
          </span>
          <h1
            className="animate-rise mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
            style={{ animationDelay: "140ms" }}
          >
            Lass deine Dachbox{" "}
            <span className="italic text-clay-600">Geld verdienen.</span>
          </h1>
          <p
            className="animate-rise mt-6 max-w-md text-lg leading-relaxed text-ink-soft"
            style={{ animationDelay: "220ms" }}
          >
            Die meisten Dachboxen werden ein paar Wochen im Jahr genutzt – den Rest
            der Zeit stehen sie im Weg. Bei Caprio wird daraus ein entspannter
            Nebenverdienst.
          </p>

          <ul className="mt-8 space-y-3">
            {reasons.map((r, i) => (
              <li
                key={r}
                className="animate-rise flex items-start gap-3"
                style={{ animationDelay: `${300 + i * 70}ms` }}
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blush-100">
                  <Check size={12} className="text-clay-600" />
                </span>
                <span className="text-sm text-ink">{r}</span>
              </li>
            ))}
          </ul>

          <div
            className="animate-rise mt-9 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "620ms" }}
          >
            <Link
              href="/anmelden"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-px"
            >
              Box kostenlos anbieten
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#rechner"
              className="text-sm font-semibold text-clay-600 transition-colors hover:text-clay-500"
            >
              Verdienst berechnen →
            </Link>
          </div>
        </div>

        <div className="relative">
          {/* soft green glow behind the image */}
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-full bg-blush-200/50 blur-3xl" />
          <div
            className="animate-rise relative aspect-[5/4] overflow-hidden rounded-lg border border-line shadow-[0_30px_70px_-35px_rgba(17,53,29,0.45)]"
            style={{ animationDelay: "240ms" }}
          >
            <Image
              src="/dachbox-vermieten.jpg"
              alt="Auto mit montierter Dachbox"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
            />
          </div>

          {/* floating stat cards */}
          <div
            className="animate-rise absolute -bottom-5 -left-3 flex items-center gap-3 rounded-lg border border-line bg-white p-3.5 pr-5 shadow-lg sm:-left-5"
            style={{ animationDelay: "420ms" }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-100">
              <TrendingUp size={18} className="text-clay-600" />
            </span>
            <div>
              <p className="font-display text-xl font-bold leading-none text-ink">
                ~260 €
              </p>
              <p className="mt-1 text-xs text-taupe-500">Ø Nebenverdienst / Jahr</p>
            </div>
          </div>

          <div
            className="animate-rise absolute -right-2 top-5 flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-2 shadow-lg sm:-right-4"
            style={{ animationDelay: "520ms" }}
          >
            <Star size={15} className="fill-clay-500 text-clay-500" />
            <span className="text-sm font-bold text-ink">4,9</span>
            <span className="text-xs text-taupe-500">/ 5</span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- why Caprio (split) */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-20">
        <div className="grid items-stretch gap-5 lg:grid-cols-[1.3fr_1fr]">
          {/* light benefits panel */}
          <Reveal className="rounded-lg bg-[#f7f7f7] p-8 sm:p-12">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Warum Vermieter:innen
              <br className="hidden sm:block" /> auf Caprio setzen
            </h2>
            <div className="mt-8 space-y-7">
              {benefits.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                    <Icon size={18} className="text-clay-600" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-taupe-500">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* green stat panel */}
          <Reveal delay={120} className="flex flex-col justify-between gap-8 rounded-lg bg-clay-600 p-8 text-white sm:p-12">
            <p className="font-display text-2xl font-bold leading-snug sm:text-3xl">
              Caprio ist der Marktplatz für geteilten Stauraum.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Star size={26} className="shrink-0 fill-white text-white" />
                <div>
                  <p className="font-display text-xl font-bold">4,9 / 5</p>
                  <p className="text-sm text-white/75">
                    So bewerten Vermieter:innen ihre Übergaben
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Wallet size={26} className="shrink-0 text-white" />
                <div>
                  <p className="font-display text-xl font-bold">Nur 10 %</p>
                  <p className="text-sm text-white/75">
                    Faire Servicegebühr – ausschließlich bei erfolgreicher Vermietung
                  </p>
                </div>
              </div>
            </div>
            <Link
              href="/anmelden"
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-ink transition-opacity hover:opacity-90"
            >
              Kostenlos starten
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- estimator */}
      <section id="rechner" className="scroll-mt-20 bg-[#f7f7f7]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-clay-600">
              Verdienst-Rechner
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Was könnte deine Box einbringen?
            </h2>
            <p className="mt-3 text-ink-soft">
              Eine grobe Schätzung – die echten Zahlen bestimmst am Ende du.
            </p>
          </Reveal>

          <Reveal delay={120} className="mx-auto mt-10 max-w-2xl">
            <EarningsEstimator />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- final CTA */}
      <section className="mx-auto max-w-7xl px-5 pt-16 sm:px-8 lg:pt-24">
        <Reveal className="relative overflow-hidden rounded-lg bg-ink px-8 py-14 text-center text-white sm:px-14 sm:py-20">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-clay-600/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-clay-600/30 blur-3xl" />
          <div className="relative mx-auto max-w-xl">
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Deine Box wartet auf ihren ersten Trip.
            </h2>
            <p className="mt-4 text-white/75">
              In unter zehn Minuten inseriert – und schon kann sie für dich
              arbeiten.
            </p>
            <Link
              href="/anmelden"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-ink transition-transform hover:-translate-y-px"
            >
              Jetzt Box anbieten
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
