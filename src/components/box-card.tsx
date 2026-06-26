"use client";

import Link from "next/link";
import { MapPin, Heart } from "lucide-react";
import { RoofboxVisual } from "@/components/roofbox-visual";
import { sizeOf, toneForId, type BoxListing } from "@/lib/data";

export function BoxCard({ box }: { box: BoxListing }) {
  return (
    <Link
      href={`/dachboxen/${box.id}`}
      className="group block overflow-hidden rounded-lg border border-line bg-white transition-shadow duration-300 hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-paper">
        {box.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={box.images[0]}
            alt={box.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <RoofboxVisual
            tone={toneForId(box.id)}
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
        {/* Heart */}
        <button
          type="button"
          aria-label="Merken"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-soft shadow-sm transition-colors hover:text-clay-600"
          onClick={(e) => e.preventDefault()}
        >
          <Heart size={15} />
        </button>
        {/* Size badge */}
        <span className="absolute bottom-3 left-3 rounded bg-white/90 px-2 py-0.5 text-xs font-semibold text-ink backdrop-blur-sm">
          {sizeOf(box.volume)} · {box.volume} L
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-taupe-500">
          <MapPin size={11} />
          {box.city}
        </p>

        <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-ink">
          {box.title}
        </h3>

        <p className="mt-0.5 text-xs text-taupe-500">{box.brand}</p>

        <p className="mt-3 text-sm text-ink">
          ab{" "}
          <span className="text-base font-bold">{box.pricePerDay} €</span>
          <span className="text-taupe-500"> / Tag</span>
        </p>
      </div>
    </Link>
  );
}
