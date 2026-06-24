import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SITE_NAME } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const DESCRIPTION =
  "Leih dir eine Dachbox für den nächsten Trip – oder verdiene Geld mit deiner, wenn sie gerade in der Garage steht. Von Mensch zu Mensch, tageweise.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: `${SITE_NAME} — Dachboxen mieten & vermieten`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "Dachbox mieten",
    "Dachbox vermieten",
    "Dachbox leihen",
    "Dachträger",
    "Roadtrip",
    "Caprio",
  ],
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Dachboxen mieten & vermieten`,
    description: DESCRIPTION,
    images: [
      {
        url: "/dachbox-hero.jpg",
        width: 970,
        height: 660,
        alt: "Caprio – Dachboxen mieten & vermieten",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Dachboxen mieten & vermieten`,
    description: DESCRIPTION,
    images: ["/dachbox-hero.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Read authenticated user; degrades gracefully if Supabase isn't configured yet.
  let user: {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string | null;
  } | null = null;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      if (u) {
        // select("*") is resilient: works whether or not avatar_url exists yet
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", u.id)
          .single();
        user = {
          id: u.id,
          email: u.email!,
          name: profile?.name,
          avatarUrl: profile?.avatar_url ?? null,
        };
      }
    } catch {}
  }

  return (
    <html lang="de" className={`${inter.variable} ${fraunces.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        {/* If JS is unavailable, reveal-on-scroll content must still be visible */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <Navbar user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
