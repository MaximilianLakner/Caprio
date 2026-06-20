import Link from "next/link";
import Image from "next/image";
import { SITE_NAME } from "@/lib/site";

const columns = [
  {
    title: "Entdecken",
    links: [
      { href: "/dachboxen", label: "Dachboxen finden" },
      { href: "/so-funktionierts", label: "So funktioniert's" },
      { href: "/vermieten", label: "Box vermieten" },
    ],
  },
  {
    title: "Unternehmen",
    links: [
      { href: "/ueber-uns", label: "Über uns" },
      { href: "/presse", label: "Presse" },
      { href: "/kontakt", label: "Kontakt" },
    ],
  },
  {
    title: "Rechtliches",
    links: [
      { href: "/impressum", label: "Impressum" },
      { href: "/datenschutz", label: "Datenschutz" },
      { href: "/agb", label: "AGB" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-paper/60">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Link href="/">
              <Image
                src="/logo.png"
                alt={SITE_NAME}
                width={1802}
                height={872}
                className="h-8 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Der Marktplatz für Dachboxen von nebenan. Leih dir Stauraum für den
              nächsten Trip – oder verdiene mit, wenn deine Box gerade Pause hat.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-taupe-700">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-soft transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-sm text-ink-soft sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. Mit Sorgfalt gebaut in
            Deutschland.
          </p>
          <p className="text-taupe-700">Bezahlung folgt · MVP-Vorschau</p>
        </div>
      </div>
    </footer>
  );
}
