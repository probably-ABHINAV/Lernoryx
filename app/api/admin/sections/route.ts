import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const sectionSchema = z.object({
  name:        z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  maxCapacity: z.number().int().min(1).max(500).default(30),
});

export async function GET(_: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "admin" && authUser.profile.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();

  const { data: sections, error } = await supabase
    .from("sections")
    .select(`
      id, name, description, max_capacity, is_active, created_at,
      enrollments(count),
      sessions(count)
    `)
    .eq("org_id", user.orgId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sections: sections ?? [] });
}

export async function POST(request: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "admin" && authUser.profile.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();
  const body = await request.json();

  const parsed = sectionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { data, error } = await supabase
    .from("sections")
    .insert({
      name:         parsed.data.name,
      description:  parsed.data.description ?? null,
      max_capacity: parsed.data.maxCapacity,
      is_active:    true,
      created_by:   user.id,
      org_id:       user.orgId,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action: "created_section",
    metadata: { section_id: data.id, name: data.name },
    org_id: user.orgId,
  });

  return NextResponse.json({ section: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "admin" && authUser.profile.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();
  const body = await request.json();
  const { id, ...rest } = body;

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const parsed = sectionSchema.partial().safeParse(rest);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (parsed.data.name        !== undefined) updates.name         = parsed.data.name;
  if (parsed.data.description !== undefined) updates.description  = parsed.data.description;
  if (parsed.data.maxCapacity !== undefined) updates.max_capacity = parsed.data.maxCapacity;
  if (body.isActive           !== undefined) updates.is_active    = body.isActive;

  const { data, error } = await supabase
    .from("sections")
    .update(updates)
    .eq("id", id)
    .eq("org_id", user.orgId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action: "updated_section",
    metadata: { section_id: id, changes: Object.keys(updates) },
    org_id: user.orgId,
  });

  return NextResponse.json({ section: data });
}

export async function DELETE(request: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "admin" && authUser.profile.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const force = searchParams.get("force") === "true";

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  // Check for active enrollments
  const { count } = await supabase
    .from("enrollments")
    .select("*", { count: "exact", head: true })
    .eq("section_id", id);

  if ((count ?? 0) > 0 && !force) {
    return NextResponse.json({
      error: "Section has enrolled students",
      enrollmentCount: count,
      requiresForce: true,
    }, { status: 409 });
  }

  const { error } = await supabase
    .from("sections")
    .delete()
    .eq("id", id)
    .eq("org_id", user.orgId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action: "deleted_section",
    metadata: { section_id: id, forced: force },
    org_id: user.orgId,
  });

  return NextResponse.json({ success: true });
}
