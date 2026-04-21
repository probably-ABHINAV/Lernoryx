import { requireAuth } from "@/lib/requireAuth";
import { SessionPlannerClient } from "./session-planner-client";
import { redirect } from "next/navigation";

export const metadata = { title: "Sessions — TMS" };

export default async function SessionsPage() {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "trainer") redirect("/dashboard");
  return <SessionPlannerClient />;
}
