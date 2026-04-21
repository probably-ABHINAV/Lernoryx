import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-server";
import { checkPlatformHealth } from "@/lib/super-admin-queries";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  await requireSuperAdmin();
  const supabase = createClient();

  const [health, tableCounts, recentSnapshots] = await Promise.all([
    checkPlatformHealth(),
    Promise.all([
      "users", "organizations", "sections", "sessions",
      "attendance", "grades", "content", "activity_logs",
    ].map(async (table) => {
      const { count } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });
      return { table, count: count ?? 0 };
    })),
    supabase
      .from("health_snapshots")
      .select("checked_at, db_latency_ms, auth_latency_ms, storage_latency_ms, status")
      .order("checked_at", { ascending: false })
      .limit(20),
  ]);

  return NextResponse.json({
    health,
    tableCounts,
    snapshots: recentSnapshots.data ?? [],
    environment: {
      region: process.env.VERCEL_REGION ?? "local",
      runtime: "Node.js",
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "").split(".")[0] ?? "unknown",
    },
  });
}
