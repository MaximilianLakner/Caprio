import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  CalendarDays,
  Wallet,
  Sparkles,
} from "lucide-react";
import { BoxCard } from "@/components/box-card";
import { HeroIllustration } from "@/components/hero-illustration";
import { DACHBOXEN } from "@/lib/data";

const BRANDS = ["Thule", "Kamei", "Hapro", "Yakima", "Atera", "Jetbag"];

export default function HomePage() {
  const featured = DACHBOXEN.filter((b) => b.superhost).slice(0, 3);

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden">
        <div className="grain pointer-events-none absolute inset-0" />

        <div className="relative mx-auto max-w-4xl px-5 pt-16 text-center sm:px-8 lg:pt-24">
          <span className="animate-rise inline-flex items-center gap-2 rounded-full border border-line bg-paper/70 px-3 py-1 text-xs font-medium text-taupe-700">
            <Sparkles size={13} className="text-clay-500" />
            Dachboxen mieten &amp; vermieten — von Mensch zu Mensch
          </span>

          <h1 className="animate-rise mx-auto mt-7 max-w-3xl font-display text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
            Mehr Stauraum für dein{" "}
            <span className="relative whitespace-nowrap italic text-clay-600">
              Abenteuer
              <svg
                viewBox="0 0 240 18"
                preserveAspectRatio="none"
                fill="none"
                className="absolute -bottom-2 left-0 h-3 w-full text-clay-500"
                aria-hidden="true"
              >
                <path
                  d="M4 12C64 4 182 3 236 9"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="animate-rise mx-auto mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">
            Leih dir eine Dachbox aus deiner Nähe – tageweise, fair und
            unkompliziert. Oder verdiene mit deiner eigenen Box, wenn sie gerade nur
            die Garage füllt.
          </p>

          <div className="animate-rise mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/dachboxen"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-px"
            >
              Dachbox finden
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/vermieten"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-cream px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-taupe-300"
            >
              Box vermieten
            </Link>
          </div>
        </div>

        {/* hero illustration */}
        <div className="relative mx-auto mt-8 max-w-3xl px-5 sm:mt-12 sm:px-8">
          <HeroIllustration className="w-full" />
        </div>
      </section>

      {/* ---------------------------------------------------------- Brand strip */}
      <section className="border-t border-line bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-9 sm:px-8">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-taupe-500">
            Boxen von Marken, denen Reisende vertrauen
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-75">
            {BRANDS.map((brand) => (
              <span
                key={brand}
                className="font-display text-xl font-semibold tracking-tight text-taupe-700"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Trust strip */}
      <section className="border-y border-line bg-paper/50">
        <div className="mx-auto grid max-w-7xl gap-px px-5 py-10 sm:grid-cols-3 sm:px-8">
          {[
            {
              icon: Wallet,
              title: "Fairer Tagespreis",
              text: "Vermieter:innen legen den Preis selbst fest – meist ein Bruchteil vom Neukauf.",
            },
            {
              icon: ShieldCheck,
              title: "Geprüfte Profile",
              text: "Verifizierte Mitglieder und transparente Bewertungen schaffen Vertrauen.",
            },
            {
              icon: CalendarDays,
              title: "Flexibel buchen",
              text: "Genau so lange, wie du sie brauchst – vom Wochenende bis zum Sommerurlaub.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4 px-2 py-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-cream">
                <Icon size={18} className="text-clay-600" />
              </span>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------ Featured boxes */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-taupe-700">
              Beliebt diese Woche
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Boxen, die andere lieben
            </h2>
          </div>
          <Link
            href="/dachboxen"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-clay-600 sm:inline-flex"
          >
            Alle ansehen
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((box) => (
            <BoxCard key={box.id} box={box} />
          ))}
        </div>

        <Link
          href="/dachboxen"
          className="mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-clay-600 sm:hidden"
        >
          Alle ansehen
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* --------------------------------------------------- How it works teaser */}
      <section className="bg-paper/50">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wider text-taupe-700">
              In drei Schritten
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              So einfach kommst du an mehr Stauraum
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Box finden",
                text: "Filtere nach Größe, Preis und Ort und finde die passende Box in deiner Nähe.",
              },
              {
                n: "02",
                title: "Tage wählen & anfragen",
                text: "Such dir deinen Reisezeitraum aus und schick eine unverbindliche Anfrage.",
              },
              {
                n: "03",
                title: "Abholen & losfahren",
                text: "Box bei der Übergabe aufs Dach, Urlaub genießen, danach einfach zurückbringen.",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="relative rounded-3xl border border-line bg-cream p-7"
              >
                <span className="font-display text-4xl font-semibold text-taupe-300">
                  {step.n}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/so-funktionierts"
            className="mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-clay-600"
          >
            Mehr darüber, wie&apos;s funktioniert
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* --------------------------------------------------------- Host CTA */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-8 py-16 text-cream sm:px-14">
          <div className="grain pointer-events-none absolute inset-0 opacity-50" />
          <div
            className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle,#2f7551,transparent 70%)" }}
          />
          <div className="relative max-w-xl">
            <p className="text-sm font-medium uppercase tracking-wider text-blush-300">
              Box vermieten
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Deine Box steht 50 Wochen im Jahr still.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-cream/75">
              Mach Stauraum, den du selten brauchst, zu einem kleinen Nebenverdienst.
              Du bestimmst Preis, Verfügbarkeit und an wen du vermietest.
            </p>
            <Link
              href="/vermieten"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-px"
            >
              Jetzt Box anbieten
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
