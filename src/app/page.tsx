import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  CalendarDays,
  Wallet,
  Sparkles,
  Search,
  MapPin,
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
      <section className="relative flex h-[calc(100svh-4rem)] flex-col items-center justify-center overflow-hidden px-3 text-center sm:px-8">
        <div className="grain pointer-events-none absolute inset-0" />

        <div className="relative flex w-full max-w-4xl flex-col items-center">
          <span className="animate-rise inline-flex items-center gap-2 rounded-full border border-line bg-paper/70 px-3 py-1 text-xs font-medium text-taupe-700">
            <Sparkles size={13} className="text-clay-500" />
            Dachboxen mieten &amp; vermieten — von Mensch zu Mensch
          </span>

          <h1 className="animate-rise mt-6 max-w-3xl font-display text-[2.6rem] font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
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

          <p className="animate-rise mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Leih dir eine Dachbox aus deiner Nähe – tageweise, fair und unkompliziert.
          </p>

          {/* city / postal-code search */}
          <form
            action="/dachboxen"
            className="animate-rise mt-7 flex w-full max-w-lg items-center gap-2 rounded-full border border-line bg-cream p-1.5 pl-5 shadow-[0_18px_50px_-30px_rgba(17,53,29,0.55)] transition-colors focus-within:border-clay-500"
          >
            <MapPin size={18} className="shrink-0 text-clay-600" />
            <input
              type="text"
              name="ort"
              placeholder="Stadt oder PLZ eingeben …"
              aria-label="Stadt oder Postleitzahl"
              className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-taupe-500"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-cream transition-transform hover:-translate-y-px"
            >
              <Search size={16} />
              <span className="hidden sm:inline">Suchen</span>
            </button>
          </form>

          <div className="animate-rise mt-5 flex items-center gap-4 text-sm">
            <Link
              href="/dachboxen"
              className="font-medium text-ink transition-colors hover:text-clay-600"
            >
              Alle Boxen ansehen
            </Link>
            <span className="text-taupe-300">·</span>
            <Link
              href="/vermieten"
              className="font-medium text-ink transition-colors hover:text-clay-600"
            >
              Box vermieten
            </Link>
          </div>
        </div>

        {/* hero illustration */}
        <HeroIllustration className="animate-rise pointer-events-none relative mt-6 max-h-[32vh] w-full max-w-2xl" />
      </section>

      {/* ---------------------------------------------------------- Brand strip */}
      <section className="border-t border-line bg-cream">
        <div className="mx-auto max-w-6xl px-3 py-9 sm:px-8">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-taupe-500">
            Boxen von Marken, denen Reisende vertrauen
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-5 opacity-75 sm:gap-x-20">
            {BRANDS.map((brand) => (
              <span
                key={brand}
                className="font-display text-2xl font-semibold tracking-tight text-taupe-700 sm:text-3xl"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Featured boxes */}
      <section className="mx-auto max-w-7xl px-3 py-20 sm:px-8">
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

      {/* --------------------------------------------------------- Trust strip */}
      <section className="border-y border-line bg-paper/50">
        <div className="mx-auto grid max-w-7xl gap-px px-3 py-10 sm:grid-cols-3 sm:px-8">
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
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-cream">
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

      {/* --------------------------------------------------- How it works teaser */}
      <section className="bg-paper/50">
        <div className="mx-auto max-w-7xl px-3 py-20 sm:px-8">
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
                className="relative rounded-2xl border border-blush-200 bg-blush-100 p-7"
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
      <section className="mx-auto max-w-7xl px-3 py-20 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/15 px-8 py-16 text-cream shadow-[0_36px_80px_-40px_rgba(17,53,29,0.7)] ring-1 ring-inset ring-white/10 sm:px-14 sm:py-20">
          {/* photo background */}
          <Image
            src="/road.jpg"
            alt="Auto mit Dachbox auf einer Bergstraße durch den Wald"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1216px"
            className="object-cover object-[50%_58%]"
          />
          {/* darkening filter for legibility — forest-tinted, stronger on the left */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a2114]/85 via-[#0a2114]/55 to-[#0a2114]/25" />
          <div className="pointer-events-none absolute inset-0 bg-[#0a2114]/20" />

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
