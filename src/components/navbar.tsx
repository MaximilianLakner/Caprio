"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Plus, Settings, Package, LogOut } from "lucide-react";
import { NAV_LINKS, SITE_NAME } from "@/lib/site";
import { signOut } from "@/lib/actions/auth";
import { Avatar } from "@/components/avatar";

type NavUser = {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string | null;
} | null;

export function Navbar({ user }: { user: NavUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = user?.name ?? user?.email?.split("@")[0] ?? "";

  // close the avatar dropdown on outside click / route change
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-cream/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Image
            src="/logo.png"
            alt={SITE_NAME}
            width={910}
            height={623}
            className="h-14 w-auto"
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

        {/* desktop auth / actions */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href="/vermieten/inserat"
                className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream transition-transform hover:-translate-y-px hover:bg-ink/90"
              >
                <Plus size={16} />
                Dachbox hinzufügen
              </Link>

              {/* avatar + dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="Profilmenü"
                  aria-expanded={menuOpen}
                  className="rounded-full ring-offset-2 ring-offset-cream transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                >
                  <Avatar name={user.name} email={user.email} src={user.avatarUrl} className="h-10 w-10" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-2xl border border-line bg-cream shadow-[0_18px_50px_-20px_rgba(17,53,29,0.35)]">
                    <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
                      <Avatar name={user.name} email={user.email} src={user.avatarUrl} className="h-10 w-10" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{displayName}</p>
                        <p className="truncate text-xs text-ink-soft">{user.email}</p>
                      </div>
                    </div>
                    <div className="p-1.5">
                      <Link
                        href="/profil"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-paper"
                      >
                        <Settings size={16} className="text-ink-soft" />
                        Profil bearbeiten
                      </Link>
                      <Link
                        href="/meine-boxen"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-paper"
                      >
                        <Package size={16} className="text-ink-soft" />
                        Meine Boxen
                      </Link>
                    </div>
                    <div className="border-t border-line p-1.5">
                      <form action={signOut}>
                        <button
                          type="submit"
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-paper"
                        >
                          <LogOut size={16} className="text-ink-soft" />
                          Abmelden
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/anmelden"
                className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
              >
                Anmelden
              </Link>
              <Link
                href="/dachboxen"
                className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream transition-transform hover:-translate-y-px hover:bg-ink/90"
              >
                Box finden
              </Link>
            </>
          )}
        </div>

        {/* mobile right side */}
        <div className="flex items-center gap-2 md:hidden">
          {user && (
            <Link href="/profil" aria-label="Profil" onClick={() => setOpen(false)}>
              <Avatar name={user.name} email={user.email} src={user.avatarUrl} className="h-9 w-9" />
            </Link>
          )}
          <button
            type="button"
            aria-label="Menü"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 text-ink"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
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
              <>
                <Link
                  href="/profil"
                  onClick={() => setOpen(false)}
                  className="border-b border-line/60 py-3 text-base font-medium text-ink"
                >
                  Profil bearbeiten
                </Link>
                <Link
                  href="/meine-boxen"
                  onClick={() => setOpen(false)}
                  className="border-b border-line/60 py-3 text-base font-medium text-ink"
                >
                  Meine Boxen
                </Link>
              </>
            )}
          </div>
          <div className="mt-5 flex flex-col gap-3">
            {user ? (
              <>
                <Link
                  href="/vermieten/inserat"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-3 text-sm font-medium text-cream"
                >
                  <Plus size={16} />
                  Dachbox hinzufügen
                </Link>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="w-full rounded-full border border-line px-4 py-3 text-center text-sm font-medium text-ink"
                  >
                    Abmelden
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/anmelden"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-line px-4 py-3 text-center text-sm font-medium text-ink"
                >
                  Anmelden
                </Link>
                <Link
                  href="/dachboxen"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-ink px-4 py-3 text-center text-sm font-medium text-cream"
                >
                  Box finden
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
