import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const sectionId = searchParams.get("sectionId");

  // Get all sessions for enrolled sections first
  let sessionsQuery = supabase
    .from("sessions")
    .select("id, session_date, topic, section_id, sections(name)")
    .eq("org_id", user.orgId)
    .order("session_date", { ascending: false });

  if (sectionId) sessionsQuery = sessionsQuery.eq("section_id", sectionId);

  const { data: sessions } = await sessionsQuery;

  // Get attendance for those sessions
  const { data: attendance } = await supabase
    .from("attendance")
    .select("session_id, status")
    .eq("student_id", user.id)
    .eq("org_id", user.orgId);

  // Merge
  const attendanceMap = new Map(
    (attendance ?? []).map((a: any) => [a.session_id, a.status])
  );

  const merged = (sessions ?? []).map((s: any) => ({
    ...s,
    status: attendanceMap.get(s.id) ?? "Not recorded",
  }));

  // Stats per section
  const statsBySection: Record<string, { present: number; absent: number; late: number; total: number }> = {};
  for (const s of merged) {
    const sid = s.section_id;
    if (!statsBySection[sid]) statsBySection[sid] = { present: 0, absent: 0, late: 0, total: 0 };
    statsBySection[sid].total++;
    if (s.status === "Present") statsBySection[sid].present++;
    if (s.status === "Absent") statsBySection[sid].absent++;
    if (s.status === "Late") statsBySection[sid].late++;
  }

  return NextResponse.json({ sessions: merged, statsBySection });
}
