"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Plus, Settings, Package, CalendarCheck, LogOut, Heart } from "lucide-react";
import { NAV_LINKS, SITE_NAME } from "@/lib/site";
import { signOut } from "@/lib/actions/auth";
import { Avatar } from "@/components/avatar";
import { useFavorites } from "@/lib/use-favorites";

/** Heart icon linking to the Merkliste, with a live saved-count badge. */
function FavoritesLink({ onClick }: { onClick?: () => void }) {
  const { count, ready } = useFavorites();
  return (
    <Link
      href="/merkliste"
      onClick={onClick}
      aria-label={`Merkliste${ready && count ? ` (${count})` : ""}`}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper"
    >
      <Heart size={20} className={ready && count ? "fill-clay-600 text-clay-600" : ""} />
      {ready && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay-600 px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}

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
    <header className="sticky top-0 z-50 bg-white">
      <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Logo */}
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

        {/* Desktop nav links — centered, Tripadvisor-style underline */}
        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-ink after:transition-transform after:duration-150 ${
                  active
                    ? "text-ink after:scale-x-100"
                    : "text-ink-soft after:scale-x-0 hover:text-ink hover:after:scale-x-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop auth */}
        <div className="hidden items-center gap-2 md:flex">
          <FavoritesLink />
          {user ? (
            <>
              <Link
                href="/vermieten/inserat"
                className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <Plus size={16} />
                Dachbox hinzufügen
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="Profilmenü"
                  aria-expanded={menuOpen}
                  className="rounded-full ring-offset-2 ring-offset-white transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                >
                  <Avatar name={user.name} email={user.email} src={user.avatarUrl} className="h-10 w-10" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-lg border border-line bg-white shadow-lg">
                    <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
                      <Avatar name={user.name} email={user.email} src={user.avatarUrl} className="h-10 w-10" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{displayName}</p>
                        <p className="truncate text-xs text-ink-soft">{user.email}</p>
                      </div>
                    </div>
                    <div className="p-1.5">
                      {[
                        { href: "/profil", icon: Settings, label: "Profil bearbeiten" },
                        { href: "/meine-boxen", icon: Package, label: "Meine Boxen" },
                        { href: "/meine-buchungen", icon: CalendarCheck, label: "Meine Buchungen" },
                      ].map(({ href, icon: Icon, label }) => (
                        <Link
                          key={href}
                          href={href}
                          className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-cream"
                        >
                          <Icon size={16} className="text-ink-soft" />
                          {label}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-line p-1.5">
                      <form action={signOut}>
                        <button
                          type="submit"
                          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-cream"
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
            <Link
              href="/anmelden"
              className="ml-1 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Anmelden
            </Link>
          )}
        </div>

        {/* Mobile right */}
        <div className="flex items-center gap-1 md:hidden">
          <FavoritesLink onClick={() => setOpen(false)} />
          {user && (
            <Link href="/profil" aria-label="Profil" onClick={() => setOpen(false)}>
              <Avatar name={user.name} email={user.email} src={user.avatarUrl} className="h-9 w-9" />
            </Link>
          )}
          <button
            type="button"
            aria-label="Menü"
            onClick={() => setOpen((v) => !v)}
            className="p-2 text-ink"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="bg-white px-5 pb-6 pt-2 shadow-lg md:hidden">
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
            <Link
              href="/merkliste"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 border-b border-line/60 py-3 text-base font-medium text-ink"
            >
              <Heart size={17} className="text-ink-soft" />
              Merkliste
            </Link>
            {user && (
              <>
                {[
                  { href: "/profil", label: "Profil bearbeiten" },
                  { href: "/meine-boxen", label: "Meine Boxen" },
                  { href: "/meine-buchungen", label: "Meine Buchungen" },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="border-b border-line/60 py-3 text-base font-medium text-ink"
                  >
                    {label}
                  </Link>
                ))}
              </>
            )}
          </div>
          <div className="mt-5 flex flex-col gap-3">
            {user ? (
              <>
                <Link
                  href="/vermieten/inserat"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-3 text-sm font-medium text-white"
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
              <Link
                href="/anmelden"
                onClick={() => setOpen(false)}
                className="rounded-full bg-ink px-4 py-3 text-center text-sm font-medium text-white"
              >
                Anmelden
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
