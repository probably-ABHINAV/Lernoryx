import { requireAuth } from "@/lib/requireAuth";
import { UsersManagerClient } from "./users-manager-client";
import { redirect } from "next/navigation";

export const metadata = { title: "Users — TMS Admin" };

export default async function AdminUsersPage() {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "admin" && authUser.profile.role !== "super_admin") redirect("/dashboard");
  return <UsersManagerClient />;
}
