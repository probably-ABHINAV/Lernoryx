import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  await requireSuperAdmin();
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const page   = parseInt(searchParams.get("page") ?? "1");
  const limit  = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);
  const orgId  = searchParams.get("orgId");
  const action = searchParams.get("action");
  const from   = (page - 1) * limit;

  let query = supabase
    .from("activity_logs")
    .select(`
      id, action, metadata, created_at, org_id,
      users(email, role),
      organizations(name)
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (orgId)  query = query.eq("org_id", orgId);
  if (action) query = query.eq("action", action);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    logs: data ?? [],
    total: count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / limit),
  });
}
