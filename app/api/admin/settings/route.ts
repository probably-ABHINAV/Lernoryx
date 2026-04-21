import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const settingsSchema = z.object({
  timezone:                       z.string().optional(),
  logoUrl:                        z.string().url().optional().or(z.literal("")),
  notifyEmail:                    z.boolean().optional(),
  notifyBeforeSessionMinutes:     z.number().int().min(0).max(1440).optional(),
});

export async function GET(_: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "admin" && authUser.profile.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();

  const { data, error } = await supabase
    .from("org_settings")
    .select("*")
    .eq("org_id", user.orgId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data });
}

export async function PATCH(request: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "admin" && authUser.profile.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();
  const body = await request.json();

  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (parsed.data.timezone                   !== undefined) updates.timezone = parsed.data.timezone;
  if (parsed.data.logoUrl                    !== undefined) updates.logo_url = parsed.data.logoUrl || null;
  if (parsed.data.notifyEmail                !== undefined) updates.notify_email = parsed.data.notifyEmail;
  if (parsed.data.notifyBeforeSessionMinutes !== undefined) updates.notify_before_session_minutes = parsed.data.notifyBeforeSessionMinutes;

  const { error } = await supabase
    .from("org_settings")
    .update(updates)
    .eq("org_id", user.orgId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
