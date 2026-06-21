"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { BoxCard } from "@/components/box-card";
import {
  ALL_BRANDS,
  DACHBOXEN,
  SIZE_LABEL,
  sizeOf,
  matchesLocation,
  type SizeCategory,
} from "@/lib/data";

type SortKey = "empfohlen" | "preis-auf" | "preis-ab" | "bewertung";

const SIZES: SizeCategory[] = ["S", "M", "L"];
const PRICE_MAX = 20;

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "empfohlen", label: "Empfohlen" },
  { value: "preis-auf", label: "Preis: niedrig → hoch" },
  { value: "preis-ab", label: "Preis: hoch → niedrig" },
  { value: "bewertung", label: "Beste Bewertung" },
];

export function BrowseClient({ initialOrt }: { initialOrt: string }) {
  const [ort, setOrt] = useState(initialOrt);
  const [sizes, setSizes] = useState<SizeCategory[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [sort, setSort] = useState<SortKey>("empfohlen");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(() => {
    const filtered = DACHBOXEN.filter((b) => {
      if (!matchesLocation(b, ort)) return false;
      if (sizes.length && !sizes.includes(sizeOf(b.volume))) return false;
      if (brands.length && !brands.includes(b.brand)) return false;
      if (b.pricePerDay > maxPrice) return false;
      return true;
    });

    const sorted = [...filtered];
    switch (sort) {
      case "preis-auf":
        sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case "preis-ab":
        sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case "bewertung":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        sorted.sort(
          (a, b) => Number(b.superhost) - Number(a.superhost) || b.reviews - a.reviews
        );
    }
    return sorted;
  }, [ort, sizes, brands, maxPrice, sort]);

  const activeCount =
    sizes.length + brands.length + (maxPrice < PRICE_MAX ? 1 : 0) + (ort ? 1 : 0);

  function toggle<T>(list: T[], value: T, set: (v: T[]) => void) {
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  function reset() {
    setOrt("");
    setSizes([]);
    setBrands([]);
    setMaxPrice(PRICE_MAX);
    setSort("empfohlen");
  }

  const filterPanel = (
    <div className="space-y-7">
      {/* Ort */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-taupe-700">
          Stadt oder PLZ
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-line bg-cream px-3">
          <Search size={16} className="text-taupe-500" />
          <input
            value={ort}
            onChange={(e) => setOrt(e.target.value)}
            placeholder="z. B. Berlin oder 10115"
            className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-taupe-500"
          />
        </div>
      </div>

      {/* Größe */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-taupe-700">
          Größe
        </span>
        <div className="mt-3 space-y-2">
          {SIZES.map((s) => {
            const on = sizes.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggle(sizes, s, setSizes)}
                className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors ${
                  on
                    ? "border-ink bg-ink text-cream"
                    : "border-line bg-cream text-ink hover:border-taupe-300"
                }`}
              >
                <span className="font-medium">Größe {s}</span>
                <span className={on ? "text-cream/70" : "text-ink-soft"}>
                  {SIZE_LABEL[s].split("·")[1]?.trim()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preis */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-taupe-700">
            Preis pro Tag
          </span>
          <span className="text-sm font-medium">
            {maxPrice >= PRICE_MAX ? "alle" : `bis ${maxPrice} €`}
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={PRICE_MAX}
          step={1}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="mt-3 w-full accent-clay-600"
        />
        <div className="mt-1 flex justify-between text-xs text-ink-soft">
          <span>5 €</span>
          <span>{PRICE_MAX}+ €</span>
        </div>
      </div>

      {/* Marke */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-taupe-700">
          Marke
        </span>
        <div className="mt-3 flex flex-wrap gap-2">
          {ALL_BRANDS.map((brand) => {
            const on = brands.includes(brand);
            return (
              <button
                key={brand}
                type="button"
                onClick={() => toggle(brands, brand, setBrands)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  on
                    ? "border-clay-600 bg-blush-100 text-clay-600"
                    : "border-line bg-cream text-ink-soft hover:border-taupe-300"
                }`}
              >
                {brand}
              </button>
            );
          })}
        </div>
      </div>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={reset}
          className="text-sm font-medium text-clay-600 underline-offset-2 hover:underline"
        >
          Filter zurücksetzen
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-3 py-12 sm:px-8">
      {/* header */}
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Finde deine Dachbox
        </h1>
        <p className="mt-3 text-lg text-ink-soft">
          {results.length} {results.length === 1 ? "Box" : "Boxen"} verfügbar
          {ort ? ` in „${ort}“` : ""}.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-10 lg:flex-row">
        {/* sidebar — desktop */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-line bg-paper/40 p-6">
            {filterPanel}
          </div>
        </aside>

        {/* results */}
        <div className="flex-1">
          {/* toolbar */}
          <div className="mb-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-cream px-4 py-2 text-sm font-medium lg:hidden"
            >
              <SlidersHorizontal size={15} />
              Filter
              {activeCount > 0 && (
                <span className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-xs text-cream">
                  {activeCount}
                </span>
              )}
            </button>

            <label className="ml-auto flex items-center gap-2 text-sm">
              <span className="hidden text-ink-soft sm:inline">Sortieren:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-full border border-line bg-cream px-3.5 py-2 text-sm font-medium outline-none focus:border-taupe-300"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {results.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((box) => (
                <BoxCard key={box.id} box={box} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-taupe-300 bg-paper/40 px-6 py-20 text-center">
              <p className="font-display text-xl font-semibold">
                Keine Box passt zu diesen Filtern
              </p>
              <p className="mt-2 text-ink-soft">
                Versuch es mit einem größeren Preisrahmen oder weniger Filtern.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream"
              >
                Filter zurücksetzen
              </button>
            </div>
          )}
        </div>
      </div>

      {/* mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-2xl bg-cream p-6 pb-10">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Filter</h2>
              <button
                type="button"
                aria-label="Schließen"
                onClick={() => setFiltersOpen(false)}
                className="rounded-full p-1.5 hover:bg-paper"
              >
                <X size={20} />
              </button>
            </div>
            {filterPanel}
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="mt-8 w-full rounded-full bg-ink py-3 text-sm font-medium text-cream"
            >
              {results.length} {results.length === 1 ? "Box" : "Boxen"} anzeigen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
