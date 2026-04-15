import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Trainer Dashboard",
  description: "Manage your sessions, attendance, and students.",
};

export default async function TrainerDashboardPage() {
  const user = await requireAuth();
  
  if (user.profile?.role !== "trainer") {
    redirect("/dashboard");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Trainer Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your sessions and track student progress
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Sessions */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold">Today&apos;s Sessions</h2>
          {/* TODO: Session list component */}
          <p className="mt-4 text-sm text-slate-500">No sessions today.</p>
        </div>

        {/* Attendance Overview */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold">Attendance Overview</h2>
          {/* TODO: Attendance chart */}
          <p className="mt-4 text-sm text-slate-500">
            Attendance data will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
