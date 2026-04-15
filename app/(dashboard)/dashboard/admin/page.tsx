import type { Metadata } from "next";
import { StatCard } from "@/components/dashboard/stat-card";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Overview of your training management system.",
};

const stats = [
  { label: "Total Students", value: "1,248", change: "+12%", trend: "up" as const },
  { label: "Active Trainers", value: "36", change: "+3", trend: "up" as const },
  { label: "Sessions This Week", value: "128", change: "-5%", trend: "down" as const },
  { label: "Revenue (MTD)", value: "$24,500", change: "+8%", trend: "up" as const },
];

export default async function AdminDashboardPage() {
  const user = await requireAuth();
  
  if (user.profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of your organization&apos;s training operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* TODO: Add recent activity, charts, quick actions */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <p className="mt-4 text-sm text-slate-500">
            Activity feed coming soon...
          </p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <p className="mt-4 text-sm text-slate-500">
            Quick action panel coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
