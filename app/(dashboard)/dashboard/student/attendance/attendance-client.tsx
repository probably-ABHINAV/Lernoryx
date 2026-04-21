"use client";

import { useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, Calendar } from "lucide-react";
import { Header } from "@/components/dashboard/header";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const STATUS_CONFIG = {
  Present:      { color: "#2eb67d", bg: "#edf7f3", icon: CheckCircle },
  Absent:       { color: "#e74c3c", bg: "#fef2f2", icon: XCircle },
  Late:         { color: "#e8b931", bg: "#fefce8", icon: Clock },
  "Not recorded": { color: "#9ca8c2", bg: "#f8fafb", icon: Calendar },
};

// Calendar heatmap: renders a 7-column grid for the past N weeks
function AttendanceHeatmap({ sessions }: { sessions: any[] }) {
  // Build a map of date -> status
  const dateMap = new Map<string, string>();
  for (const s of sessions) {
    const d = s.sessions?.session_date ?? s.session_date;
    if (d) dateMap.set(d, s.status);
  }

  // Generate last 12 weeks (84 days)
  const days: { date: string; status: string | null }[] = [];
  const today = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split("T")[0];
    days.push({ date: key, status: dateMap.get(key) ?? null });
  }

  const colorForStatus = (status: string | null) => {
    if (!status) return "#f0f3f8";
    if (status === "Present") return "#2eb67d";
    if (status === "Late") return "#e8b931";
    if (status === "Absent") return "#e74c3c";
    return "#f0f3f8";
  };

  // Pad so the first day starts on the right weekday column
  const firstDay = new Date(days[0].date).getDay();
  const padded = [...Array(firstDay).fill(null), ...days];

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-[10px] font-bold text-[#9ca8c2] text-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {padded.map((day, i) =>
          day === null ? (
            <div key={i} />
          ) : (
            <div
              key={i}
              className="aspect-square rounded-[4px] cursor-default group relative"
              style={{ backgroundColor: colorForStatus(day.status) }}
              title={`${day.date}: ${day.status ?? "No session"}`}
            />
          )
        )}
      </div>
      <div className="flex items-center gap-4 mt-3">
        {[["Present", "#2eb67d"], ["Late", "#e8b931"], ["Absent", "#e74c3c"], ["No session", "#f0f3f8"]].map(([label, color]) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: color }} />
            <span className="text-[11px] text-[#9ca8c2]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AttendanceClient() {
  const { data, isLoading } = useSWR("/api/student/attendance", fetcher);
  const sessions = data?.sessions ?? [];
  const stats = data?.statsBySection ?? {};

  // Compute overall stats
  const total = sessions.length;
  const present = sessions.filter((s: any) => s.status === "Present").length;
  const absent = sessions.filter((s: any) => s.status === "Absent").length;
  const late = sessions.filter((s: any) => s.status === "Late").length;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <Header title="My Attendance" subtitle="Your attendance record across all sections" />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "ATTENDANCE RATE", value: `${rate}%`, color: "#2eb67d" },
          { label: "PRESENT", value: present, color: "#2eb67d" },
          { label: "ABSENT", value: absent, color: "#e74c3c" },
          { label: "LATE", value: late, color: "#e8b931" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-[20px] border border-[#eef1f6] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#9ca8c2] mb-2">{stat.label}</p>
            <p className="text-[28px] font-extrabold" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="bg-white rounded-[20px] border border-[#eef1f6] p-6">
        <h2 className="text-[15px] font-extrabold text-[#1c2434] mb-5">Activity Calendar</h2>
        {isLoading ? (
          <div className="h-24 bg-[#f8fafb] rounded-[14px] animate-pulse" />
        ) : (
          <AttendanceHeatmap sessions={sessions} />
        )}
      </div>

      {/* Session list */}
      <div className="bg-white rounded-[20px] border border-[#eef1f6] p-6">
        <h2 className="text-[15px] font-extrabold text-[#1c2434] mb-5">Session History</h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 rounded-[14px] bg-[#f8fafb] animate-pulse" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-[13px] text-[#9ca8c2]">No sessions recorded yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session: any) => {
              const cfg = STATUS_CONFIG[session.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG["Not recorded"];
              const Icon = cfg.icon;
              return (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-[14px] bg-[#f8fafb]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: cfg.bg }}>
                      <Icon size={15} style={{ color: cfg.color }} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#1c2434]">{session.topic ?? "Session"}</p>
                      <p className="text-[11px] text-[#9ca8c2]">
                        {session.sessions?.section_id
                          ? session.sections?.name ?? ""
                          : ""} ·{" "}
                        {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(
                          new Date(session.sessions?.session_date ?? session.session_date)
                        )}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-[11px] font-bold px-2.5 py-1 rounded-[8px]"
                    style={{ backgroundColor: cfg.bg, color: cfg.color }}
                  >
                    {session.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
