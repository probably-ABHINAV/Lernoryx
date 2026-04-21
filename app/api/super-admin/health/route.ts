import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-server";
import { checkPlatformHealth } from "@/lib/super-admin-queries";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

import * as Sentry from "@sentry/nextjs";

export async function GET() {
  return Sentry.startSpan(
    { name: "GET /api/super-admin/health", op: "http.server" },
    async () => {
      await requireSuperAdmin();
      const supabase = createClient();

      Sentry.setTag("api", "platform_health");
      Sentry.setTag("feature", "super_admin_dashboard");

      const [health, tableCounts, recentSnapshots] = await Promise.all([
        Sentry.startSpan({ name: "Health: Execute Diagnostics", op: "diagnostic.check" }, 
          async () => checkPlatformHealth()
        ),
        Sentry.startSpan({ name: "DB: Execute Parallel Table Counts", op: "db.query" }, 
          async () => Promise.all([
            "users", "organizations", "sections", "sessions",
            "attendance", "grades", "content", "activity_logs",
          ].map(async (table) => {
            const { count } = await supabase
              .from(table)
              .select("*", { count: "exact", head: true });
            return { table, count: count ?? 0 };
          }))
        ),
        Sentry.startSpan({ name: "DB: Fetch Recent Health Snaps", op: "db.query" }, 
          async () => supabase
            .from("health_snapshots")
            .select("checked_at, db_latency_ms, auth_latency_ms, storage_latency_ms, status")
            .order("checked_at", { ascending: false })
            .limit(20)
        ),
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
  );
}
