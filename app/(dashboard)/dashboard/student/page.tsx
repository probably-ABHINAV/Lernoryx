import type { Metadata } from "next";
import { requireAuth } from "@/lib/requireAuth";
import { redirect } from "next/navigation";
import { StudentClient } from "./student-client";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "View your schedule, grades, and attendance.",
};

export default async function StudentDashboardPage() {
  const user = await requireAuth();
  
  if (user.profile?.role !== "student") {
    redirect("/dashboard");
  }

  return <StudentClient />;
}
