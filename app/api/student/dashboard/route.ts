import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };

  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  // Run all queries in parallel
  const [
    enrollmentsRes,
    upcomingSessionsRes,
    gradesRes,
    attendanceRes,
    streakRes,
  ] = await Promise.all([
    // All sections this student is enrolled in
    supabase
      .from("enrollments")
      .select("section_id, sections(id, name, description, is_active)")
      .eq("student_id", user.id)
      .eq("org_id", user.orgId),

    // Upcoming sessions (today + future) for enrolled sections
    supabase
      .from("sessions")
      .select(`
        id, session_date, topic, org_id,
        sections(name),
        users!sessions_trainer_id_fkey(email)
      `)
      .eq("org_id", user.orgId)
      .gte("session_date", today)
      .order("session_date", { ascending: true })
      .limit(10),

    // All grades for this student
    supabase
      .from("grades")
      .select("score, remarks, section_id, sections(name)")
      .eq("student_id", user.id)
      .eq("org_id", user.orgId),

    // All attendance records for this student
    supabase
      .from("attendance")
      .select("id, status, session_id, sessions(session_date, topic, section_id)")
      .eq("student_id", user.id)
      .eq("org_id", user.orgId)
      .order("sessions(session_date)", { ascending: false }),

    // Streak data
    supabase
      .from("streaks")
      .select("current_streak, longest_streak, total_xp, last_active_date")
      .eq("student_id", user.id)
      .single(),
  ]);

  // Filter upcoming sessions to only enrolled sections
  const enrolledSectionIds = new Set(
    (enrollmentsRes.data ?? []).map((e: any) => e.section_id)
  );
  const upcomingSessions = (upcomingSessionsRes.data ?? []).filter((s: any) =>
    enrolledSectionIds.has(s.sections?.id ?? "")
  );

  // Calculate attendance stats
  const allAttendance = attendanceRes.data ?? [];
  const present = allAttendance.filter((a: any) => a.status === "Present").length;
  const total = allAttendance.length;
  const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

  // Calculate average grade
  const grades = gradesRes.data ?? [];
  const avgGrade =
    grades.length > 0
      ? Math.round(grades.reduce((sum: number, g: any) => sum + (g.score ?? 0), 0) / grades.length)
      : null;

  return NextResponse.json({
    sections: enrollmentsRes.data ?? [],
    upcomingSessions,
    grades,
    attendance: allAttendance,
    attendanceRate,
    avgGrade,
    streak: streakRes.data ?? { current_streak: 0, longest_streak: 0, total_xp: 0 },
  });
}
