import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { createClient } from "@/lib/supabase/server";

type ExportType = "users" | "attendance" | "grades" | "sections";

export async function GET(request: NextRequest) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "admin" && authUser.profile.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as ExportType;

  const ALLOWED = ["users", "attendance", "grades", "sections"] as const;
  if (!ALLOWED.includes(type as any)) {
    return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
  }

  let csvRows: string[] = [];

  if (type === "users") {
    const { data } = await supabase
      .from("users")
      .select("id, email, role, created_at")
      .eq("org_id", user.orgId)
      .order("created_at");

    csvRows = [
      "ID,Email,Role,Joined",
      ...(data ?? []).map((u: any) =>
        `${u.id},${u.email},${u.role},${new Date(u.created_at).toLocaleDateString()}`
      ),
    ];
  }

  if (type === "attendance") {
    const { data } = await supabase
      .from("attendance")
      .select("status, student_id, session_id, sessions(session_date, topic, section_id, sections(name)), users(email)")
      .eq("org_id", user.orgId)
      .order("sessions(session_date)");

    csvRows = [
      "Student Email,Section,Topic,Date,Status",
      ...(data ?? []).map((a: any) =>
        `${a.users?.email},${a.sessions?.sections?.name ?? ""},${a.sessions?.topic ?? ""},${a.sessions?.session_date ?? ""},${a.status}`
      ),
    ];
  }

  if (type === "grades") {
    const { data } = await supabase
      .from("grades")
      .select("score, remarks, student_id, section_id, sections(name), users(email)")
      .eq("org_id", user.orgId);

    csvRows = [
      "Student Email,Section,Score,Remarks",
      ...(data ?? []).map((g: any) =>
        `${g.users?.email},${g.sections?.name ?? ""},${g.score ?? ""},${g.remarks ?? ""}`
      ),
    ];
  }

  if (type === "sections") {
    const { data } = await supabase
      .from("sections")
      .select("id, name, description, max_capacity, is_active, created_at")
      .eq("org_id", user.orgId);

    csvRows = [
      "Name,Description,Capacity,Active,Created",
      ...(data ?? []).map((s: any) =>
        `"${s.name}","${s.description ?? ""}",${s.max_capacity},${s.is_active},${new Date(s.created_at).toLocaleDateString()}`
      ),
    ];
  }

  const csv = csvRows.join("\n");
  const filename = `tms_${type}_${new Date().toISOString().split("T")[0]}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
