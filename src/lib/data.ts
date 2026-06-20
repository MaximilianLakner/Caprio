export type SizeCategory = "S" | "M" | "L";

export type Dachbox = {
  id: string;
  title: string;
  brand: string;
  city: string;
  pricePerDay: number; // EUR
  volume: number; // liters
  lengthCm: number;
  maxLoadKg: number;
  opening: "einseitig" | "beidseitig";
  rating: number;
  reviews: number;
  host: string;
  hostSince: number; // year
  superhost: boolean;
  /** index into TONES for the card visual */
  tone: number;
  description: string;
  features: string[];
};

export const TONES = [
  { from: "#a6d2b6", to: "#afc4cf" }, // sage → sky
  { from: "#c9e6d4", to: "#a6d2b6" }, // mint
  { from: "#afc4cf", to: "#cdddd4" }, // sky → green-grey
  { from: "#cdddd4", to: "#a6d2b6" }, // green-grey → sage
  { from: "#e4ede7", to: "#afc4cf" }, // pale → sky
];

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

export const DACHBOXEN: Dachbox[] = [
  {
    id: "thule-motion-xt-l",
    title: "Thule Motion XT L",
    brand: "Thule",
    city: "München",
    pricePerDay: 14,
    volume: 450,
    lengthCm: 206,
    maxLoadKg: 75,
    opening: "beidseitig",
    rating: 4.93,
    reviews: 64,
    host: "Lena",
    hostSince: 2022,
    superhost: true,
    tone: 0,
    description:
      "Meine treue Motion XT für lange Familienurlaube. Geht auf Knopfdruck auf beiden Seiten auf, montiert ist sie in zehn Minuten. Skiträger-Set kann ich auf Wunsch dazulegen.",
    features: ["Beidseitige Öffnung", "Schnellmontage", "Zentralverriegelung", "Skitauglich"],
  },
  {
    id: "kamei-husky-330",
    title: "Kamei Husky 330",
    brand: "Kamei",
    city: "Leipzig",
    pricePerDay: 9,
    volume: 330,
    lengthCm: 178,
    maxLoadKg: 50,
    opening: "einseitig",
    rating: 4.81,
    reviews: 37,
    host: "Jonas",
    hostSince: 2023,
    superhost: false,
    tone: 1,
    description:
      "Kompakte Box für den Wochenendtrip oder den Festival-Sommer. Passt auf fast jede Reling. Liegt bei mir in der Tiefgarage und wartet auf ihren nächsten Einsatz.",
    features: ["Leicht zu heben", "Passt in die Garage", "Inkl. Spanngurte"],
  },
  {
    id: "thule-vector-alpine",
    title: "Thule Vector Alpine",
    brand: "Thule",
    city: "Stuttgart",
    pricePerDay: 19,
    volume: 360,
    lengthCm: 230,
    maxLoadKg: 75,
    opening: "beidseitig",
    rating: 5.0,
    reviews: 21,
    host: "Mira",
    hostSince: 2021,
    superhost: true,
    tone: 2,
    description:
      "Die elegante, sehr flache Vector mit beleuchtetem Innenraum und Filzmatten. Perfekt für lange, schmale Ladung wie Ski oder Stative. Sieht auf dem Auto einfach gut aus.",
    features: ["LED-Innenbeleuchtung", "Filz-Innenausstattung", "Sehr aerodynamisch"],
  },
  {
    id: "hapro-trivor-560",
    title: "Hapro Trivor 560",
    brand: "Hapro",
    city: "Hamburg",
    pricePerDay: 17,
    volume: 560,
    lengthCm: 222,
    maxLoadKg: 75,
    opening: "beidseitig",
    rating: 4.88,
    reviews: 49,
    host: "Tomasz",
    hostSince: 2020,
    superhost: true,
    tone: 3,
    description:
      "Riesige Box für den großen Umzug oder den Campingurlaub mit Kind und Kegel. Schluckt vier Reisetaschen plus Bettzeug locker. Abholung in Hamburg-Altona.",
    features: ["XXL-Volumen", "Beidseitige Öffnung", "Robuste Schale"],
  },
  {
    id: "jetbag-evo-320",
    title: "Jetbag Evo 320",
    brand: "Jetbag",
    city: "Köln",
    pricePerDay: 8,
    volume: 320,
    lengthCm: 175,
    maxLoadKg: 50,
    opening: "einseitig",
    rating: 4.62,
    reviews: 18,
    host: "Sarah",
    hostSince: 2024,
    superhost: false,
    tone: 4,
    description:
      "Günstige Einsteigerbox, top für den Kurztrip an die See. Etwas Gebrauchsspuren, aber dicht und sicher. Ideal, wenn du einfach mal mehr Platz brauchst.",
    features: ["Bester Preis", "Kompakt", "Schnell montiert"],
  },
  {
    id: "thule-touring-700",
    title: "Thule Touring 700",
    brand: "Thule",
    city: "Berlin",
    pricePerDay: 13,
    volume: 420,
    lengthCm: 198,
    maxLoadKg: 75,
    opening: "beidseitig",
    rating: 4.95,
    reviews: 88,
    host: "David",
    hostSince: 2019,
    superhost: true,
    tone: 1,
    description:
      "Allrounder in Titan-Optik, den ich seit Jahren vermiete. Unkomplizierte Übergabe in Berlin-Pankow, Einweisung inklusive. Über 80 zufriedene Mieter:innen.",
    features: ["Beidseitige Öffnung", "Persönliche Einweisung", "Top gepflegt"],
  },
  {
    id: "kamei-corvara-475",
    title: "Kamei Corvara 475",
    brand: "Kamei",
    city: "Freiburg",
    pricePerDay: 12,
    volume: 475,
    lengthCm: 196,
    maxLoadKg: 75,
    opening: "einseitig",
    rating: 4.79,
    reviews: 29,
    host: "Annika",
    hostSince: 2022,
    superhost: false,
    tone: 0,
    description:
      "Geräumige Box mit mattem Finish, die wir nur im Winter selbst brauchen. Den Rest des Jahres darf sie reisen. Abholung am Rand der Freiburger Altstadt.",
    features: ["Mattes Finish", "Großes Volumen", "Wintertauglich"],
  },
  {
    id: "yakima-skybox-pro",
    title: "Yakima SkyBox Pro 18",
    brand: "Yakima",
    city: "Nürnberg",
    pricePerDay: 16,
    volume: 510,
    lengthCm: 226,
    maxLoadKg: 68,
    opening: "beidseitig",
    rating: 4.9,
    reviews: 41,
    host: "Felix",
    hostSince: 2021,
    superhost: true,
    tone: 2,
    description:
      "US-Import mit super easy Schnellverschlüssen und tollem Platzangebot. Bringt jeden Roadtrip-Gepäckberg unter. Übergabe flexibel rund um Nürnberg.",
    features: ["Schnellverschlüsse", "Großvolumig", "Flexible Übergabe"],
  },
  {
    id: "atera-casar-m",
    title: "Atera Casar M",
    brand: "Atera",
    city: "Dresden",
    pricePerDay: 11,
    volume: 400,
    lengthCm: 175,
    maxLoadKg: 50,
    opening: "einseitig",
    rating: 4.7,
    reviews: 24,
    host: "Pia",
    hostSince: 2023,
    superhost: false,
    tone: 3,
    description:
      "Schicke, kurze Box, die auch auf kleinere Autos passt, ohne über die Heckscheibe zu ragen. Sehr leise bei Tempo. Ideal für Stadtmenschen ohne Stauraum.",
    features: ["Kurze Bauform", "Leise", "Cityfreundlich"],
  },
];

export function getBox(id: string): Dachbox | undefined {
  return DACHBOXEN.find((b) => b.id === id);
}

export const ALL_CITIES = Array.from(new Set(DACHBOXEN.map((b) => b.city))).sort();
export const ALL_BRANDS = Array.from(new Set(DACHBOXEN.map((b) => b.brand))).sort();

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

/** Matches a box against a city name or postal code query. */
export function matchesLocation(box: Dachbox, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (box.city.toLowerCase().includes(q)) return true;
  const plz = CITY_PLZ[box.city];
  return plz ? plz.startsWith(q) : false;
}
