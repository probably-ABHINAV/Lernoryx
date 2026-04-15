import type {
  Subscription,
  CreateSubscriptionInput,
  Invoice,
  BillingOverview,
} from "./billing.types";

/**
 * BillingService — subscription and payment management.
 */
export class BillingService {
  static async getSubscription(orgId: string): Promise<Subscription | null> {
    throw new Error("Not implemented");
  }

  static async createCheckoutSession(input: CreateSubscriptionInput): Promise<{ url: string }> {
    // TODO: Create Stripe checkout session
    throw new Error("Not implemented");
  }

  static async cancelSubscription(orgId: string): Promise<void> {
    throw new Error("Not implemented");
  }

  static async getInvoices(orgId: string): Promise<Invoice[]> {
    throw new Error("Not implemented");
  }

  static async getBillingOverview(orgId: string): Promise<BillingOverview> {
    throw new Error("Not implemented");
  }

  static async handleWebhookEvent(event: unknown): Promise<void> {
    // TODO: Process Stripe webhook events
    throw new Error("Not implemented");
  }
}
