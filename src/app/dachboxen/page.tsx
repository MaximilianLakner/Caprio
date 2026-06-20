import type { Metadata } from "next";
import { BrowseClient } from "./browse-client";

export const metadata: Metadata = {
  title: "Dachboxen finden",
  description:
    "Stöbere durch Dachboxen in deiner Nähe. Filtere nach Größe, Preis, Marke und Ort.",
};

export default async function DachboxenPage({
  searchParams,
}: {
  searchParams: Promise<{ ort?: string }>;
}) {
  const { ort } = await searchParams;
  return <BrowseClient initialOrt={ort ?? ""} />;
}
