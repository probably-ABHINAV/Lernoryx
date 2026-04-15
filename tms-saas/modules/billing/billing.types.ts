import type { OrgPlan } from "@/modules/organizations/organizations.types";

/** Subscription record. */
export interface Subscription {
  id: string;
  organizationId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  plan: OrgPlan;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionStatus =
  | "active"
  | "past_due"
  | "canceled"
  | "trialing"
  | "incomplete";

/** Input for creating a new subscription. */
export interface CreateSubscriptionInput {
  organizationId: string;
  plan: OrgPlan;
  successUrl: string;
  cancelUrl: string;
}

/** Invoice from Stripe. */
export interface Invoice {
  id: string;
  organizationId: string;
  stripeInvoiceId: string;
  amount: number;
  currency: string;
  status: "paid" | "open" | "void" | "draft";
  paidAt?: string;
  invoiceUrl?: string;
  createdAt: string;
}

/** Billing overview for dashboard. */
export interface BillingOverview {
  subscription: Subscription | null;
  recentInvoices: Invoice[];
  monthlyRevenue: number;
}
