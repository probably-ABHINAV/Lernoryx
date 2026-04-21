import { requireAuth } from "@/lib/requireAuth";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { StatCard } from "@/components/dashboard/stat-card";
import { Building2, Users, Layers, Activity, ArrowUpRight, Shield, HeartPulse } from "lucide-react";
import Link from "next/link";

export default async function SuperAdminPage() {
  const user = await requireAuth();

  if ((user.profile?.actual_role || user.profile?.role) !== "super_admin") {
    redirect("/dashboard");
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [orgsRes, usersRes, sectionsRes] = await Promise.all([
    supabase.from("organizations").select("id", { count: "exact", head: true }),
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("sections").select("id", { count: "exact", head: true }),
  ]);

  const orgCount = orgsRes.count ?? 0;
  const userCount = usersRes.count ?? 0;
  const sectionCount = sectionsRes.count ?? 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#1c2434] rounded-[20px] p-7 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-[#2eb67d]" />
            <p className="text-[11px] font-bold text-[#2eb67d] uppercase tracking-[0.15em]">Super Admin</p>
          </div>
          <h2 className="text-[22px] font-extrabold text-white tracking-tight">Platform Overview</h2>
          <p className="text-[13px] text-[#7a849b] mt-1.5">Monitor and manage the entire TMS training platform.</p>
        </div>
        <div className="absolute right-6 top-6 w-24 h-24 rounded-full border-[5px] border-[#2eb67d] opacity-10" />
        <div className="absolute right-20 bottom-3 w-14 h-14 rounded-[14px] border-[4px] border-[#e8b931] opacity-10 rotate-12" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard title="Organizations" value={orgCount} sparkData={[1, 1, 1, 1, 1]} accentColor="#2eb67d" />
        <StatCard title="Team Members" value={userCount} sparkData={[1, 1, 1]} accentColor="#1c2434" />
        <StatCard title="Training Batches" value={sectionCount} sparkData={[0, 0, 0]} accentColor="#e8b931" />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Link
          href="/super-admin/orgs"
          className="group bg-white rounded-[20px] shadow-sm p-7 flex items-center gap-5 hover:shadow-md transition-shadow duration-300"
        >
          <div className="w-14 h-14 rounded-full bg-[#edf7f3] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <Building2 className="w-6 h-6 text-[#2eb67d]" />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-extrabold text-[#1c2434]">Organizations</p>
            <p className="text-[12px] text-[#9ca8c2] font-medium mt-1">Manage all registered organizations.</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-[#9ca8c2] group-hover:text-[#2eb67d] transition-colors" />
        </Link>

        <Link
          href="/super-admin/health"
          className="group bg-white rounded-[20px] shadow-sm p-7 flex items-center gap-5 hover:shadow-md transition-shadow duration-300"
        >
          <div className="w-14 h-14 rounded-full bg-[#fff5e6] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <HeartPulse className="w-6 h-6 text-[#e8b931]" />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-extrabold text-[#1c2434]">Platform Health</p>
            <p className="text-[12px] text-[#9ca8c2] font-medium mt-1">Real-time diagnostics and system status.</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-[#9ca8c2] group-hover:text-[#e8b931] transition-colors" />
        </Link>
      </div>
    </div>
  );
}
