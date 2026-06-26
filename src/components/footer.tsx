import Link from "next/link";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { SITE_NAME } from "@/lib/site";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M14 9h2.5l.5-3H14V4.5c0-.85.3-1.5 1.6-1.5H17V.3A21 21 0 0 0 14.8 0C12.4 0 11 1.4 11 4.1V6H8.5v3H11v9h3V9Z" />
    </svg>
  );
}

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

const socials = [
  { href: "https://instagram.com", label: "Instagram", icon: InstagramIcon },
  { href: "https://facebook.com", label: "Facebook", icon: FacebookIcon },
];

export function Footer() {
  return (
    <footer className="bg-paper/60">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        {/* link columns */}
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Link href="/">
              <Image
                src="/logo.png"
                alt={SITE_NAME}
                width={922}
                height={636}
                className="h-12 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Der Marktplatz für Dachboxen von nebenan. Leih dir Stauraum für den
              nächsten Trip – oder verdiene mit, wenn deine Box gerade Pause hat.
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-blush-100 px-3 py-1 text-xs font-medium text-clay-600">
              <ShieldCheck size={13} />
              Sichere Zahlung über Stripe
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

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-sm text-ink-soft sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. Mit Sorgfalt gebaut in
            Deutschland.
          </p>
          <div className="flex items-center gap-2">
            {socials.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-cream text-ink-soft transition-colors hover:border-taupe-300 hover:text-ink"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
