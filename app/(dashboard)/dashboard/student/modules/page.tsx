import { requireAuth } from "@/lib/requireAuth";
import { createClient } from "@/lib/supabase/server";
import { ModulesClient } from "./modules-client";
import { redirect } from "next/navigation";

export const metadata = { title: "Modules & Docs — TMS" };

export default async function ModulesPage() {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "student") redirect("/dashboard");
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();

  // Get enrolled sections
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("section_id, sections(id, name, description)")
    .eq("student_id", user.id)
    .eq("org_id", user.orgId!);

  const sections = (enrollments ?? []).map((e: any) => e.sections);
  return <ModulesClient sections={sections} />;
}
