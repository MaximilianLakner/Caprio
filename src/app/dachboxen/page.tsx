import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { mapBoxRow } from "@/lib/data";
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

  const supabase = await createClient();
  const { data } = await supabase
    .from("dachboxen")
    .select("*, profiles(name)")
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  const boxes = (data ?? []).map(mapBoxRow);

  return <BrowseClient initialOrt={ort ?? ""} boxes={boxes} />;
}
