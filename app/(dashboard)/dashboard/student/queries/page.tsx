import { requireAuth } from "@/lib/requireAuth";
import { createClient } from "@/lib/supabase/server";
import { QueriesClient } from "./queries-client";
import { redirect } from "next/navigation";

export const metadata = { title: "My Queries — TMS" };

export default async function QueriesPage() {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "student") redirect("/dashboard");
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();

  const { data: sections } = await supabase
    .from("enrollments")
    .select("section_id, sections(id, name)")
    .eq("student_id", user.id)
    .eq("org_id", user.orgId!);

  return <QueriesClient sections={(sections ?? []).map((e: any) => e.sections)} />;
}
