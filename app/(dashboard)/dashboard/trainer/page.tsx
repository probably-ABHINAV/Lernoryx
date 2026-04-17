import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TrainerClient } from "./trainer-client";

export const metadata: Metadata = {
  title: "Trainer Dashboard",
  description: "Manage your sessions, attendance, and students.",
};

export default async function TrainerDashboardPage() {
  const user = await requireAuth();
  
  if (user.profile?.role !== "trainer") {
    redirect("/dashboard");
  }

  return <TrainerClient />;
}
