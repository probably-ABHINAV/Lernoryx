import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const createSessionSchema = z.object({
  sectionId: z.string().uuid(),
  sessionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  topic: z.string().min(3).max(200),
  notes: z.string().max(2000).optional(),
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
    .from("sessions")
    .select("id, session_date, topic, notes, section_id, sections(name)")
    .eq("trainer_id", user.id)
    .eq("org_id", user.orgId)
    .order("session_date", { ascending: false });

  if (sectionId) query = query.eq("section_id", sectionId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sessions: data ?? [] });
}

export async function POST(request: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "trainer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();
  const body = await request.json();

  const parsed = createSessionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { data, error } = await supabase
    .from("sessions")
    .insert({
      section_id: parsed.data.sectionId,
      trainer_id: user.id,
      session_date: parsed.data.sessionDate,
      topic: parsed.data.topic,
      notes: parsed.data.notes ?? null,
      org_id: user.orgId,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action: "created_session",
    metadata: { session_id: data.id, section_id: parsed.data.sectionId },
    org_id: user.orgId,
  });

  return NextResponse.json({ session: data }, { status: 201 });
}
