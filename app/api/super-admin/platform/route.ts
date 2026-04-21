import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-server";
import { getPlatformTotals, getOrgGrowthTrend } from "@/lib/super-admin-queries";

export const dynamic = "force-dynamic";

export async function GET() {
  await requireSuperAdmin();
  const [totals, trend] = await Promise.all([
    getPlatformTotals(),
    getOrgGrowthTrend(),
  ]);
  return NextResponse.json({ totals, trend });
}
