"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/server";

async function originUrl(path: string): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}${path}`;
}

/**
 * Starts (or resumes) Stripe Connect Express onboarding for the logged-in host
 * and redirects them to Stripe's hosted onboarding flow.
 */
export async function startHostOnboarding() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/anmelden?redirect=/profil");

  const stripe = getStripe();

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_account_id")
    .eq("id", user.id)
    .single();

  let accountId: string | undefined = profile?.stripe_account_id ?? undefined;

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      country: "DE",
      email: user.email,
      business_type: "individual",
      capabilities: { transfers: { requested: true } },
      metadata: { user_id: user.id },
    });
    accountId = account.id;
    await supabase
      .from("profiles")
      .update({ stripe_account_id: accountId })
      .eq("id", user.id);
  }

  const base = await originUrl("/profil");
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${base}?stripe=refresh`,
    return_url: `${base}?stripe=done`,
    type: "account_onboarding",
  });

  redirect(accountLink.url);
}
