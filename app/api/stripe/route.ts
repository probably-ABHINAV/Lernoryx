import { NextRequest, NextResponse } from "next/server";
// import { StripeService } from "@/services/stripe.service";

/**
 * POST /api/stripe
 * Handle Stripe webhook events.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { success: false, error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    // TODO: Verify webhook signature with Stripe
    // TODO: Handle events: checkout.session.completed, invoice.paid, etc.

    console.log("[Stripe Webhook] Received event");

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[API] POST /api/stripe error:", error);
    return NextResponse.json(
      { success: false, error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
