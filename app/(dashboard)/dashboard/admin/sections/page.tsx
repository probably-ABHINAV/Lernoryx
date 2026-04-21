import { requireAuth } from "@/lib/requireAuth";
import { SectionsManagerClient } from "./sections-manager-client";
import { redirect } from "next/navigation";

export const metadata = { title: "Sections — TMS Admin" };

export default async function AdminSectionsPage() {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "admin" && authUser.profile.role !== "super_admin") redirect("/dashboard");
  return <SectionsManagerClient />;
}
