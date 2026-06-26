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
import { Faq } from "@/components/faq";
import { Reveal } from "@/components/reveal";
import { createClient } from "@/lib/supabase/server";
import { mapBoxRow } from "@/lib/data";

const BRANDS = ["Thule", "Kamei", "Hapro", "Yakima", "Atera", "Jetbag"];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: latest } = await supabase
    .from("dachboxen")
    .select("*, profiles(name)")
    .eq("is_available", true)
    .order("created_at", { ascending: false })
    .limit(4);
  const featured = (latest ?? []).map(mapBoxRow);

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="bg-white px-4 pb-8 pt-10 text-center sm:px-8 sm:pt-14">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-[2.4rem] font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Welche Dachbox brauchst du?
          </h1>

          {/* Tripadvisor-style tab row */}
          <div className="mt-7 flex items-center justify-center gap-2">
            {[
              { label: "Dachboxen", href: "/dachboxen" },
              { label: "Vermieten", href: "/vermieten" },
            ].map(({ label, href }, i) => (
              <Link
                key={label}
                href={href}
                className={`group relative px-5 pb-2 pt-1 text-sm font-semibold transition-colors ${
                  i === 0 ? "text-ink" : "text-taupe-500 hover:text-ink"
                }`}
              >
                {label}
                <span
                  className={`absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-ink transition-transform duration-150 ${
                    i === 0 ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Search bar */}
          <form
            action="/dachboxen"
            className="mt-5 flex w-full items-center gap-2 rounded-full border border-taupe-200 bg-white p-1.5 pl-5 shadow-md focus-within:border-clay-600 sm:mt-6"
          >
            <MapPin size={18} className="shrink-0 text-taupe-500" />
            <input
              type="text"
              name="ort"
              placeholder="Stadt oder PLZ eingeben …"
              aria-label="Stadt oder Postleitzahl"
              className="w-full bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-taupe-500"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-clay-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-clay-500"
            >
              <Search size={15} />
              <span className="hidden sm:inline">Suchen</span>
            </button>
          </form>
        </div>
      </section>

      {/* --------------------------------------------------------- Promo card */}
      <section className="bg-white px-4 pb-10 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-lg bg-[#00aa6c] sm:flex sm:min-h-[280px]">
            {/* text side */}
            <div className="flex flex-col justify-center p-8 sm:w-1/2 sm:p-12">
              <h2 className="font-display text-[1.75rem] font-bold leading-tight text-ink sm:text-[2rem]">
                Bei uns findest du Dachboxen für jeden Roadtrip
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/80 sm:text-base">
                Stöbere durch hunderte Angebote – tageweise mieten, fair und unkompliziert.
              </p>
              <Link
                href="/dachboxen"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
              >
                Jetzt entdecken
                <ArrowRight size={15} />
              </Link>
            </div>
            {/* image side with gradient fade into green */}
            <div className="relative h-48 sm:h-auto sm:w-1/2">
              <Image
                src="/dachbox-hero.jpg"
                alt="Unterwegs mit der Dachbox"
                fill
                priority
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
              {/* horizontal fade: left edge blends into the green panel */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#00aa6c] via-[#00aa6c]/20 to-transparent" />
              {/* vertical fade on mobile: top edge blends upward */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#00aa6c] via-[#00aa6c]/20 to-transparent sm:hidden" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Brand strip */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-taupe-500">
            Boxen von Marken, denen Reisende vertrauen
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-16">
            {BRANDS.map((brand) => (
              <span
                key={brand}
                className="font-display text-xl font-bold tracking-tight text-taupe-500 sm:text-2xl"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Featured boxes */}
      {featured.length > 0 && (
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Unverzichtbare Dachboxen in deiner Nähe
            </h2>
            <p className="mt-1 text-sm text-taupe-500">Angebote, die dir gefallen werden</p>
          </div>

          {/* horizontal scroller */}
          <div className="mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-8">
            {featured.map((box) => (
              <div
                key={box.id}
                className="w-[72vw] max-w-[280px] shrink-0 snap-start sm:w-[280px]"
              >
                <BoxCard box={box} />
              </div>
            ))}
          </div>

          {/* CTA button to the full listing page */}
          <div className="mx-auto mt-6 flex max-w-7xl justify-center px-4 sm:justify-start sm:px-8">
            <Link
              href="/dachboxen"
              className="group inline-flex items-center gap-2 rounded-full border border-ink px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
            >
              Alle Dachboxen ansehen
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      )}

      {/* --------------------------------------------------------- Trust strip */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-x-6 px-4 sm:grid-cols-3 sm:px-8">
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
          ].map(({ icon: Icon, title, text }, i) => (
            <Reveal
              key={title}
              delay={i * 90}
              className="flex gap-4 py-6 sm:py-8"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blush-100">
                <Icon size={18} className="text-clay-600" />
              </span>
              <div>
                <h3 className="font-display font-bold text-ink">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-taupe-500">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------- How it works */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8">
          <Reveal>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              In drei Schritten zur Dachbox
            </h2>
            <p className="mt-1 text-sm text-taupe-500">So einfach kommst du an mehr Stauraum</p>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
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
            ].map((step, i) => (
              <Reveal
                key={step.n}
                delay={i * 90}
                className="rounded-lg border border-taupe-100 bg-white p-7"
              >
                <span className="font-display text-3xl font-bold text-taupe-200">
                  {step.n}
                </span>
                <h3 className="mt-4 font-display font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-taupe-500">
                  {step.text}
                </p>
              </Reveal>
            ))}
          </div>

          <Link
            href="/so-funktionierts"
            className="group mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-clay-600 transition-colors hover:text-clay-500"
          >
            Mehr darüber, wie&apos;s funktioniert
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* --------------------------------------------------------- Host CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-8">
        <div className="relative overflow-hidden rounded-xl px-8 py-16 text-white shadow-xl sm:px-14 sm:py-20">
          <Image
            src="/road.jpg"
            alt="Auto mit Dachbox auf einer Bergstraße durch den Wald"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1216px"
            className="object-cover object-[50%_58%]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a2114]/85 via-[#0a2114]/55 to-[#0a2114]/25" />

          <Reveal className="relative max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-blush-300">
              Box vermieten
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              Deine Box steht 50 Wochen im Jahr still.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/75">
              Mach Stauraum, den du selten brauchst, zu einem kleinen Nebenverdienst.
              Du bestimmst Preis, Verfügbarkeit und an wen du vermietest.
            </p>
            <Link
              href="/vermieten"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-ink transition-opacity hover:opacity-90"
            >
              Jetzt Box anbieten
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={13} />
                Sichere Zahlung über Stripe
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Wallet size={13} />
                Geld nach der Übergabe
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles size={13} />
                Du bestimmst den Preis
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------------------- FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-8 sm:py-16">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Häufige Fragen
          </h2>
          <p className="mt-1 text-sm text-taupe-500">
            Alles, was du vor deiner ersten Buchung wissen musst.
          </p>
          <div className="mt-6">
            <Faq />
          </div>
        </div>
      </section>
    </>
  );
}
