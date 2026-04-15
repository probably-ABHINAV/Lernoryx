import { getCurrentUser } from "@/lib/auth";
import { sendInvite } from "@/modules/invite/invite.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    if (user.profile.role !== "admin") {
      return new Response("Forbidden: Only admins can invite users", { status: 403 });
    }

    const { email, role } = await req.json();
    
    // Default to 'student' if role isn't provided or is invalid
    const validRole = ["admin", "trainer", "student"].includes(role) ? role : "student";

    const data = await sendInvite(user, email, validRole);

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
