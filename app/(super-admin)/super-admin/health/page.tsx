import type { Metadata } from "next";
import { requireAuth } from "@/lib/requireAuth";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Activity, Database, Globe, Clock, CheckCircle2, AlertTriangle, Server, Zap, HardDrive, Wifi } from "lucide-react";

export const metadata: Metadata = {
  title: "Platform Health",
  description: "Monitor platform health, uptime, and system performance.",
};

async function getHealthMetrics() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const startTime = Date.now();
  const { data: dbTest, error: dbError } = await supabase
    .from("organizations")
    .select("id")
    .limit(1);
  const dbLatency = Date.now() - startTime;

  const [usersRes, orgsRes, sectionsRes, sessionsRes, attendanceRes, gradesRes, contentRes, logsRes] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("organizations").select("id", { count: "exact", head: true }),
    supabase.from("sections").select("id", { count: "exact", head: true }),
    supabase.from("sessions").select("id", { count: "exact", head: true }),
    supabase.from("attendance").select("id", { count: "exact", head: true }),
    supabase.from("grades").select("id", { count: "exact", head: true }),
    supabase.from("content").select("id", { count: "exact", head: true }),
    supabase.from("activity_logs").select("id", { count: "exact", head: true }),
  ]);

  const authStart = Date.now();
  const authRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/health`, {
    headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! },
  }).catch(() => null);
  const authLatency = Date.now() - authStart;

  const storageStart = Date.now();
  const storageRes = await supabase.storage.listBuckets();
  const storageLatency = Date.now() - storageStart;

  return {
    database: { status: dbError ? "degraded" : "operational", latency: dbLatency, error: dbError?.message || null },
    auth: { status: authRes?.ok ? "operational" : "degraded", latency: authLatency },
    storage: { status: storageRes.error ? "degraded" : "operational", latency: storageLatency, buckets: storageRes.data?.length || 0 },
    tables: {
      users: usersRes.count ?? 0, organizations: orgsRes.count ?? 0, sections: sectionsRes.count ?? 0,
      sessions: sessionsRes.count ?? 0, attendance: attendanceRes.count ?? 0, grades: gradesRes.count ?? 0,
      content: contentRes.count ?? 0, activity_logs: logsRes.count ?? 0,
    },
    timestamp: new Date().toISOString(),
  };
}

function StatusBadge({ status }: { status: string }) {
  const isOk = status === "operational";
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold ${
      isOk ? "bg-[#e6faf5] text-[#05cd99]" : "bg-[#fff5e6] text-[#ffb547]"
    }`}>
      {isOk ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
      {isOk ? "Operational" : "Degraded"}
    </span>
  );
}

