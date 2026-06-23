export type SizeCategory = "S" | "M" | "L";

/** A roof-box listing as shown in the UI (mapped from a Supabase row). */
export type BoxListing = {
  id: string;
  title: string;
  brand: string;
  city: string;
  pricePerDay: number; // EUR
  volume: number; // liters
  lengthCm: number;
  maxLoadKg: number;
  opening: string;
  mounting: string | null;
  description: string;
  features: string[];
  images: string[];
  hostName: string | null;
};

/** Maps a raw Supabase `dachboxen` row (with optional profiles join) to BoxListing. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapBoxRow(row: any): BoxListing {
  const host = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  return {
    id: row.id,
    title: row.title,
    brand: row.brand,
    city: row.city,
    pricePerDay: Number(row.price_per_day),
    volume: row.volume,
    lengthCm: row.length_cm,
    maxLoadKg: row.max_load_kg,
    opening: row.opening,
    mounting: row.mounting ?? null,
    description: row.description ?? "",
    features: row.features ?? [],
    images: row.images ?? [],
    hostName: host?.name ?? null,
  };
}

export const TONES = [
  { from: "#a6d2b6", to: "#afc4cf" }, // sage → sky
  { from: "#c9e6d4", to: "#a6d2b6" }, // mint
  { from: "#afc4cf", to: "#cdddd4" }, // sky → green-grey
  { from: "#cdddd4", to: "#a6d2b6" }, // green-grey → sage
  { from: "#e4ede7", to: "#afc4cf" }, // pale → sky
];

/** Deterministic placeholder tone for a box without photos. */
export function toneForId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % TONES.length;
}

export function sizeOf(volume: number): SizeCategory {
  if (volume < 350) return "S";
  if (volume <= 470) return "M";
  return "L";
}

export const SIZE_LABEL: Record<SizeCategory, string> = {
  S: "Kompakt · bis 350 L",
  M: "Mittel · 350–470 L",
  L: "Groß · ab 470 L",
};

/** Representative postal code per city, so users can search by PLZ too. */
export const CITY_PLZ: Record<string, string> = {
  München: "80331",
  Leipzig: "04109",
  Stuttgart: "70173",
  Hamburg: "20095",
  Köln: "50667",
  Berlin: "10115",
  Freiburg: "79098",
  Nürnberg: "90402",
  Dresden: "01067",
};

/** Matches a city against a city-name or postal-code query. */
export function matchesCity(city: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (city.toLowerCase().includes(q)) return true;
  const plz = CITY_PLZ[city];
  return plz ? plz.startsWith(q) : false;
}
