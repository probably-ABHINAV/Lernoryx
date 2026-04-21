import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const announcementSchema = z.object({
  sectionId: z.string().uuid(),
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(2000),
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
    .from("announcements")
    .select("id, title, body, created_at, section_id, sections(name)")
    .eq("org_id", user.orgId)
    .order("created_at", { ascending: false });

  if (sectionId) query = query.eq("section_id", sectionId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ announcements: data ?? [] });
}

export async function POST(request: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "trainer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();
  const body = await request.json();

  const parsed = announcementSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { data, error } = await supabase
    .from("announcements")
    .insert({
      section_id: parsed.data.sectionId,
      trainer_id: user.id,
      title: parsed.data.title,
      body: parsed.data.body,
      org_id: user.orgId,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ announcement: data }, { status: 201 });
}
