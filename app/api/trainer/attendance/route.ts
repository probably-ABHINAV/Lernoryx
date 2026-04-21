import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const markAttendanceSchema = z.object({
  sessionId: z.string().uuid(),
  records: z.array(z.object({
    studentId: z.string(),
    status: z.enum(["Present", "Absent", "Late"]),
  })),
});

export async function GET(request: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "trainer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });

  // Verify trainer owns this session
  const { data: session } = await supabase
    .from("sessions")
    .select("id, section_id, session_date, topic")
    .eq("id", sessionId)
    .eq("trainer_id", user.id)
    .single();

  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  // Get enrolled students
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("student_id, users(id, email)")
    .eq("section_id", session.section_id)
    .eq("org_id", user.orgId);

  // Get existing attendance for this session
  const { data: existing } = await supabase
    .from("attendance")
    .select("student_id, status")
    .eq("session_id", sessionId);

  const existingMap = new Map((existing ?? []).map((a: any) => [a.student_id, a.status]));

  const students = (enrollments ?? []).map((e: any) => ({
    id: e.student_id,
    email: e.users?.email ?? "",
    status: existingMap.get(e.student_id) ?? null,
  }));

  return NextResponse.json({ session, students });
}

export async function POST(request: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "trainer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();
  const body = await request.json();

  const parsed = markAttendanceSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { sessionId, records } = parsed.data;

  // Verify trainer owns this session
  const { data: session } = await supabase
    .from("sessions")
    .select("section_id")
    .eq("id", sessionId)
    .eq("trainer_id", user.id)
    .single();

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  // Upsert all attendance records
  const rows = records.map((r) => ({
    session_id: sessionId,
    student_id: r.studentId,
    status: r.status,
    org_id: user.orgId,
  }));

  const { error } = await supabase
    .from("attendance")
    .upsert(rows, { onConflict: "session_id,student_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action: "marked_attendance",
    metadata: { session_id: sessionId, records_count: records.length },
    org_id: user.orgId,
  });

  return NextResponse.json({ success: true });
}
