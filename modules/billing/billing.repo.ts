import type { Subscription, Invoice } from "./billing.types";

/**
 * BillingRepo — database operations for billing data.
 */
export class BillingRepo {
  static async getSubscription(orgId: string): Promise<Subscription | null> {
    throw new Error("Not implemented");
  }

  static async upsertSubscription(data: Partial<Subscription> & { organizationId: string }): Promise<Subscription> {
    throw new Error("Not implemented");
  }

  static async getInvoices(orgId: string): Promise<Invoice[]> {
    throw new Error("Not implemented");
  }

  static async insertInvoice(data: Omit<Invoice, "id">): Promise<Invoice> {
    throw new Error("Not implemented");
  }
}
