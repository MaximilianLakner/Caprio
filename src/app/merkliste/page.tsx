"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { BoxCard } from "@/components/box-card";
import { useFavorites } from "@/lib/use-favorites";

export default function MerklistePage() {
  const { favorites, count, ready } = useFavorites();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blush-100">
          <Heart size={20} className="fill-clay-600 text-clay-600" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Deine Merkliste
          </h1>
          <p className="mt-0.5 text-sm text-taupe-500">
            {ready
              ? count > 0
                ? `${count} gespeicherte ${count === 1 ? "Dachbox" : "Dachboxen"}`
                : "Noch keine Dachboxen gespeichert"
              : "Wird geladen …"}
          </p>
        </div>
      </div>

      {ready && count === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-taupe-300 bg-paper/40 px-6 py-20 text-center">
          <p className="mx-auto max-w-md text-ink-soft">
            Tippe bei einer Dachbox auf das{" "}
            <Heart size={14} className="inline -translate-y-px" /> Herz, um sie hier
            zu speichern und später schnell wiederzufinden.
          </p>
          <Link
            href="/dachboxen"
            className="group mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Dachboxen entdecken
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {favorites.map((box) => (
            <BoxCard key={box.id} box={box} />
          ))}
        </div>
      )}
    </section>
  );
}
