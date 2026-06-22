import { getStripe } from "./server";

export type PayoutStatus = {
  hasAccount: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
};

/** Reads a host's Stripe Connect onboarding/payout status. */
export async function getPayoutStatus(
  stripeAccountId?: string | null
): Promise<PayoutStatus> {
  if (!stripeAccountId) {
    return { hasAccount: false, payoutsEnabled: false, detailsSubmitted: false };
  }
  try {
    const account = await getStripe().accounts.retrieve(stripeAccountId);
    return {
      hasAccount: true,
      payoutsEnabled: !!account.payouts_enabled,
      detailsSubmitted: !!account.details_submitted,
    };
  } catch {
    return { hasAccount: true, payoutsEnabled: false, detailsSubmitted: false };
  }
}
