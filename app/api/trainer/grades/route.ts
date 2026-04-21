import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const bulkGradeSchema = z.object({
  sectionId: z.string().uuid(),
  grades: z.array(z.object({
    studentId: z.string(),
    score: z.number().min(0).max(100),
    remarks: z.string().max(500).optional(),
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
  const sectionId = searchParams.get("sectionId");

  if (!sectionId) return NextResponse.json({ error: "sectionId required" }, { status: 400 });

  const { data: grades } = await supabase
    .from("grades")
    .select("id, student_id, score, remarks, users(email)")
    .eq("section_id", sectionId)
    .eq("org_id", user.orgId);

  return NextResponse.json({ grades: grades ?? [] });
}

export async function POST(request: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "trainer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();
  const body = await request.json();

  const parsed = bulkGradeSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { sectionId, grades } = parsed.data;

  // Verify trainer has a session in this section
  const { data: session } = await supabase
    .from("sessions")
    .select("id")
    .eq("section_id", sectionId)
    .eq("trainer_id", user.id)
    .limit(1)
    .single();

  if (!session) return NextResponse.json({ error: "Not authorized for this section" }, { status: 403 });

  const rows = grades.map((g) => ({
    section_id: sectionId,
    student_id: g.studentId,
    score: g.score,
    remarks: g.remarks ?? null,
    org_id: user.orgId,
  }));

  const { error } = await supabase
    .from("grades")
    .upsert(rows, { onConflict: "section_id,student_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action: "entered_grades",
    metadata: { section_id: sectionId, count: grades.length },
    org_id: user.orgId,
  });

  return NextResponse.json({ success: true });
}
