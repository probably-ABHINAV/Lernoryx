import { getCurrentUser } from "@/lib/auth";
import { SessionsService } from "@/modules/sessions/sessions.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const data = await SessionsService.list(user);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const { section_id, trainer_id, topic, session_date } = await req.json();
    
    // Anyone can create a session in their org (or maybe restrict to trainers/admins later)
    const data = await SessionsService.create(user, {
      section_id,
      trainer_id,
      topic,
      session_date
    });

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
