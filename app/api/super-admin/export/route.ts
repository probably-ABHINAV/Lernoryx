import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  await requireSuperAdmin();
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId");
  const type  = searchParams.get("type") ?? "full";

  if (!orgId) return NextResponse.json({ error: "orgId required" }, { status: 400 });

  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", orgId)
    .single();

  if (!org) return NextResponse.json({ error: "Org not found" }, { status: 404 });

  const csvSections: string[] = [];

  const { data: users } = await supabase.from("users").select("id,email,role,created_at").eq("org_id", orgId);
  csvSections.push("## USERS");
  csvSections.push("ID,Email,Role,Joined");
  for (const u of users ?? []) {
    csvSections.push(`${u.id},${u.email},${u.role},${new Date(u.created_at).toLocaleDateString()}`);
  }

  const { data: sections } = await supabase.from("sections").select("id,name,description,is_active").eq("org_id", orgId);
  csvSections.push("\n## SECTIONS");
  csvSections.push("ID,Name,Description,Active");
  for (const s of sections ?? []) {
    csvSections.push(`${s.id},"${s.name}","${s.description ?? ""}",${s.is_active}`);
  }

  const { data: grades } = await supabase.from("grades").select("student_id,section_id,score,remarks").eq("org_id", orgId);
  csvSections.push("\n## GRADES");
  csvSections.push("StudentID,SectionID,Score,Remarks");
  for (const g of grades ?? []) {
    csvSections.push(`${g.student_id},${g.section_id},${g.score ?? ""},"${g.remarks ?? ""}"`);
  }

  const { data: activity } = await supabase.from("activity_logs").select("user_id,action,created_at").eq("org_id", orgId).order("created_at");
  csvSections.push("\n## ACTIVITY LOGS");
  csvSections.push("UserID,Action,Timestamp");
  for (const a of activity ?? []) {
    csvSections.push(`${a.user_id},${a.action},${new Date(a.created_at).toISOString()}`);
  }

  const csv = csvSections.join("\n");
  const filename = `tms_gdpr_export_${org.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
