import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const createOrgSchema = z.object({
  name:      z.string().min(2).max(100),
  plan:      z.enum(["free", "starter", "pro", "enterprise"]).default("free"),
  seatLimit: z.number().int().min(1).max(10000).default(10),
});

export async function GET(request: NextRequest) {
  await requireSuperAdmin();
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const page   = parseInt(searchParams.get("page") ?? "1");
  const limit  = parseInt(searchParams.get("limit") ?? "20");
  const search = searchParams.get("q") ?? "";
  const from = (page - 1) * limit;

  let query = supabase
    .from("organizations")
    .select("id, name, status, plan, seat_limit, created_at, suspended_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (search) query = query.ilike("name", `%${search}%`);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Enrich with user count per org
  const orgIds = (data ?? []).map((o: any) => o.id);
  const { data: userCounts } = await supabase
    .from("users")
    .select("org_id")
    .in("org_id", orgIds);

  const countByOrg: Record<string, number> = {};
  for (const u of userCounts ?? []) countByOrg[u.org_id] = (countByOrg[u.org_id] ?? 0) + 1;

  const enriched = (data ?? []).map((o: any) => ({
    ...o,
    userCount: countByOrg[o.id] ?? 0,
  }));

  return NextResponse.json({
    orgs: enriched,
    total: count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / limit),
  });
}

export async function POST(request: NextRequest) {
  const user = await requireSuperAdmin();
  const supabase = createClient();
  const body = await request.json();

  const parsed = createOrgSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { data: org, error } = await supabase
    .from("organizations")
    .insert({
      name:       parsed.data.name,
      plan:       parsed.data.plan,
      seat_limit: parsed.data.seatLimit,
      status:     "active",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action: "super_admin_created_org",
    metadata: { org_id: org.id, name: org.name },
    org_id: org.id,
  });

  return NextResponse.json({ org }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const user = await requireSuperAdmin();
  const supabase = createClient();
  const body = await request.json();
  const { id, action, ...rest } = body;

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  let updates: Record<string, unknown> = {};
  let logAction = "";

  switch (action) {
    case "suspend":
      updates = { status: "suspended", suspended_at: new Date().toISOString(), suspended_by: user.id };
      logAction = "super_admin_suspended_org";
      break;
    case "restore":
      updates = { status: "active", suspended_at: null, suspended_by: null };
      logAction = "super_admin_restored_org";
      break;
    case "upgrade_plan":
      if (!["free","starter","pro","enterprise"].includes(rest.plan)) {
        return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
      }
      updates = { plan: rest.plan };
      logAction = "super_admin_changed_plan";
      break;
    case "set_seat_limit":
      updates = { seat_limit: rest.seatLimit };
      logAction = "super_admin_set_seat_limit";
      break;
    case "rename":
      updates = { name: rest.name };
      logAction = "super_admin_renamed_org";
      break;
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  const { error } = await supabase.from("organizations").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action: logAction,
    metadata: { org_id: id, action, ...rest },
    org_id: id,
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const user = await requireSuperAdmin();
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const confirm = searchParams.get("confirm");

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (confirm !== "DELETE") {
    return NextResponse.json({
      error: "Must pass confirm=DELETE to permanently delete an organization",
    }, { status: 400 });
  }

  const { data: org } = await supabase.from("organizations").select("name").eq("id", id).single();

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action: "super_admin_deleted_org",
    metadata: { org_id: id, org_name: org?.name },
    org_id: id,
  });

  const { error } = await supabase
    .from("organizations")
    .update({ status: "deleted" })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
