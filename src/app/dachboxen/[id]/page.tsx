import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Star,
  MapPin,
  Box as BoxIcon,
  Ruler,
  Weight,
  DoorOpen,
  ShieldCheck,
  Check,
} from "lucide-react";
import { RoofboxVisual } from "@/components/roofbox-visual";
import { BookingCard } from "./booking-card";
import { DACHBOXEN, getBox, sizeOf, SIZE_LABEL } from "@/lib/data";

export function generateStaticParams() {
  return DACHBOXEN.map((b) => ({ id: b.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const box = getBox(id);
  if (!box) return { title: "Box nicht gefunden" };
  return {
    title: `${box.title} in ${box.city}`,
    description: box.description,
  };
}

export default async function BoxDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const box = getBox(id);
  if (!box) notFound();

  const specs = [
    { icon: BoxIcon, label: "Volumen", value: `${box.volume} L · Größe ${sizeOf(box.volume)}` },
    { icon: Ruler, label: "Länge", value: `${box.lengthCm} cm` },
    { icon: Weight, label: "Max. Zuladung", value: `${box.maxLoadKg} kg` },
    { icon: DoorOpen, label: "Öffnung", value: box.opening },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <Link
        href="/dachboxen"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} />
        Zurück zu allen Boxen
      </Link>

      <div className="mt-6 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        {/* main */}
        <div>
          <div className="overflow-hidden rounded-[2rem] border border-line">
            <RoofboxVisual tone={box.tone} className="aspect-[16/10] w-full" />
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-taupe-700">
                {box.brand}
              </span>
              {box.superhost && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blush-100 px-3 py-1 text-xs font-semibold text-clay-600">
                  <ShieldCheck size={13} />
                  Top-Vermieter
                </span>
              )}
            </div>

            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {box.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={15} className="text-taupe-500" />
                {box.city}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star size={15} className="fill-clay-500 text-clay-500" />
                <span className="font-medium text-ink">{box.rating.toFixed(2)}</span>
                ({box.reviews} Bewertungen)
              </span>
              <span>{SIZE_LABEL[sizeOf(box.volume)]}</span>
            </div>
          </div>

          {/* specs */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {specs.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-line bg-paper/40 p-4"
              >
                <Icon size={18} className="text-clay-600" />
                <p className="mt-3 text-xs uppercase tracking-wide text-taupe-700">
                  {label}
                </p>
                <p className="mt-0.5 font-medium capitalize">{value}</p>
              </div>
            ))}
          </div>

          {/* description */}
          <div className="mt-10 border-t border-line pt-8">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Über diese Box
            </h2>
            <p className="mt-4 leading-relaxed text-ink-soft">{box.description}</p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {box.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blush-100">
                    <Check size={12} className="text-clay-600" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* host */}
          <div className="mt-10 flex items-center gap-4 rounded-3xl border border-line bg-paper/40 p-6">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-taupe-200 font-display text-xl font-semibold text-ink">
              {box.host.charAt(0)}
            </span>
            <div>
              <p className="font-semibold">
                Vermietet von {box.host}
                {box.superhost && (
                  <span className="ml-2 text-sm font-normal text-clay-600">
                    · Top-Vermieter
                  </span>
                )}
              </p>
              <p className="text-sm text-ink-soft">
                Mitglied seit {box.hostSince} · {box.reviews} abgeschlossene Vermietungen
              </p>
            </div>
          </div>
        </div>

        {/* booking sidebar */}
        <div>
          <div className="sticky top-24">
            <BookingCard pricePerDay={box.pricePerDay} rating={box.rating} reviews={box.reviews} />
          </div>
        </div>
      </div>
    </div>
  );
}
