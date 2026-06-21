import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/reveal";
import {
  Search,
  CalendarCheck,
  KeyRound,
  PackageCheck,
  Camera,
  Tag,
  MessagesSquare,
  Banknote,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Receipt,
} from "lucide-react";

export const metadata: Metadata = {
  title: "So funktioniert's",
  description:
    "Wie Caprio funktioniert – für alle, die eine Dachbox mieten, und alle, die ihre eigene vermieten möchten.",
};

const renterSteps = [
  {
    icon: Search,
    title: "Box in deiner Nähe finden",
    text: "Filtere nach Größe, Preis und Ort. Jede Box zeigt dir Maße, Zuladung und echte Bewertungen früherer Mieter:innen.",
  },
  {
    icon: CalendarCheck,
    title: "Zeitraum wählen & anfragen",
    text: "Leg deinen Reisezeitraum fest und schick eine unverbindliche Anfrage. Die vermietende Person bestätigt – oder ihr klärt offene Fragen im Chat.",
  },
  {
    icon: KeyRound,
    title: "Abholen & montieren",
    text: "Ihr trefft euch zur Übergabe. Du bekommst eine kurze Einweisung, montierst die Box aufs Dach – und der Urlaub kann losgehen.",
  },
  {
    icon: PackageCheck,
    title: "Zurückbringen",
    text: "Nach der Reise bringst du die Box sauber zurück. Eine faire Bewertung hilft der ganzen Community.",
  },
];

const hostSteps = [
  {
    icon: Camera,
    title: "Box einstellen",
    text: "Ein paar Fotos, die Maße und eine kurze Beschreibung – fertig ist dein Inserat. Das dauert keine zehn Minuten.",
  },
  {
    icon: Tag,
    title: "Preis & Verfügbarkeit festlegen",
    text: "Du bestimmst den Tagespreis und blockst die Zeiten, in denen du die Box selbst brauchst.",
  },
  {
    icon: MessagesSquare,
    title: "Anfragen annehmen",
    text: "Du entscheidest, an wen du vermietest. Profile, Bewertungen und ein direkter Chat helfen dir dabei.",
  },
  {
    icon: Banknote,
    title: "Dazuverdienen",
    text: "Übergabe, Reise, Rückgabe – und deine Box hat sich selbst ein Stück weit bezahlt gemacht.",
  },
];

const faqs = [
  {
    q: "Was kostet die Nutzung von Caprio?",
    a: "Für Mieter:innen kommt zum Tagespreis eine kleine Servicegebühr dazu. Vermieter:innen behalten den Großteil ihres Tagespreises. Im aktuellen MVP ist alles noch unverbindlich – die Zahlungsabwicklung über Stripe folgt.",
  },
  {
    q: "Wie läuft die Bezahlung ab?",
    a: "Die sichere Bezahlung über Stripe ist für eine der nächsten Versionen geplant. Bis dahin vereinbart ihr die Übergabe direkt miteinander.",
  },
  {
    q: "Was ist mit Versicherung und Schäden?",
    a: "Wir empfehlen, Zustand und Übergabe mit Fotos zu dokumentieren. Ein integrierter Schutz ist Teil unserer Roadmap und kommt mit der Bezahlfunktion.",
  },
  {
    q: "Passt jede Box auf mein Auto?",
    a: "Dachboxen brauchen einen passenden Dachträger. Maße und Trägertyp stehen in jedem Inserat – bei Unsicherheit fragst du einfach kurz die vermietende Person.",
  },
];

export default function SoFunktioniertsPage() {
  return (
    <div className="pb-8">
      {/* hero */}
      <section className="relative overflow-hidden border-b border-line">
        <Image
          src="/dachbox-hero.jpg"
          alt="Unterwegs mit der Dachbox"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2114]/80 via-[#0a2114]/65 to-[#0a2114]/85" />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center text-cream sm:px-8 sm:py-28">
          <p className="text-sm font-medium uppercase tracking-wider text-blush-300">
            So funktioniert's
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Stauraum teilen, statt Boxen kaufen
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-cream/85">
            Caprio bringt Menschen zusammen, die eine Dachbox brauchen, mit
            Menschen, deren Box gerade ungenutzt herumsteht. Gut für den Geldbeutel,
            gut für die Umwelt.
          </p>
        </div>
      </section>

      {/* for renters */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-cream">
            Für Mieter:innen
          </span>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Eine Box mieten
          </h2>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {renterSteps.map((step, i) => (
            <Reveal key={step.title} delay={i * 80} className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-cream">
                <step.icon size={20} className="text-clay-600" />
              </div>
              <p className="mt-4 font-display text-sm font-semibold text-taupe-500">
                Schritt {i + 1}
              </p>
              <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.text}</p>
            </Reveal>
          ))}
        </div>

        <Link
          href="/dachboxen"
          className="group mt-12 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-px"
        >
          Boxen ansehen
          <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </section>

      {/* for hosts */}
      <section className="bg-paper/50">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-blush-200 px-3 py-1 text-xs font-semibold text-clay-600">
              Für Vermieter:innen
            </span>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Deine Box vermieten
            </h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {hostSteps.map((step, i) => (
              <Reveal
                key={step.title}
                delay={i * 80}
                className="rounded-3xl border border-line bg-cream p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blush-100">
                  <step.icon size={20} className="text-clay-600" />
                </div>
                <p className="mt-4 font-display text-sm font-semibold text-taupe-500">
                  Schritt {i + 1}
                </p>
                <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {step.text}
                </p>
              </Reveal>
            ))}
          </div>

          <Link
            href="/vermieten"
            className="group mt-12 inline-flex items-center gap-2 rounded-full border border-ink px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream"
          >
            Mehr zum Vermieten
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* trust */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Vertrauen zuerst",
              text: "Verifizierte Profile und beidseitige Bewertungen sorgen dafür, dass beide Seiten wissen, mit wem sie es zu tun haben.",
            },
            {
              icon: HeartHandshake,
              title: "Persönliche Übergabe",
              text: "Kein anonymer Versand – ihr trefft euch, die Box wird erklärt, Fragen werden direkt geklärt.",
            },
            {
              icon: Receipt,
              title: "Faire, klare Preise",
              text: "Vermieter:innen setzen ihren Tagespreis selbst. Keine versteckten Kosten, alles transparent vor der Buchung.",
            },
          ].map(({ icon: Icon, title, text }, i) => (
            <Reveal
              key={title}
              delay={i * 90}
              className="rounded-3xl border border-line bg-paper/40 p-7"
            >
              <Icon size={22} className="text-clay-600" />
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* faq */}
      <section className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <h2 className="text-center font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Häufige Fragen
        </h2>
        <div className="mt-10 space-y-3">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 70}>
            <details
              className="group rounded-2xl border border-line bg-cream px-6 py-5 transition-colors hover:border-taupe-300 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold">
                {faq.q}
                <span className="text-2xl font-normal text-taupe-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{faq.a}</p>
            </details>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
