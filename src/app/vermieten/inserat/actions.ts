"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ListingState = { error?: string } | null;

const MIN_IMAGES = 4;
const MAX_IMAGES = 7;

export async function createListing(
  prevState: ListingState,
  formData: FormData
): Promise<ListingState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Du bist nicht angemeldet." };

  // --- collect & validate basic fields ---
  const title = (formData.get("title") as string)?.trim();
  const brand = (formData.get("brand") as string)?.trim();
  const city = (formData.get("city") as string)?.trim();
  const opening = formData.get("opening") as string;
  if (!title || !brand || !city || !opening)
    return { error: "Bitte fülle alle Pflichtfelder aus." };

  const features = ((formData.get("features") as string) || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // --- validate images (4–7) ---
  const files = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length < MIN_IMAGES)
    return { error: `Bitte lade mindestens ${MIN_IMAGES} Bilder hoch.` };
  if (files.length > MAX_IMAGES)
    return { error: `Bitte lade höchstens ${MAX_IMAGES} Bilder hoch.` };

  for (const file of files) {
    if (!file.type.startsWith("image/"))
      return { error: "Alle Dateien müssen Bilder sein." };
    if (file.size > 5_000_000)
      return { error: "Jedes Bild darf höchstens 5 MB groß sein." };
  }

  // --- upload images to storage ---
  const stamp = Date.now();
  const imageUrls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/${stamp}-${i}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("box-images")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (uploadError)
      return {
        error: `Bild-Upload fehlgeschlagen. Ist der Storage-Bucket 'box-images' angelegt? (${uploadError.message})`,
      };
    const { data: pub } = supabase.storage.from("box-images").getPublicUrl(path);
    imageUrls.push(pub.publicUrl);
  }

  // --- insert listing ---
  const { error } = await supabase.from("dachboxen").insert({
    title,
    brand,
    city,
    price_per_day: Number(formData.get("price_per_day")),
    volume: Number(formData.get("volume")),
    length_cm: Number(formData.get("length_cm")),
    max_load_kg: Number(formData.get("max_load_kg")),
    opening,
    description: (formData.get("description") as string) || "",
    features,
    images: imageUrls,
    host_id: user.id,
  });

  if (error) return { error: error.message };
  revalidatePath("/meine-boxen");
  redirect("/meine-boxen");
}
