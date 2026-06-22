"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getStripe, MARKETPLACE_FEE_RATE } from "@/lib/stripe/server";
import { getPayoutStatus } from "@/lib/stripe/account-status";
import { daysInclusive } from "@/lib/dates";

export type BookingState = { error?: string } | null;

async function originUrl(path: string): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}${path}`;
}

export async function createBookingCheckout(
  prevState: BookingState,
  formData: FormData
): Promise<BookingState> {
  const boxId = formData.get("boxId") as string;
  const from = formData.get("from") as string;
  const to = formData.get("to") as string;
  const agbAccepted = formData.get("agb") === "on";

  if (!boxId || !from || !to) return { error: "Buchungsdaten fehlen." };
  if (!agbAccepted)
    return { error: "Bitte akzeptiere die Storno- und Nutzungsbedingungen." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/anmelden?redirect=/dachboxen/${boxId}/buchen?from=${from}%26to=${to}`);
  }

  const today = new Date().toISOString().slice(0, 10);
  if (from < today) return { error: "Der Starttag liegt in der Vergangenheit." };
  if (to < from) return { error: "Die Rückgabe liegt vor dem Starttag." };

  const { data: box } = await supabase
    .from("dachboxen")
    .select("id, title, price_per_day, host_id")
    .eq("id", boxId)
    .single();
  if (!box) return { error: "Diese Box wurde nicht gefunden." };
  if (box.host_id === user.id)
    return { error: "Du kannst deine eigene Box nicht mieten." };

  // Host must be able to receive payouts before anyone can book
  const { data: hostProfile } = await supabase
    .from("profiles")
    .select("stripe_account_id")
    .eq("id", box.host_id)
    .single();
  const payout = await getPayoutStatus(hostProfile?.stripe_account_id);
  if (!payout.payoutsEnabled)
    return {
      error:
        "Diese Box ist gerade nicht buchbar – der Vermieter hat seine Auszahlungen noch nicht eingerichtet.",
    };

  // Release abandoned holds first, then try to reserve our range
  await supabase.rpc("expire_stale_bookings");

  const days = daysInclusive(from, to);
  if (days < 1) return { error: "Ungültiger Zeitraum." };
  const amountTotal = Math.round(Number(box.price_per_day) * days * 100);
  const marketplaceFee = Math.round(amountTotal * MARKETPLACE_FEE_RATE);
  // Hold must outlive the Checkout session (30 min) so dates stay reserved
  const expiresAt = new Date(Date.now() + 35 * 60 * 1000).toISOString();

  const { data: booking, error: insertErr } = await supabase
    .from("bookings")
    .insert({
      box_id: box.id,
      renter_id: user.id,
      host_id: box.host_id,
      start_date: from,
      end_date: to,
      amount_total: amountTotal,
      marketplace_fee: marketplaceFee,
      currency: "eur",
      expires_at: expiresAt,
    })
    .select("id")
    .single();

  if (insertErr) {
    // 23P01 = exclusion-constraint violation → overlapping booking
    if (insertErr.code === "23P01")
      return {
        error:
          "Diese Tage sind leider schon vergeben. Bitte wähle einen anderen Zeitraum.",
      };
    return { error: insertErr.message };
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `Miete: ${box.title}`,
            description: `${from} bis ${to} · ${days} ${days === 1 ? "Tag" : "Tage"}`,
          },
          unit_amount: amountTotal,
        },
        quantity: 1,
      },
    ],
    // Money stays on the platform balance; we transfer to the host after the
    // handover is confirmed. transfer_group links this charge to that transfer.
    payment_intent_data: {
      transfer_group: booking.id,
      metadata: { booking_id: booking.id },
    },
    metadata: { booking_id: booking.id },
    success_url: await originUrl(`/meine-buchungen?status=erfolg`),
    cancel_url: await originUrl(`/dachboxen/${box.id}?status=abgebrochen`),
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
  });

  await supabase
    .from("bookings")
    .update({ stripe_session_id: session.id })
    .eq("id", booking.id);

  redirect(session.url!);
}
