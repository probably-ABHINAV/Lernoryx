import { requireAuth } from "@/lib/requireAuth";
import { GradesService } from "@/modules/grades/grades.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await requireAuth();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const data = await GradesService.list(user);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const { student_id, section_id, score, remarks } = await req.json();
    const data = await GradesService.addGrade(user, {
      student_id,
      section_id,
      score,
      remarks
    });

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
