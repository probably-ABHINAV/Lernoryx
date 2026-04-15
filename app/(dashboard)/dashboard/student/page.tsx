import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "View your schedule, grades, and attendance.",
};

export default async function StudentDashboardPage() {
  const user = await requireAuth();
  
  if (user.profile?.role !== "student") {
    redirect("/dashboard");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Your schedule, grades, and attendance at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Upcoming Sessions */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold">Upcoming Sessions</h2>
          {/* TODO: Session schedule component */}
          <p className="mt-4 text-sm text-slate-500">No upcoming sessions.</p>
        </div>

        {/* My Grades */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold">My Grades</h2>
          {/* TODO: Grades summary component */}
          <p className="mt-4 text-sm text-slate-500">No grades yet.</p>
        </div>

        {/* Attendance */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold">My Attendance</h2>
          {/* TODO: Attendance summary */}
          <p className="mt-4 text-sm text-slate-500">No records yet.</p>
        </div>
      </div>
    </div>
  );
}
