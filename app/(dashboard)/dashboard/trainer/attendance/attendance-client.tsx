"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, Save } from "lucide-react";
import { Header } from "@/components/dashboard/header";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type AttendanceStatus = "Present" | "Absent" | "Late";

const STATUS_BUTTONS: { value: AttendanceStatus; label: string; color: string; bg: string; icon: any }[] = [
  { value: "Present", label: "Present", color: "#2eb67d", bg: "#edf7f3", icon: CheckCircle },
  { value: "Late",    label: "Late",    color: "#e8b931", bg: "#fefce8", icon: Clock },
  { value: "Absent",  label: "Absent",  color: "#e74c3c", bg: "#fef2f2", icon: XCircle },
];

export function AttendanceClient({ sessions }: { sessions: any[] }) {
  const [selectedSession, setSelectedSession] = useState(sessions[0]?.id ?? "");
  const [statusMap, setStatusMap] = useState<Record<string, AttendanceStatus>>({});
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useSWR(
    selectedSession ? `/api/trainer/attendance?sessionId=${selectedSession}` : null,
    fetcher,
    {
      onSuccess: (data) => {
        const initial: Record<string, AttendanceStatus> = {};
        for (const s of data.students ?? []) {
          if (s.status) initial[s.id] = s.status;
        }
        setStatusMap(initial);
      },
    }
  );

  const students = data?.students ?? [];
  const present = Object.values(statusMap).filter((s) => s === "Present").length;
  const absent = Object.values(statusMap).filter((s) => s === "Absent").length;
  const late = Object.values(statusMap).filter((s) => s === "Late").length;

  function markAll(status: AttendanceStatus) {
    const all: Record<string, AttendanceStatus> = {};
    for (const s of students) all[s.id] = status;
    setStatusMap(all);
  }

  async function handleSave() {
    if (!selectedSession) return;
    setSaving(true);

    const records = Object.entries(statusMap).map(([studentId, status]) => ({ studentId, status }));

    const res = await fetch("/api/trainer/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: selectedSession, records }),
    });

    if (res.ok) {
      toast.success(`Attendance saved for ${records.length} students`);
    } else {
      toast.error("Failed to save attendance");
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <Header title="Mark Attendance" subtitle="Record attendance for your sessions" />

      {sessions.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-[#eef1f6] p-16 text-center">
          <CheckCircle size={22} className="text-[#2eb67d] mx-auto mb-3" />
          <p className="text-[14px] font-extrabold text-[#1c2434] mb-2">No upcoming sessions</p>
          <p className="text-[13px] text-[#9ca8c2]">Schedule a session first to mark attendance</p>
        </div>
      ) : (
        <>
          {/* Session selector */}
          <div className="flex gap-2 flex-wrap">
            {sessions.map((s: any) => (
              <button
                key={s.id}
                onClick={() => setSelectedSession(s.id)}
                className={`px-4 py-2 rounded-[12px] text-[13px] font-bold transition-colors ${
                  selectedSession === s.id
                    ? "bg-[#1c2434] text-white"
                    : "bg-white border border-[#eef1f6] text-[#7a849b] hover:bg-[#f6f8fb]"
                }`}
              >
                {s.sections?.name} — {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(s.session_date))}
              </button>
            ))}
          </div>

          {/* Summary row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "PRESENT", value: present, color: "#2eb67d", bg: "#edf7f3" },
              { label: "LATE",    value: late,    color: "#e8b931", bg: "#fefce8" },
              { label: "ABSENT",  value: absent,  color: "#e74c3c", bg: "#fef2f2" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-[20px] border border-[#eef1f6] p-5 text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#9ca8c2] mb-1">{s.label}</p>
                <p className="text-[28px] font-extrabold" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Student list */}
          <div className="bg-white rounded-[20px] border border-[#eef1f6] overflow-hidden">
            <div className="p-5 border-b border-[#eef1f6] flex items-center justify-between">
              <h3 className="text-[14px] font-extrabold text-[#1c2434]">
                {isLoading ? "Loading…" : `${students.length} Students`}
              </h3>
              <div className="flex items-center gap-2">
                <button onClick={() => markAll("Present")} className="text-[12px] font-bold text-[#2eb67d] hover:underline px-2">All Present</button>
                <span className="text-[#eef1f6]">|</span>
                <button onClick={() => markAll("Absent")} className="text-[12px] font-bold text-[#e74c3c] hover:underline px-2">All Absent</button>
                <button
                  onClick={handleSave}
                  disabled={saving || Object.keys(statusMap).length === 0}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#2eb67d] text-white rounded-[12px] text-[12px] font-bold hover:bg-[#27a06e] disabled:opacity-50 transition-colors ml-2"
                >
                  <Save size={13} />
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-14 bg-[#f8fafb] rounded-[12px] animate-pulse" />)}
              </div>
            ) : (
              <div className="divide-y divide-[#f8fafb]">
                {students.map((student: any) => {
                  const current = statusMap[student.id] ?? null;
                  return (
                    <div key={student.id} className="flex items-center justify-between p-4 hover:bg-[#f8fafb] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2eb67d] to-[#1c9963] flex items-center justify-center text-white text-[11px] font-bold">
                          {student.email[0].toUpperCase()}
                        </div>
                        <span className="text-[13px] font-bold text-[#1c2434]">{student.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {STATUS_BUTTONS.map(({ value, label, color, bg, icon: Icon }) => (
                          <button
                            key={value}
                            onClick={() => setStatusMap((prev) => ({ ...prev, [student.id]: value }))}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-[12px] font-bold transition-all border ${
                              current === value
                                ? "border-transparent shadow-sm"
                                : "border-[#eef1f6] bg-transparent hover:bg-[#f8fafb]"
                            }`}
                            style={current === value ? { backgroundColor: bg, color } : { color: "#9ca8c2" }}
                          >
                            <Icon size={13} />
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
