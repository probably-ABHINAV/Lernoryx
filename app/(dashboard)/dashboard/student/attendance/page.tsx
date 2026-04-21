import { requireAuth } from "@/lib/requireAuth";
import { AttendanceClient } from "./attendance-client";
import { redirect } from "next/navigation";

export const metadata = { title: "My Attendance — TMS" };

export default async function AttendancePage() {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "student") redirect("/dashboard");
  return <AttendanceClient />;
}
