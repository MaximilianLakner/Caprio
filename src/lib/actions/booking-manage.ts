"use server";

import { revalidatePath } from "next/cache";
import type Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/server";

export type ManageResult = { error?: string };

/**
 * Renter confirms they received the box → release the escrowed money to the
 * host (minus Stripe fee + marketplace fee, both borne by the host).
 */
export async function confirmHandover(bookingId: string): Promise<ManageResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Du bist nicht angemeldet." };

  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();
  if (!booking) return { error: "Buchung nicht gefunden." };
  if (booking.renter_id !== user.id)
    return { error: "Nur der Mieter kann die Übergabe bestätigen." };
  if (booking.status !== "paid")
    return { error: "Diese Buchung kann gerade nicht bestätigt werden." };
  if (booking.stripe_transfer_id) return { error: "Bereits ausgezahlt." };

  const { data: hostProfile } = await supabase
    .from("profiles")
    .select("stripe_account_id")
    .eq("id", booking.host_id)
    .single();
  if (!hostProfile?.stripe_account_id)
    return { error: "Der Vermieter hat kein Auszahlungskonto." };

  const stripe = getStripe();

  // Read the actual Stripe processing fee from the charge
  const pi = await stripe.paymentIntents.retrieve(booking.stripe_payment_intent, {
    expand: ["latest_charge.balance_transaction"],
  });
  const charge = pi.latest_charge as Stripe.Charge | null;
  if (!charge) return { error: "Zahlung nicht gefunden." };
  const balanceTx = charge.balance_transaction as Stripe.BalanceTransaction | null;
  const stripeFee = balanceTx?.fee ?? 0;

  // Host bears Stripe fee + marketplace fee
  const payout = Math.max(0, booking.amount_total - stripeFee - booking.marketplace_fee);

  let transfer: Stripe.Transfer;
  try {
    transfer = await stripe.transfers.create({
      amount: payout,
      currency: booking.currency ?? "eur",
      destination: hostProfile.stripe_account_id,
      source_transaction: charge.id,
      transfer_group: booking.id,
      metadata: { booking_id: booking.id },
    });
  } catch (err) {
    return { error: `Auszahlung fehlgeschlagen: ${(err as Error).message}` };
  }

  await supabase
    .from("bookings")
    .update({
      status: "completed",
      stripe_transfer_id: transfer.id,
      host_payout: payout,
    })
    .eq("id", booking.id)
    .eq("status", "paid");

  revalidatePath("/meine-buchungen");
  revalidatePath("/meine-boxen");
  return {};
}

/**
 * Renter cancels — full refund if more than 48 h before pickup (no transfer
 * has happened yet, so the money is simply refunded from the platform).
 */
export async function cancelBooking(bookingId: string): Promise<ManageResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Du bist nicht angemeldet." };

  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();
  if (!booking) return { error: "Buchung nicht gefunden." };
  if (booking.renter_id !== user.id)
    return { error: "Nur der Mieter kann stornieren." };
  if (booking.status !== "paid")
    return { error: "Diese Buchung kann nicht storniert werden." };

  const start = new Date(`${booking.start_date}T00:00:00`).getTime();
  const cutoff = start - 48 * 3600 * 1000;
  if (Date.now() > cutoff)
    return {
      error: "Kostenlose Stornierung ist nur bis 48 Stunden vor Abholung möglich.",
    };

  const stripe = getStripe();
  try {
    await stripe.refunds.create({ payment_intent: booking.stripe_payment_intent });
  } catch (err) {
    return { error: `Erstattung fehlgeschlagen: ${(err as Error).message}` };
  }

  await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", booking.id)
    .eq("status", "paid");

  revalidatePath("/meine-buchungen");
  revalidatePath("/meine-boxen");
  return {};
}
