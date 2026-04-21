import { requireAuth } from "@/lib/requireAuth";
import { createClient } from "@/lib/supabase/server";
import { GradesClient } from "./grades-client";
import { redirect } from "next/navigation";

export const metadata = { title: "My Grades — TMS" };

export default async function GradesPage() {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "student") redirect("/dashboard");
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();

  const { data: grades } = await supabase
    .from("grades")
    .select("id, score, remarks, section_id, sections(name, description)")
    .eq("student_id", user.id)
    .eq("org_id", user.orgId!)
    .order("score", { ascending: false });

  return <GradesClient grades={grades ?? []} />;
}
