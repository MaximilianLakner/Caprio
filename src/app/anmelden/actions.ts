"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string } | null;

export async function signIn(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  redirect("/meine-boxen");
}

export async function signUp(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: { data: { name: formData.get("name") as string } },
  });
  if (error) return { error: error.message };
  // Supabase may require email confirmation
  if (data.user && !data.session) {
    return {
      message:
        "Fast geschafft! Bitte bestätige deine E-Mail-Adresse – dann kannst du dich anmelden.",
    };
  }
  revalidatePath("/", "layout");
  redirect("/meine-boxen");
}
