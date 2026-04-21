import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  await requireSuperAdmin();
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId");

  const { data: defaults } = await supabase
    .from("feature_flags")
    .select("flag_name, enabled, description")
    .is("org_id", null);

  if (!orgId) return NextResponse.json({ flags: defaults ?? [] });

  const { data: overrides } = await supabase
    .from("feature_flags")
    .select("flag_name, enabled")
    .eq("org_id", orgId);

  const overrideMap = new Map((overrides ?? []).map((f: any) => [f.flag_name, f.enabled]));
  const merged = (defaults ?? []).map((f: any) => ({
    ...f,
    enabled: overrideMap.has(f.flag_name) ? overrideMap.get(f.flag_name) : f.enabled,
    hasOverride: overrideMap.has(f.flag_name),
  }));

  return NextResponse.json({ flags: merged });
}

export async function PATCH(request: NextRequest) {
  const user = await requireSuperAdmin();
  const supabase = createClient();
  const body = await request.json();
  const { flagName, enabled, orgId } = body;

  if (!flagName || enabled === undefined) {
    return NextResponse.json({ error: "flagName and enabled required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("feature_flags")
    .upsert({
      org_id:     orgId ?? null,
      flag_name:  flagName,
      enabled,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    }, { onConflict: "org_id,flag_name" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action: "super_admin_toggled_flag",
    metadata: { flag_name: flagName, enabled, org_id: orgId ?? "platform" },
    org_id: orgId ?? user.id,
  });

  return NextResponse.json({ success: true });
}
