import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "trainer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();
  const { sectionId } = await params;

  // Verify trainer has a session in this section
  const { data: session } = await supabase
    .from("sessions")
    .select("id")
    .eq("section_id", sectionId)
    .eq("trainer_id", user.id)
    .limit(1)
    .single();

  if (!session) return NextResponse.json({ error: "Not authorized for this section" }, { status: 403 });

  // Get all enrolled students
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("student_id, users(id, email)")
    .eq("section_id", sectionId)
    .eq("org_id", user.orgId);

  const studentIds = (enrollments ?? []).map((e: any) => e.student_id);

  if (studentIds.length === 0) return NextResponse.json({ roster: [] });

  // Get their grades in this section
  const { data: grades } = await supabase
    .from("grades")
    .select("student_id, score, remarks")
    .eq("section_id", sectionId)
    .in("student_id", studentIds);

  // Get attendance for all sessions in this section
  const { data: sessions } = await supabase
    .from("sessions")
    .select("id")
    .eq("section_id", sectionId);

  const sessionIds = (sessions ?? []).map((s: any) => s.id);

  const { data: attendance } = await supabase
    .from("attendance")
    .select("student_id, status, session_id")
    .in("session_id", sessionIds)
    .in("student_id", studentIds);

  // Build per-student attendance stats
  const attendanceStats: Record<string, { present: number; total: number }> = {};
  for (const a of attendance ?? []) {
    if (!attendanceStats[a.student_id]) attendanceStats[a.student_id] = { present: 0, total: 0 };
    attendanceStats[a.student_id].total++;
    if (a.status === "Present") attendanceStats[a.student_id].present++;
  }

  // Get open queries count per student
  const { data: queries } = await supabase
    .from("queries")
    .select("student_id")
    .eq("section_id", sectionId)
    .eq("status", "open");

  const queriesCountByStudent: Record<string, number> = {};
  for (const q of queries ?? []) {
    queriesCountByStudent[q.student_id] = (queriesCountByStudent[q.student_id] ?? 0) + 1;
  }

  const gradeMap = new Map((grades ?? []).map((g: any) => [g.student_id, g]));

  const roster = (enrollments ?? []).map((e: any) => {
    const stats = attendanceStats[e.student_id];
    const attendanceRate = stats
      ? Math.round((stats.present / stats.total) * 100)
      : null;
    const grade = gradeMap.get(e.student_id);
    const atRisk = (attendanceRate !== null && attendanceRate < 75) ||
                   (grade?.score !== undefined && grade.score < 50);

    return {
      id: e.student_id,
      email: e.users?.email ?? "",
      grade: grade ?? null,
      attendanceRate,
      sessionsAttended: stats?.present ?? 0,
      totalSessions: stats?.total ?? 0,
      openQueries: queriesCountByStudent[e.student_id] ?? 0,
      atRisk,
    };
  });

  return NextResponse.json({ roster });
}
