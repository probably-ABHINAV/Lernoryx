import { requireAuth } from "@/lib/requireAuth";
import { createClient } from "@/lib/supabase/server";
import { AttendanceClient } from "./attendance-client";
import { redirect } from "next/navigation";

export const metadata = { title: "Mark Attendance — TMS" };

export default async function TrainerAttendancePage() {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "trainer") redirect("/dashboard");
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();

  // Get today's sessions for this trainer
  const today = new Date().toISOString().split("T")[0];

  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, session_date, topic, section_id, sections(name)")
    .eq("trainer_id", user.id)
    .eq("org_id", user.orgId!)
    .gte("session_date", today)
    .order("session_date", { ascending: true });

  return <AttendanceClient sessions={sessions ?? []} />;
}
