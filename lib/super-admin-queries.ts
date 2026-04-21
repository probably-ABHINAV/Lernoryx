import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * Returns platform-wide totals in a single parallel batch.
 * Uses service role — reads across all orgs.
 */
export async function getPlatformTotals() {
  const supabase = createClient();

  const [orgsRes, usersRes, sectionsRes, sessionsRes] = await Promise.all([
    supabase.from("organizations").select("id, status, plan, created_at", { count: "exact" }),
    supabase.from("users").select("id, role, created_at", { count: "exact" }),
    supabase.from("sections").select("id", { count: "exact" }),
    supabase.from("sessions").select("id", { count: "exact" }),
  ]);

  const orgs    = orgsRes.data    ?? [];
  const users   = usersRes.data   ?? [];
  const sections = sectionsRes.data ?? [];

  // MAU: users who appeared in activity_logs in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: activeUsersData } = await supabase
    .from("activity_logs")
    .select("user_id")
    .gte("created_at", thirtyDaysAgo.toISOString());

  const mau = new Set((activeUsersData ?? []).map((r: any) => r.user_id)).size;

  return {
    totalOrgs:       orgs.length,
    activeOrgs:      orgs.filter((o: any) => o.status === "active").length,
    suspendedOrgs:   orgs.filter((o: any) => o.status === "suspended").length,
    totalUsers:      usersRes.count ?? users.length,
    totalSections:   sectionsRes.count ?? sections.length,
    totalSessions:   sessionsRes.count ?? 0,
    mau,
    planBreakdown: orgs.reduce((acc: Record<string, number>, o: any) => {
      acc[o.plan] = (acc[o.plan] ?? 0) + 1;
      return acc;
    }, {}),
  };
}

/**
 * Returns org growth trend — new orgs per week for last 12 weeks.
 */
export async function getOrgGrowthTrend() {
  const supabase = createClient();
  const { data } = await supabase
    .from("organizations")
    .select("created_at, status")
    .order("created_at");

  const weeks: Record<string, number> = {};
  for (const org of data ?? []) {
    const d = new Date(org.created_at);
    d.setDate(d.getDate() - d.getDay());
    const key = d.toISOString().split("T")[0];
    weeks[key] = (weeks[key] ?? 0) + 1;
  }

  return Object.entries(weeks)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([week, count]) => ({ week, count }));
}

/**
 * Checks health of platform services by measuring actual query latency.
 */
export async function checkPlatformHealth() {
  const supabase = createClient();
  const results: Record<string, { latencyMs: number; status: "ok" | "slow" | "down" }> = {};

  // DB health: simple count query
  const dbStart = Date.now();
  try {
    await supabase.from("organizations").select("id", { count: "exact", head: true });
    const latency = Date.now() - dbStart;
    results.database = { latencyMs: latency, status: latency < 100 ? "ok" : latency < 300 ? "slow" : "down" };
  } catch {
    results.database = { latencyMs: -1, status: "down" };
  }

  // Storage health: list buckets
  const storageStart = Date.now();
  try {
    await supabase.storage.listBuckets();
    const latency = Date.now() - storageStart;
    results.storage = { latencyMs: latency, status: latency < 200 ? "ok" : latency < 500 ? "slow" : "down" };
  } catch {
    results.storage = { latencyMs: -1, status: "down" };
  }

  // Auth health: try to list users (service role can do this)
  const authStart = Date.now();
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=1`, {
      headers: { Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` },
    });
    const latency = Date.now() - authStart;
    results.auth = { latencyMs: latency, status: res.ok ? (latency < 200 ? "ok" : "slow") : "down" };
  } catch {
    results.auth = { latencyMs: -1, status: "down" };
  }

  const overallStatus = Object.values(results).some((r) => r.status === "down")
    ? "down" : Object.values(results).some((r) => r.status === "slow") ? "degraded" : "ok";

  // Persist snapshot
  await supabase.from("health_snapshots").insert({
    db_latency_ms:      results.database?.latencyMs ?? -1,
    auth_latency_ms:    results.auth?.latencyMs ?? -1,
    storage_latency_ms: results.storage?.latencyMs ?? -1,
    status:             overallStatus === "ok" ? "ok" : overallStatus === "degraded" ? "degraded" : "down",
  });

  return { services: results, overallStatus };
}
