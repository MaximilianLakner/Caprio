import Stripe from "stripe";

// Lazy singleton so an unrelated build step never fails just because the key
// isn't present at import time. Throws a clear error only when actually used.
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY ist nicht gesetzt.");
    _stripe = new Stripe(key, { typescript: true });
  }
  return _stripe;
}

/** Caprio marketplace fee, taken from the host's payout. */
export const MARKETPLACE_FEE_RATE = 0.1; // 10 %
