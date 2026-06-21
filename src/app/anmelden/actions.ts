"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string } | null;

/** Map common Supabase auth errors to friendly German messages. */
function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "E-Mail oder Passwort ist falsch.";
  if (m.includes("email not confirmed"))
    return "Bitte bestätige zuerst deine E-Mail-Adresse. Schau in dein Postfach.";
  if (m.includes("user already registered") || m.includes("already been registered"))
    return "Mit dieser E-Mail gibt es bereits ein Konto. Melde dich stattdessen an.";
  if (m.includes("password should be at least"))
    return "Das Passwort muss mindestens 6 Zeichen lang sein.";
  if (m.includes("unable to validate email") || m.includes("invalid email"))
    return "Bitte gib eine gültige E-Mail-Adresse ein.";
  if (m.includes("for security purposes") || m.includes("rate limit"))
    return "Zu viele Versuche. Bitte warte einen Moment und versuch es erneut.";
  return message;
}

export async function signIn(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirect") as string) || "/meine-boxen";

  if (!email || !password) {
    return { error: "Bitte E-Mail und Passwort eingeben." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: translateAuthError(error.message) };

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function signUp(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const passwordConfirm = formData.get("passwordConfirm") as string;
  const redirectTo = (formData.get("redirect") as string) || "/meine-boxen";

  // Validation
  if (!firstName) return { error: "Bitte gib deinen Vornamen ein." };
  if (!lastName) return { error: "Bitte gib deinen Nachnamen ein." };
  const name = `${firstName} ${lastName}`;
  if (!email) return { error: "Bitte gib eine E-Mail-Adresse ein." };
  if (!password || password.length < 6)
    return { error: "Das Passwort muss mindestens 6 Zeichen lang sein." };
  if (password !== passwordConfirm)
    return { error: "Die beiden Passwörter stimmen nicht überein." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) return { error: translateAuthError(error.message) };

  // If e-mail confirmation is required, Supabase returns a user but no session.
  if (data.user && !data.session) {
    return {
      message:
        "Fast geschafft! Wir haben dir eine E-Mail geschickt – bestätige deine Adresse und melde dich dann an.",
    };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}
