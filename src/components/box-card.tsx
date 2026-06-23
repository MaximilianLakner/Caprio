import Link from "next/link";
import { MapPin } from "lucide-react";
import { RoofboxVisual } from "@/components/roofbox-visual";
import { sizeOf, toneForId, type BoxListing } from "@/lib/data";

export function BoxCard({ box }: { box: BoxListing }) {
  return (
    <Link
      href={`/dachboxen/${box.id}`}
      className="group block overflow-hidden rounded-2xl border border-line bg-cream transition-all duration-300 hover:-translate-y-1 hover:border-taupe-300 hover:shadow-[0_18px_40px_-24px_rgba(42,36,33,0.35)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-paper">
        {box.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={box.images[0]}
            alt={box.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <RoofboxVisual
            tone={toneForId(box.id)}
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-2.5 py-1 text-xs font-semibold tracking-wide text-ink backdrop-blur">
          {sizeOf(box.volume)} · {box.volume} L
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-lg font-semibold leading-tight tracking-tight">
              {box.title}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-ink-soft">
              <MapPin size={13} className="text-taupe-500" />
              {box.city}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-paper px-2.5 py-1 text-xs font-semibold text-taupe-700">
            {box.brand}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
          <p className="text-sm text-ink-soft">
            {box.hostName ? `von ${box.hostName}` : "Neu"}
          </p>
          <p className="text-right">
            <span className="font-display text-xl font-semibold">
              {box.pricePerDay} €
            </span>
            <span className="text-sm text-ink-soft"> / Tag</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
