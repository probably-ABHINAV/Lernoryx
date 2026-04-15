import { getCurrentUser } from "@/lib/auth";
import { UsersService } from "@/modules/users/users.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const data = await UsersService.list(user);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    // Ensure only admins can create users
    if (user.profile.role !== "admin") {
      return new Response("Forbidden", { status: 403 });
    }

    const { email, role } = await req.json();
    const data = await UsersService.create(user, { email, role });

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