function LatencyBadge({ ms }: { ms: number }) {
  const color = ms < 100 ? "text-[#05cd99] bg-[#e6faf5]" : ms < 300 ? "text-[#ffb547] bg-[#fff5e6]" : "text-[#ff6b6b] bg-[#fff5f5]";
  return (
    <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-xl ${color}`}>
      {ms}ms
    </span>
  );
}

export default async function HealthPage() {
  const user = await requireAuth();
  if (user.profile?.actual_role !== "super_admin") {
    redirect("/dashboard");
  }

  const health = await getHealthMetrics();
  const allOperational = health.database.status === "operational" && health.auth.status === "operational" && health.storage.status === "operational";
  const tableEntries = Object.entries(health.tables);
  const totalRows = tableEntries.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className={`rounded-[20px] p-6 flex items-center gap-5 ${allOperational ? "bg-[#e6faf5]" : "bg-[#fff5e6]"}`}>
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${allOperational ? "bg-white" : "bg-white"}`}>
          {allOperational
            ? <CheckCircle2 className="w-7 h-7 text-[#05cd99]" />
            : <AlertTriangle className="w-7 h-7 text-[#ffb547]" />
          }
        </div>
        <div>
          <p className={`text-[16px] font-extrabold ${allOperational ? "text-[#1e1e2d]" : "text-[#1e1e2d]"}`}>
            {allOperational ? "All Systems Operational" : "Some Systems Degraded"}
          </p>
          <p className={`text-[13px] mt-0.5 font-medium ${allOperational ? "text-[#05cd99]" : "text-[#ffb547]"}`}>
            {allOperational ? "All platform services are running normally." : "One or more services are experiencing issues."}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-[12px] text-[#a3aed0] font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>Checked {new Date(health.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Database */}
        <div className="bg-white rounded-[20px] shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#f4f7fe] flex items-center justify-center">
                <Database className="w-5 h-5 text-[#4361ee]" />
              </div>
              <div>
                <p className="text-[14px] font-extrabold text-[#1e1e2d]">Database</p>
                <p className="text-[11px] text-[#a3aed0] font-medium">PostgreSQL via Supabase</p>
              </div>
            </div>
            <StatusBadge status={health.database.status} />
          </div>
          <div className="space-y-0">
            <div className="flex items-center justify-between py-3 border-t border-[#f4f7fe]">
              <span className="text-[12px] text-[#a3aed0] font-semibold">Query Latency</span>
              <LatencyBadge ms={health.database.latency} />
            </div>
            <div className="flex items-center justify-between py-3 border-t border-[#f4f7fe]">
              <span className="text-[12px] text-[#a3aed0] font-semibold">Total Rows</span>
              <span className="text-[12px] font-bold text-[#1e1e2d]">{totalRows.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-[#f4f7fe]">
              <span className="text-[12px] text-[#a3aed0] font-semibold">Tables Active</span>
              <span className="text-[12px] font-bold text-[#1e1e2d]">{tableEntries.length}</span>
            </div>
          </div>
        </div>

        {/* Auth */}
        <div className="bg-white rounded-[20px] shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#f3f0ff] flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#7b68ee]" />
              </div>
              <div>
                <p className="text-[14px] font-extrabold text-[#1e1e2d]">Authentication</p>
                <p className="text-[11px] text-[#a3aed0] font-medium">GoTrue Auth Service</p>
              </div>
            </div>
            <StatusBadge status={health.auth.status} />
          </div>
          <div className="space-y-0">
            <div className="flex items-center justify-between py-3 border-t border-[#f4f7fe]">
              <span className="text-[12px] text-[#a3aed0] font-semibold">Response Time</span>
              <LatencyBadge ms={health.auth.latency} />
            </div>
            <div className="flex items-center justify-between py-3 border-t border-[#f4f7fe]">
              <span className="text-[12px] text-[#a3aed0] font-semibold">Provider</span>
              <span className="text-[12px] font-bold text-[#1e1e2d]">Email / Password</span>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-[#f4f7fe]">
              <span className="text-[12px] text-[#a3aed0] font-semibold">Registered Users</span>
              <span className="text-[12px] font-bold text-[#1e1e2d]">{health.tables.users}</span>
            </div>
          </div>
        </div>

        {/* Storage */}
        <div className="bg-white rounded-[20px] shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#e6faf5] flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-[#05cd99]" />
              </div>
              <div>
                <p className="text-[14px] font-extrabold text-[#1e1e2d]">Storage</p>
                <p className="text-[11px] text-[#a3aed0] font-medium">S3-compatible Object Store</p>
              </div>
            </div>
            <StatusBadge status={health.storage.status} />
          </div>
          <div className="space-y-0">
            <div className="flex items-center justify-between py-3 border-t border-[#f4f7fe]">
              <span className="text-[12px] text-[#a3aed0] font-semibold">Response Time</span>
              <LatencyBadge ms={health.storage.latency} />
            </div>
            <div className="flex items-center justify-between py-3 border-t border-[#f4f7fe]">
              <span className="text-[12px] text-[#a3aed0] font-semibold">Active Buckets</span>
              <span className="text-[12px] font-bold text-[#1e1e2d]">{health.storage.buckets}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-[#f4f7fe]">
              <span className="text-[12px] text-[#a3aed0] font-semibold">Content Uploads</span>
              <span className="text-[12px] font-bold text-[#1e1e2d]">{health.tables.content}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Row Counts */}
      <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
        <div className="px-7 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-extrabold text-[#1e1e2d]">Database Tables</h2>
            <p className="text-[12px] text-[#a3aed0] font-medium mt-1">Row counts across all core tables</p>
          </div>
          <span className="text-[11px] text-[#a3aed0] bg-[#f4f7fe] px-3 py-1.5 rounded-xl font-bold">{totalRows.toLocaleString()} total rows</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4">
          {tableEntries.map(([name, count]) => (
            <div key={name} className="px-7 py-5 border-t border-[#f4f7fe] hover:bg-[#f4f7fe]/50 transition-colors">
              <p className="text-[10px] font-bold text-[#a3aed0] uppercase tracking-[0.15em]">{name.replace("_", " ")}</p>
              <p className="text-[22px] font-extrabold text-[#1e1e2d] mt-1">{count.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Environment */}
      <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
        <div className="px-7 py-5">
          <h2 className="text-[16px] font-extrabold text-[#1e1e2d]">Environment</h2>
          <p className="text-[12px] text-[#a3aed0] font-medium mt-1">Runtime and infrastructure configuration</p>
        </div>
        <div className="px-7 pb-5 space-y-0">
          {[
            { label: "Runtime", value: "Next.js (Edge + Node)", icon: Server },
            { label: "Database", value: "Supabase PostgreSQL", icon: Database },
            { label: "Region", value: "Auto (CDN Edge)", icon: Globe },
            { label: "API Endpoint", value: process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "") || "—", icon: Wifi },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3.5 border-t border-[#f4f7fe]">
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-[#a3aed0]" strokeWidth={1.8} />
                <span className="text-[13px] text-[#8f9bba] font-semibold">{item.label}</span>
              </div>
              <span className="text-[12px] font-mono font-bold text-[#1e1e2d]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
