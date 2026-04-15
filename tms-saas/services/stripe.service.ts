// import { env } from "@/lib/env";

/**
 * StripeService — Stripe payment integration.
 */
export class StripeService {
  // private static stripe = new Stripe(env.STRIPE_SECRET_KEY);

  /**
   * Create a checkout session for subscription.
   */
  static async createCheckoutSession(params: {
    customerId?: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
  }) {
    // TODO: Implement with Stripe SDK
    throw new Error("Stripe not configured");
  }

  /**
   * Create a Stripe customer.
   */
  static async createCustomer(params: {
    email: string;
    name: string;
    metadata?: Record<string, string>;
  }) {
    throw new Error("Stripe not configured");
  }

  /**
   * Get customer portal URL for managing subscription.
   */
  static async createPortalSession(customerId: string, returnUrl: string) {
    throw new Error("Stripe not configured");
  }

  /**
   * Verify and parse a webhook event.
   */
  static async constructWebhookEvent(body: string, signature: string) {
    // TODO: Verify with STRIPE_WEBHOOK_SECRET
    throw new Error("Stripe not configured");
  }
}
