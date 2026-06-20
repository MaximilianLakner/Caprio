"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SITE_NAME } from "@/lib/site";
import { signOut } from "@/lib/actions/auth";

type NavUser = { id: string; email: string; name?: string } | null;

export function Navbar({ user }: { user: NavUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const displayName = user?.name ?? user?.email?.split("@")[0] ?? "";

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-cream/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Image
            src="/logo.png"
            alt={SITE_NAME}
            width={1802}
            height={872}
            className="h-12 w-auto"
            priority
          />
        </Link>

        {/* desktop nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-paper text-ink"
                    : "text-ink-soft hover:bg-paper/70 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* desktop auth */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link
                href="/meine-boxen"
                className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
              >
                {displayName}
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
                >
                  Abmelden
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/anmelden"
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              Anmelden
            </Link>
          )}
          <Link
            href="/dachboxen"
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream transition-transform hover:-translate-y-px hover:bg-ink/90"
          >
            Box finden
          </Link>
        </div>

        {/* mobile toggle */}
        <button
          type="button"
          aria-label="Menü"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full p-2 text-ink md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* mobile drawer */}
      {open && (
        <div className="border-t border-line/70 bg-cream px-5 pb-6 pt-2 md:hidden">
          <div className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-line/60 py-3 text-base font-medium text-ink"
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/meine-boxen"
                onClick={() => setOpen(false)}
                className="border-b border-line/60 py-3 text-base font-medium text-ink"
              >
                Meine Boxen
              </Link>
            )}
          </div>
          <div className="mt-5 flex flex-col gap-3">
            {user ? (
              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full rounded-full border border-line px-4 py-3 text-center text-sm font-medium text-ink"
                >
                  Abmelden
                </button>
              </form>
            ) : (
              <Link
                href="/anmelden"
                onClick={() => setOpen(false)}
                className="rounded-full border border-line px-4 py-3 text-center text-sm font-medium text-ink"
              >
                Anmelden
              </Link>
            )}
            <Link
              href="/dachboxen"
              onClick={() => setOpen(false)}
              className="rounded-full bg-ink px-4 py-3 text-center text-sm font-medium text-cream"
            >
              Box finden
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
