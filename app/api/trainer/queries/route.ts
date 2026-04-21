import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const answerSchema = z.object({
  queryId: z.string().uuid(),
  answer: z.string().min(1).max(2000),
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

  let query = supabase
    .from("queries")
    .select(`
      id, question, answer, status, created_at, answered_at, section_id,
      users!queries_student_id_fkey(email),
      sections(name)
    `)
    .eq("org_id", user.orgId)
    .order("created_at", { ascending: false });

  if (sectionId) query = query.eq("section_id", sectionId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ queries: data ?? [] });
}

export async function PATCH(request: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "trainer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();
  const body = await request.json();

  const parsed = answerSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { queryId, answer } = parsed.data;

  const { data: query } = await supabase
    .from("queries")
    .select("section_id")
    .eq("id", queryId)
    .eq("org_id", user.orgId)
    .single();

  if (!query) return NextResponse.json({ error: "Query not found" }, { status: 404 });

  const { error } = await supabase
    .from("queries")
    .update({
      answer,
      answered_by: user.id,
      answered_at: new Date().toISOString(),
      status: "answered",
    })
    .eq("id", queryId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
