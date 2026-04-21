import { requireAuth } from "@/lib/requireAuth";
import { SettingsClient } from "./settings-client";
import { redirect } from "next/navigation";

export const metadata = { title: "Settings — TMS Admin" };

export default async function AdminSettingsPage() {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "admin" && authUser.profile.role !== "super_admin") redirect("/dashboard");
  return <SettingsClient />;
}
