import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "trainer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();

  // Get unique section IDs this trainer has sessions in
  const { data: sessionRows } = await supabase
    .from("sessions")
    .select("section_id")
    .eq("trainer_id", user.id)
    .eq("org_id", user.orgId);

  const sectionIds = [...new Set((sessionRows ?? []).map((s: any) => s.section_id))];

  if (sectionIds.length === 0) return NextResponse.json({ sections: [] });

  const { data: sections } = await supabase
    .from("sections")
    .select("id, name, description, is_active, max_capacity")
    .in("id", sectionIds)
    .eq("org_id", user.orgId);

  // For each section, get student count
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("section_id, student_id")
    .in("section_id", sectionIds)
    .eq("org_id", user.orgId);

  const countBySectionId: Record<string, number> = {};
  for (const e of enrollments ?? []) {
    countBySectionId[e.section_id] = (countBySectionId[e.section_id] ?? 0) + 1;
  }

  const enriched = (sections ?? []).map((s: any) => ({
    ...s,
    studentCount: countBySectionId[s.id] ?? 0,
  }));

  return NextResponse.json({ sections: enriched });
}
