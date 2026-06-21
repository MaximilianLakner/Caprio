"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ImageCarousel({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  const go = (dir: number) => setIndex((i) => (i + dir + count) % count);

  return (
    <div>
      {/* main image */}
      <div className="group relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-line bg-paper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]}
          alt={`${alt} – Bild ${index + 1}`}
          className="h-full w-full object-cover"
        />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Vorheriges Bild"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-ink shadow-md transition hover:bg-cream"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Nächstes Bild"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-ink shadow-md transition hover:bg-cream"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-3 right-3 rounded-full bg-ink/75 px-2.5 py-1 text-xs font-medium text-cream">
              {index + 1} / {count}
            </div>
          </>
        )}
      </div>

      {/* thumbnails */}
      {count > 1 && (
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Bild ${i + 1} anzeigen`}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                i === index ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
