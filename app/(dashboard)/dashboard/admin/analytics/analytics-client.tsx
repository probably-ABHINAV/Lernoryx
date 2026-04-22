"use client";

import useSWR from "swr";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Download, Users, BookOpen, Calendar, TrendingUp } from "lucide-react";
import { Header } from "@/components/dashboard/header";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const EXPORT_TYPES = [
  { key: "users",      label: "Users CSV"      },
  { key: "attendance", label: "Attendance CSV"  },
  { key: "grades",     label: "Grades CSV"      },
  { key: "sections",   label: "Sections CSV"    },
];

const DONUT_COLORS = ["#1c2434", "#2eb67d", "#e8b931", "#e74c3c"];

export function AnalyticsClient() {
  const { data, isLoading } = useSWR("/api/admin/analytics", fetcher);

  function handleExport(type: string) {
    window.open(`/api/admin/analytics/export?type=${type}`, "_blank");
  }

  const totals = data?.totals ?? {};
  const attendanceTrend = data?.attendanceTrend ?? [];
  const sectionGrades = data?.sectionAvgGrades ?? [];
  const roleCounts = data?.roleCounts ?? {};
  const roleChartData = Object.entries(roleCounts)
    .filter(([k]) => k !== "super_admin")
    .map(([role, count]) => ({ name: role, value: count }));

  return (
    <div className="space-y-6">
      <Header title="Analytics" subtitle="Organization-wide training metrics">
        <div className="flex items-center gap-2">
          {EXPORT_TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => handleExport(t.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#eef1f6] text-[#7a849b] rounded-[10px] text-[12px] font-bold hover:bg-[#f6f8fb] transition-colors"
            >
              <Download size={12} />
              {t.label}
            </button>
          ))}
        </div>
      </Header>

      {/* Totals row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "TOTAL USERS",     value: totals.users ?? "—",   icon: Users,    color: "#2eb67d" },
          { label: "SECTIONS",        value: totals.sections ?? "—", icon: BookOpen, color: "#185fa5" },
          { label: "SESSIONS",        value: totals.sessions ?? "—", icon: Calendar, color: "#e8b931" },
          { label: "ATTENDANCE RATE", value: data?.attendanceRate != null ? `${data.attendanceRate}%` : "—", icon: TrendingUp, color: "#2eb67d" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-[20px] border border-[#eef1f6] p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#9ca8c2]">{stat.label}</p>
                <div className="w-8 h-8 rounded-[10px] bg-[#f8fafb] flex items-center justify-center">
                  <Icon size={14} style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-[28px] font-extrabold" style={{ color: stat.color }}>
                {isLoading ? "—" : stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance trend */}
        <div className="lg:col-span-2 bg-white rounded-[20px] border border-[#eef1f6] p-6">
          <h3 className="text-[14px] font-extrabold text-[#1c2434] mb-5">Attendance Trend (Weekly)</h3>
          {isLoading || attendanceTrend.length === 0 ? (
            <div className="h-48 bg-[#f8fafb] rounded-[14px] animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2eb67d" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2eb67d" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f8" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9ca8c2" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca8c2" }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1c2434", border: "none", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                  formatter={(v: number) => [`${v}%`, "Attendance"]}
                />
                <Area type="monotone" dataKey="rate" stroke="#2eb67d" strokeWidth={2.5} fill="url(#attendanceGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Role distribution */}
        <div className="bg-white rounded-[20px] border border-[#eef1f6] p-6">
          <h3 className="text-[14px] font-extrabold text-[#1c2434] mb-5">Team Distribution</h3>
          {isLoading ? (
            <div className="h-48 bg-[#f8fafb] rounded-[14px] animate-pulse" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={roleChartData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" cornerRadius={4}>
                    {roleChartData.map((_, i) => (
                      <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1c2434", border: "none", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {roleChartData.map((item, i) => {
                  const total = roleChartData.reduce((s, r) => s + (r.value as number), 0);
                  const pct = total > 0 ? Math.round(((item.value as number) / total) * 100) : 0;
                  return (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                        <span className="text-[12px] font-bold text-[#7a849b] capitalize">{item.name}</span>
                      </div>
                      <span className="text-[12px] font-bold text-[#1c2434]">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Section average grades */}
      {sectionGrades.length > 0 && (
        <div className="bg-white rounded-[20px] border border-[#eef1f6] p-6">
          <h3 className="text-[14px] font-extrabold text-[#1c2434] mb-5">Average Score by Section</h3>
          <div className="space-y-3">
            {sectionGrades.sort((a: { avgScore: number }, b: { avgScore: number }) => b.avgScore - a.avgScore).map((s: { sectionId: string; avgScore: number; name: string }) => {
              const color = s.avgScore >= 80 ? "#2eb67d" : s.avgScore >= 60 ? "#e8b931" : "#e74c3c";
              return (
                <div key={s.sectionId} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[#1c2434]">{s.name}</span>
                    <span className="text-[13px] font-bold" style={{ color }}>{s.avgScore}%</span>
                  </div>
                  <div className="h-2 bg-[#eef1f6] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.avgScore}%`, backgroundColor: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
