"use client";

import useSWR from "swr";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { Header } from "@/components/dashboard/header";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const STATUS_ICON: Record<string, any> = {
  ok:      { icon: CheckCircle, color: "#2eb67d", bg: "#edf7f3", label: "Operational"   },
  slow:    { icon: AlertTriangle, color: "#e8b931", bg: "#fefce8", label: "Degraded"     },
  down:    { icon: XCircle, color: "#e74c3c", bg: "#fef2f2", label: "Down"              },
  degraded:{ icon: AlertTriangle, color: "#e8b931", bg: "#fefce8", label: "Some Degraded" },
};

function LatencyBadge({ ms }: { ms: number }) {
  const color = ms < 0 ? "#e74c3c" : ms < 100 ? "#2eb67d" : ms < 300 ? "#e8b931" : "#e74c3c";
  const bg    = ms < 0 ? "#fef2f2" : ms < 100 ? "#edf7f3" : ms < 300 ? "#fefce8" : "#fef2f2";
  return (
    <span className="text-[11px] font-bold px-2 py-0.5 rounded-[8px]" style={{ backgroundColor: bg, color }}>
      {ms < 0 ? "timeout" : `${ms}ms`}
    </span>
  );
}

export function HealthClient() {
  const { data, isLoading, mutate } = useSWR("/api/super-admin/health", fetcher, {
    refreshInterval: 60_000,
  });

  const health      = data?.health ?? {};
  const services    = health.services ?? {};
  const overall     = health.overallStatus ?? "ok";
  const tableCounts = data?.tableCounts ?? [];
  const snapshots   = (data?.snapshots ?? []).reverse();
  const env         = data?.environment ?? {};

  const overallCfg  = STATUS_ICON[overall] ?? STATUS_ICON.ok;
  const OverallIcon = overallCfg.icon;

  return (
    <div className="space-y-6">
      <Header title="Platform Health" subtitle="Live diagnostics across all services">
        <button
          onClick={() => mutate()}
          className="flex items-center gap-2 px-4 py-2 border border-[#eef1f6] text-[#7a849b] rounded-[12px] text-[13px] font-bold hover:bg-[#f6f8fb] transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </Header>

      {/* Overall status banner */}
      <div className="rounded-[20px] p-5 flex items-center gap-4" style={{ backgroundColor: overallCfg.bg, border: `1px solid ${overallCfg.color}30` }}>
        <OverallIcon size={22} style={{ color: overallCfg.color }} />
        <div>
          <p className="text-[15px] font-extrabold" style={{ color: overallCfg.color }}>
            {overall === "ok" ? "All Systems Operational" : overallCfg.label}
          </p>
          <p className="text-[12px]" style={{ color: overallCfg.color, opacity: 0.7 }}>
            Last checked: {new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date())}
          </p>
        </div>
      </div>

      {/* Service cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          { key: "database", label: "Database",       icon: "🗄️" },
          { key: "auth",     label: "Authentication",  icon: "🔐" },
          { key: "storage",  label: "Storage",         icon: "🗂️" },
        ].map(({ key, label, icon }) => {
          const svc = services[key] ?? { latencyMs: -1, status: "down" };
          const cfg = STATUS_ICON[svc.status] ?? STATUS_ICON.down;
          const Icon = cfg.icon;
          return (
            <div key={key} className="bg-white rounded-[20px] border border-[#eef1f6] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{icon}</span>
                  <p className="text-[14px] font-extrabold text-[#1c2434]">{label}</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[10px]" style={{ backgroundColor: cfg.bg }}>
                  <Icon size={12} style={{ color: cfg.color }} />
                  <span className="text-[11px] font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[#9ca8c2]">Response time</span>
                {isLoading
                  ? <div className="h-5 w-16 bg-[#f8fafb] rounded-[8px] animate-pulse" />
                  : <LatencyBadge ms={svc.latencyMs} />
                }
              </div>
            </div>
          );
        })}
      </div>

      {/* Latency trend chart */}
      {snapshots.length > 1 && (
        <div className="bg-white rounded-[20px] border border-[#eef1f6] p-6">
          <h2 className="text-[15px] font-extrabold text-[#1c2434] mb-5">DB Latency History</h2>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={snapshots}>
              <defs>
                <linearGradient id="latGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2eb67d" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2eb67d" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f8" vertical={false} />
              <XAxis dataKey="checked_at" tickFormatter={(v) => new Date(v).toLocaleTimeString()} tick={{ fontSize: 10, fill: "#9ca8c2" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca8c2" }} axisLine={false} tickLine={false} unit="ms" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1c2434", border: "none", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                formatter={(v: any) => [`${v}ms`, "DB Latency"]}
              />
              <Area type="monotone" dataKey="db_latency_ms" stroke="#2eb67d" strokeWidth={2} fill="url(#latGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Table row counts */}
      <div className="bg-white rounded-[20px] border border-[#eef1f6] p-6">
        <h2 className="text-[15px] font-extrabold text-[#1c2434] mb-5">Database Table Counts</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {tableCounts.map(({ table, count }: { table: string; count: number }) => (
            <div key={table} className="bg-[#f8fafb] rounded-[14px] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2] mb-1 capitalize">{table.replace("_", " ")}</p>
              <p className="text-[22px] font-extrabold text-[#1c2434]">{isLoading ? "—" : count.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Environment info */}
      <div className="bg-white rounded-[20px] border border-[#eef1f6] p-6">
        <h2 className="text-[15px] font-extrabold text-[#1c2434] mb-4">Environment</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(env).map(([key, value]) => (
            <div key={key}>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2] mb-1 capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
              <p className="text-[13px] font-bold text-[#1c2434] font-mono">{String(value)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
