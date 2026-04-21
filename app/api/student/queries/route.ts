import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const createQuerySchema = z.object({
  sectionId: z.string().uuid(),
  question: z.string().min(10, "Question must be at least 10 characters").max(1000),
});

export async function GET(request: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const sectionId = searchParams.get("sectionId");

  let query = supabase
    .from("queries")
    .select(`
      id, question, answer, status, created_at, answered_at,
      users!queries_answered_by_fkey(email)
    `)
    .eq("student_id", user.id)
    .eq("org_id", user.orgId)
    .order("created_at", { ascending: false });

  if (sectionId) query = query.eq("section_id", sectionId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ queries: data });
}

export async function POST(request: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();
  const body = await request.json();

  const parsed = createQuerySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Verify student is enrolled in this section
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("student_id", user.id)
    .eq("section_id", parsed.data.sectionId)
    .single();

  if (!enrollment) {
    return NextResponse.json({ error: "Not enrolled in this section" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("queries")
    .insert({
      section_id: parsed.data.sectionId,
      student_id: user.id,
      question: parsed.data.question,
      org_id: user.orgId,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log activity
  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action: "asked_query",
    metadata: { section_id: parsed.data.sectionId, query_id: data.id },
    org_id: user.orgId,
  });

  return NextResponse.json({ query: data }, { status: 201 });
}
