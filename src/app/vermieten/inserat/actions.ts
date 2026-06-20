"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ListingState = { error?: string } | null;

export async function createListing(
  prevState: ListingState,
  formData: FormData
): Promise<ListingState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht angemeldet." };

  const features = (formData.get("features") as string)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const { error } = await supabase.from("dachboxen").insert({
    title: formData.get("title") as string,
    brand: formData.get("brand") as string,
    city: formData.get("city") as string,
    price_per_day: Number(formData.get("price_per_day")),
    volume: Number(formData.get("volume")),
    length_cm: Number(formData.get("length_cm")),
    max_load_kg: Number(formData.get("max_load_kg")),
    opening: formData.get("opening") as string,
    description: (formData.get("description") as string) || "",
    features,
    host_id: user.id,
  });

  if (error) return { error: error.message };
  revalidatePath("/meine-boxen");
  redirect("/meine-boxen");
}
