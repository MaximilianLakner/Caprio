import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Stripe signature verification needs the raw body + Node crypto.
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret || secret.startsWith("whsec_KOMMT")) {
    return NextResponse.json(
      { error: "Webhook ist noch nicht konfiguriert (STRIPE_WEBHOOK_SECRET fehlt)." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    return NextResponse.json(
      { error: `Signaturprüfung fehlgeschlagen: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.booking_id;
      if (bookingId && session.payment_status === "paid") {
        await admin
          .from("bookings")
          .update({
            status: "paid",
            stripe_payment_intent: session.payment_intent as string,
          })
          .eq("id", bookingId)
          .eq("status", "pending");
      }
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.booking_id;
      if (bookingId) {
        await admin
          .from("bookings")
          .update({ status: "expired" })
          .eq("id", bookingId)
          .eq("status", "pending");
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
