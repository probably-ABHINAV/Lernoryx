import { requireAuth } from "@/lib/requireAuth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await requireAuth();

    return NextResponse.json({
      tmsId: user.profile.tmsId,
      email: user.profile.email,
      role: user.profile.role,
      orgId: user.profile.org_id,
      actualRole: user.profile.actual_role
    });
  } catch (error: any) {
    console.error("[AUTH_ME] Error:", error.message);
    return NextResponse.json(null, { status: 401 });
  }
}
