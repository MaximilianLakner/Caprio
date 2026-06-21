"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileState = { error?: string; success?: boolean } | null;

export async function updateProfile(
  prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Du bist nicht angemeldet." };

  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  if (!firstName) return { error: "Bitte gib deinen Vornamen ein." };
  if (!lastName) return { error: "Bitte gib deinen Nachnamen ein." };

  const updates: Record<string, unknown> = { name: `${firstName} ${lastName}` };

  // Optional profile picture
  const file = formData.get("avatar") as File | null;
  if (file && file.size > 0) {
    if (!file.type.startsWith("image/"))
      return { error: "Bitte wähle eine Bilddatei aus." };
    if (file.size > 3_000_000)
      return { error: "Das Bild darf höchstens 3 MB groß sein." };

    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (uploadError)
      return {
        error: `Bild-Upload fehlgeschlagen. Ist der Storage-Bucket 'avatars' angelegt? (${uploadError.message})`,
      };

    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    updates.avatar_url = pub.publicUrl;
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/profil");
  return { success: true };
}
