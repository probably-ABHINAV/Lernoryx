import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const uploadSchema = z.object({
  sectionId: z.string().uuid(),
  title: z.string().min(1).max(200),
  fileUrl: z.string().url(),
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
    .from("content")
    .select("id, title, file_url, created_at, section_id, sections(name)")
    .eq("uploaded_by", user.id)
    .eq("org_id", user.orgId)
    .order("created_at", { ascending: false });

  if (sectionId) query = query.eq("section_id", sectionId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ content: data ?? [] });
}

export async function POST(request: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "trainer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();
  const body = await request.json();

  const parsed = uploadSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { data, error } = await supabase
    .from("content")
    .insert({
      section_id: parsed.data.sectionId,
      title: parsed.data.title,
      file_url: parsed.data.fileUrl,
      uploaded_by: user.id,
      org_id: user.orgId,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ content: data }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "trainer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await supabase
    .from("content")
    .delete()
    .eq("id", id)
    .eq("uploaded_by", user.id)
    .eq("org_id", user.orgId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
