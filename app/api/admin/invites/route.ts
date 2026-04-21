import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.string().email(),
  role:  z.enum(["admin", "trainer", "student"]),
});

export async function GET(_: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "admin" && authUser.profile.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();

  const { data, error } = await supabase
    .from("invites")
    .select("id, email, role, status, created_at, expires_at, accepted_at")
    .eq("org_id", user.orgId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ invites: data ?? [] });
}

export async function POST(request: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "admin" && authUser.profile.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();
  const body = await request.json();

  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { email, role } = parsed.data;

  // Check if user already in org
  const { data: existingUser } = await supabase
    .from("users")
    .select("id, role")
    .eq("email", email)
    .eq("org_id", user.orgId)
    .single();

  if (existingUser) {
    return NextResponse.json({ error: "User is already a member of this organization" }, { status: 409 });
  }

  // Cancel any existing pending invite for same email in this org
  await supabase
    .from("invites")
    .update({ status: "expired" })
    .eq("email", email)
    .eq("org_id", user.orgId)
    .eq("status", "pending");

  // Create new invite (token + expires_at set by DB trigger)
  const { data: invite, error } = await supabase
    .from("invites")
    .insert({
      email,
      role,
      org_id:     user.orgId,
      invited_by: user.id,
      status:     "pending",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Generate invite link routing to the accept endpoint
  const inviteLink = `${request.nextUrl.origin}/api/invite/accept?token=${invite.token}`;

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action: "sent_invite",
    metadata: { email, role, invite_id: invite.id },
    org_id: user.orgId,
  });

  return NextResponse.json({ invite, inviteLink }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "admin" && authUser.profile.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await supabase
    .from("invites")
    .update({ status: "expired" })
    .eq("id", id)
    .eq("org_id", user.orgId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
