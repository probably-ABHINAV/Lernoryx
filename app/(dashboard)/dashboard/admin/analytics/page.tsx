import { requireAuth } from "@/lib/requireAuth";
import { AnalyticsClient } from "./analytics-client";
import { redirect } from "next/navigation";

export const metadata = { title: "Analytics — TMS Admin" };

export default async function AnalyticsPage() {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "admin" && authUser.profile.role !== "super_admin") redirect("/dashboard");
  return <AnalyticsClient />;
}
