import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "admin" && authUser.profile.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();

  const [
    usersRes, sectionsRes, sessionsRes, attendanceRes, gradesRes,
    activityRes, invitesRes
  ] = await Promise.all([
    supabase.from("users").select("id, role, created_at").eq("org_id", user.orgId),
    supabase.from("sections").select("id, name, is_active, created_at").eq("org_id", user.orgId),
    supabase.from("sessions").select("id, session_date, section_id").eq("org_id", user.orgId).order("session_date"),
    supabase.from("attendance").select("status, session_id, sessions(session_date)").eq("org_id", user.orgId),
    supabase.from("grades").select("score, section_id").eq("org_id", user.orgId),
    supabase.from("activity_logs").select("action, created_at, user_id, metadata").eq("org_id", user.orgId).order("created_at", { ascending: false }).limit(20),
    supabase.from("invites").select("status").eq("org_id", user.orgId),
  ]);

  const users     = usersRes.data ?? [];
  const sections  = sectionsRes.data ?? [];
  const sessions  = sessionsRes.data ?? [];
  const attendance = attendanceRes.data ?? [];
  const grades    = gradesRes.data ?? [];
  const activity  = activityRes.data ?? [];

  // Role breakdown
  const roleCounts = users.reduce((acc: Record<string, number>, u: any) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1;
    return acc;
  }, {});

  // Attendance rate (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentAttendance = attendance.filter((a: any) =>
    a.sessions?.session_date && new Date(a.sessions.session_date) > thirtyDaysAgo
  );
  const presentCount = recentAttendance.filter((a: any) => a.status === "Present").length;
  const attendanceRate = recentAttendance.length > 0
    ? Math.round((presentCount / recentAttendance.length) * 100) : 0;

  // Average grade per section
  const gradeSumBySection: Record<string, { sum: number; count: number; name: string }> = {};
  for (const g of grades) {
    const sid = (g as any).section_id;
    const section = sections.find((s: any) => s.id === sid);
    if (!gradeSumBySection[sid]) gradeSumBySection[sid] = { sum: 0, count: 0, name: section?.name ?? "Unknown" };
    gradeSumBySection[sid].sum += (g as any).score ?? 0;
    gradeSumBySection[sid].count++;
  }

  const sectionAvgGrades = Object.entries(gradeSumBySection).map(([id, v]) => ({
    sectionId: id,
    name: v.name,
    avgScore: Math.round(v.sum / v.count),
  }));

  // Attendance trend (last 8 weeks — Mon–Sun buckets)
  const weeklyAttendance: Record<string, { present: number; total: number }> = {};
  for (const a of attendance) {
    const d = (a as any).sessions?.session_date;
    if (!d) continue;
    const weekStart = getWeekStart(new Date(d));
    if (!weeklyAttendance[weekStart]) weeklyAttendance[weekStart] = { present: 0, total: 0 };
    weeklyAttendance[weekStart].total++;
    if ((a as any).status === "Present") weeklyAttendance[weekStart].present++;
  }

  const attendanceTrend = Object.entries(weeklyAttendance)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([week, v]) => ({
      week,
      rate: v.total > 0 ? Math.round((v.present / v.total) * 100) : 0,
    }));

  return NextResponse.json({
    totals: {
      users: users.length,
      sections: sections.length,
      activeSections: sections.filter((s: any) => s.is_active).length,
      sessions: sessions.length,
    },
    roleCounts,
    attendanceRate,
    attendanceTrend,
    sectionAvgGrades,
    recentActivity: activity,
    invitePending: (invitesRes.data ?? []).filter((i: any) => i.status === "pending").length,
  });
}

function getWeekStart(date: Date): string {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split("T")[0];
}
