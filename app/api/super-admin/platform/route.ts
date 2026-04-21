import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-server";
import { getPlatformTotals, getOrgGrowthTrend } from "@/lib/super-admin-queries";

export const dynamic = "force-dynamic";

import * as Sentry from "@sentry/nextjs";

export async function GET() {
  return Sentry.startSpan(
    { name: "GET /api/super-admin/platform", op: "http.server" },
    async () => {
      // Identity & access check
      await requireSuperAdmin();

      Sentry.setTag("api", "platform_stats");
      Sentry.setTag("feature", "super_admin_dashboard");

      // Wrap DB logic individually
      const totals = await Sentry.startSpan(
        { name: "DB: Fetch Platform Totals", op: "db.query" },
        async () => getPlatformTotals()
      );

      const trend = await Sentry.startSpan(
        { name: "DB: Fetch Org Growth Trend", op: "db.query" },
        async () => getOrgGrowthTrend()
      );

      return NextResponse.json({ totals, trend });
    }
  );
}
