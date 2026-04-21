import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) return NextResponse.redirect(new URL("/sign-in?error=invalid_invite", request.url));

  const supabase = createClient();

  const { data: invite } = await supabase
    .from("invites")
    .select("id, email, role, org_id, status, expires_at")
    .eq("token", token)
    .single();

  if (!invite) return NextResponse.redirect(new URL("/sign-in?error=invalid_invite", request.url));
  if (invite.status !== "pending") return NextResponse.redirect(new URL("/sign-in?error=invite_used", request.url));
  if (new Date(invite.expires_at) < new Date()) {
    await supabase.from("invites").update({ status: "expired" }).eq("id", invite.id);
    return NextResponse.redirect(new URL("/sign-in?error=invite_expired", request.url));
  }

  // Store invite data in a short-lived cookie so signup page can read it
  const response = NextResponse.redirect(new URL(`/sign-up?invite=${token}`, request.url));
  response.cookies.set("tms_pending_invite", JSON.stringify({
    token, email: invite.email, role: invite.role, orgId: invite.org_id
  }), { httpOnly: true, maxAge: 60 * 30, path: "/" });

  return response;
}
