import type { Metadata } from "next";
import { requireAuth } from "@/lib/requireAuth";
import { redirect } from "next/navigation";
import { AdminClient } from "./admin-client";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Overview of your training management system.",
};

export default async function AdminDashboardPage() {
  const user = await requireAuth();
  
  if (user.profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return <AdminClient />;
}
