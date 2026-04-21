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

  if (!sectionId) {
    return NextResponse.json({ error: "sectionId required" }, { status: 400 });
  }

  // Get all students in section with their grades
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("student_id")
    .eq("section_id", sectionId)
    .eq("org_id", user.orgId);

  const studentIds = (enrollments ?? []).map((e: any) => e.student_id);

  const { data: grades } = await supabase
    .from("grades")
    .select("student_id, score")
    .eq("section_id", sectionId)
    .in("student_id", studentIds);

  // Build leaderboard — anonymized (show "You" for current user, "Trainee #N" for others)
  const sorted = (grades ?? [])
    .sort((a: any, b: any) => (b.score ?? 0) - (a.score ?? 0))
    .map((g: any, i: number) => ({
      rank: i + 1,
      label: g.student_id === user.id ? "You" : `Trainee #${i + 1}`,
      score: g.score,
      isCurrentUser: g.student_id === user.id,
    }));

  return NextResponse.json({ leaderboard: sorted });
}
