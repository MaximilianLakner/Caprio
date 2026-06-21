import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
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

export default function VermietenPage() {
  return (
    <div className="pb-8">
      {/* hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
        <div>
          <span
            className="animate-rise inline-flex items-center gap-2 rounded-full border border-line bg-paper/70 px-3 py-1 text-xs font-medium text-taupe-700"
            style={{ animationDelay: "60ms" }}
          >
            Box vermieten
          </span>
          <h1
            className="animate-rise mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl"
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

          <Link
            href="/anmelden"
            className="group animate-rise mt-9 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-px"
            style={{ animationDelay: "620ms" }}
          >
            Box kostenlos anbieten
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="relative">
          <div className="animate-rise relative aspect-[5/4] overflow-hidden rounded-[2.5rem] border border-line shadow-[0_30px_70px_-35px_rgba(42,36,33,0.45)]" style={{ animationDelay: "240ms" }}>
            <Image
              src="/dachbox-vermieten.jpg"
              alt="Auto mit montierter Dachbox"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* estimator */}
      <section className="bg-paper/50">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-taupe-700">
              Verdienst-Rechner
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
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
    </div>
  );
}
