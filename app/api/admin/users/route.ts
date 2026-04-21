import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const updateUserSchema = z.object({
  userId: z.string(),
  role:   z.enum(["admin", "trainer", "student", "pending"]).optional(),
  orgId:  z.string().uuid().optional(),
});

export async function GET(_: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "admin" && authUser.profile.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();

  const { data, error } = await supabase
    .from("users")
    .select("id, email, role, created_at")
    .eq("org_id", user.orgId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: data ?? [] });
}

export async function PATCH(request: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "admin" && authUser.profile.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();
  const body = await request.json();

  const parsed = updateUserSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { userId, role, orgId } = parsed.data;

  // Get old role for audit log
  const { data: oldUser } = await supabase
    .from("users")
    .select("role, org_id, email")
    .eq("id", userId)
    .single();

  const updates: Record<string, unknown> = {};
  if (role  !== undefined) updates.role   = role;
  if (orgId !== undefined) updates.org_id = orgId;

  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action: "updated_user_role",
    metadata: {
      target_user_id: userId,
      target_email: oldUser?.email,
      old_role: oldUser?.role,
      new_role: role,
    },
    org_id: user.orgId,
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "admin" && authUser.profile.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  // Cannot delete yourself
  if (userId === user.id) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  // Set role to pending and remove org (soft delete from org)
  const { error } = await supabase
    .from("users")
    .update({ role: "pending", org_id: null })
    .eq("id", userId)
    .eq("org_id", user.orgId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action: "removed_user_from_org",
    metadata: { target_user_id: userId },
    org_id: user.orgId,
  });

  return NextResponse.json({ success: true });
}
