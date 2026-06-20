"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteListing(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Nicht angemeldet");

  await supabase
    .from("dachboxen")
    .delete()
    .eq("id", id)
    .eq("host_id", user.id); // extra guard: only own listings

  revalidatePath("/meine-boxen");
}

export async function toggleAvailability(id: string, current: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Nicht angemeldet");

  await supabase
    .from("dachboxen")
    .update({ is_available: !current })
    .eq("id", id)
    .eq("host_id", user.id);

  revalidatePath("/meine-boxen");
}
