"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string } | null;

/** Build an absolute URL from the incoming request headers. */
async function originUrl(path: string): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}${path}`;
}

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

export async function signInWithProvider(formData: FormData) {
  const provider = formData.get("provider") as "google" | "apple" | "github";
  const next = (formData.get("next") as string) || "/meine-boxen";

  const supabase = await createClient();
  const redirectTo = await originUrl(
    `/auth/callback?next=${encodeURIComponent(next)}`
  );
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });

  if (error || !data.url) {
    redirect("/anmelden?error=oauth");
  }
  redirect(data.url);
}

export async function requestPasswordReset(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = (formData.get("email") as string)?.trim();
  if (!email) return { error: "Bitte gib deine E-Mail-Adresse ein." };

  const supabase = await createClient();
  const redirectTo = await originUrl("/auth/callback?next=/passwort-neu");
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) return { error: translateAuthError(error.message) };

  return {
    message:
      "Wenn ein Konto mit dieser E-Mail existiert, haben wir dir einen Link zum Zurücksetzen geschickt.",
  };
}

export async function updatePassword(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const password = formData.get("password") as string;
  const passwordConfirm = formData.get("passwordConfirm") as string;

  if (!password || password.length < 6)
    return { error: "Das Passwort muss mindestens 6 Zeichen lang sein." };
  if (password !== passwordConfirm)
    return { error: "Die beiden Passwörter stimmen nicht überein." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return {
      error:
        "Der Link ist abgelaufen oder ungültig. Fordere einen neuen Link zum Zurücksetzen an.",
    };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: translateAuthError(error.message) };

  revalidatePath("/", "layout");
  redirect("/meine-boxen");
}
