"use client";

import { useState } from "react";
import useSWR from "swr";
import { Users, TrendingUp, AlertTriangle, MessageCircle } from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Tab = "roster" | "grades" | "queries";

export function SectionDetailClient({ sectionId }: { sectionId: string }) {
  const [tab, setTab] = useState<Tab>("roster");

  const { data: rosterData, isLoading: rosterLoading } = useSWR(
    `/api/trainer/sections/${sectionId}/roster`,
    fetcher
  );
  const { data: queriesData, isLoading: queriesLoading, mutate: mutateQueries } = useSWR(
    tab === "queries" ? `/api/trainer/queries?sectionId=${sectionId}` : null,
    fetcher
  );

  const roster = rosterData?.roster ?? [];
  const queries = queriesData?.queries ?? [];
  const openQueries = queries.filter((q: any) => q.status === "open").length;

  async function handleAnswer(queryId: string, answer: string) {
    const res = await fetch("/api/trainer/queries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queryId, answer }),
    });
    if (res.ok) mutateQueries();
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "roster",  label: "Student Roster" },
    { id: "grades",  label: "Grades" },
    { id: "queries", label: "Queries", count: openQueries },
  ];

  return (
    <div className="space-y-6">
      <Header
        title="Section Details"
        subtitle={`${roster.length} students enrolled`}
        backHref="/dashboard/trainer/sections"
        backLabel="All Sections"
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#eef1f6] pb-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-[13px] font-bold border-b-2 -mb-px transition-colors ${
              tab === t.id
                ? "border-[#2eb67d] text-[#2eb67d]"
                : "border-transparent text-[#9ca8c2] hover:text-[#7a849b]"
            }`}
          >
            {t.label}
            {t.count ? (
              <span className="bg-[#e74c3c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {t.count}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* ROSTER TAB */}
      {tab === "roster" && (
        <div className="bg-white rounded-[20px] border border-[#eef1f6] overflow-hidden">
          {rosterLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 bg-[#f8fafb] rounded-[12px] animate-pulse" />)}
            </div>
          ) : roster.length === 0 ? (
            <div className="p-12 text-center">
              <Users size={22} className="text-[#2eb67d] mx-auto mb-3" />
              <p className="text-[13px] text-[#9ca8c2]">No students enrolled yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#eef1f6]">
                  <th className="text-left p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">Student</th>
                  <th className="text-center p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">Attendance</th>
                  <th className="text-center p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">Score</th>
                  <th className="text-center p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">Queries</th>
                  <th className="text-center p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">Status</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((student: any) => (
                  <tr key={student.id} className="border-b border-[#f8fafb] hover:bg-[#f8fafb] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2eb67d] to-[#1c9963] flex items-center justify-center text-white text-[11px] font-bold">
                          {student.email[0].toUpperCase()}
                        </div>
                        <span className="text-[13px] font-bold text-[#1c2434]">{student.email}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-[12px] font-bold ${
                        student.attendanceRate === null ? "text-[#9ca8c2]" :
                        student.attendanceRate >= 75 ? "text-[#2eb67d]" : "text-[#e74c3c]"
                      }`}>
                        {student.attendanceRate !== null ? `${student.attendanceRate}%` : "—"}
                      </span>
                      <p className="text-[10px] text-[#9ca8c2]">{student.sessionsAttended}/{student.totalSessions}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-[12px] font-bold ${
                        !student.grade ? "text-[#9ca8c2]" :
                        student.grade.score >= 70 ? "text-[#2eb67d]" :
                        student.grade.score >= 50 ? "text-[#e8b931]" : "text-[#e74c3c]"
                      }`}>
                        {student.grade ? `${Math.round(student.grade.score)}%` : "—"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {student.openQueries > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#e8b931] bg-[#fefce8] px-2 py-0.5 rounded-[8px]">
                          <MessageCircle size={11} /> {student.openQueries}
                        </span>
                      ) : (
                        <span className="text-[12px] text-[#9ca8c2]">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {student.atRisk ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#e74c3c] bg-[#fef2f2] px-2 py-0.5 rounded-[8px]">
                          <AlertTriangle size={11} /> At Risk
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-[#2eb67d] bg-[#edf7f3] px-2 py-0.5 rounded-[8px]">On Track</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* GRADES TAB */}
      {tab === "grades" && (
        <GradeEntryGrid sectionId={sectionId} roster={roster} />
      )}

      {/* QUERIES TAB */}
      {tab === "queries" && (
        <QueriesPanel
          queries={queries}
          loading={queriesLoading}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  );
}

// ── Grade Entry Grid ──────────────────────────────────────────────────────────
function GradeEntryGrid({ sectionId, roster }: { sectionId: string; roster: any[] }) {
  const [scores, setScores] = useState<Record<string, { score: string; remarks: string }>>(() => {
    const initial: Record<string, { score: string; remarks: string }> = {};
    for (const s of roster) {
      initial[s.id] = {
        score: s.grade?.score != null ? String(Math.round(s.grade.score)) : "",
        remarks: s.grade?.remarks ?? "",
      };
    }
    return initial;
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const grades = Object.entries(scores)
      .filter(([, v]) => v.score !== "")
      .map(([studentId, v]) => ({
        studentId,
        score: parseFloat(v.score),
        remarks: v.remarks || undefined,
      }));

    const res = await fetch("/api/trainer/grades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionId, grades }),
    });

    if (res.ok) {
      toast.success(`Saved grades for ${grades.length} students`);
    } else {
      toast.error("Failed to save grades");
    }
    setSaving(false);
  }

  if (roster.length === 0) {
    return (
      <div className="bg-white rounded-[20px] border border-[#eef1f6] p-12 text-center">
        <TrendingUp size={22} className="text-[#2eb67d] mx-auto mb-3" />
        <p className="text-[13px] text-[#9ca8c2]">No students enrolled yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] border border-[#eef1f6] overflow-hidden">
      <div className="p-5 border-b border-[#eef1f6] flex items-center justify-between">
        <h3 className="text-[14px] font-extrabold text-[#1c2434]">Grade Entry</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-[#2eb67d] text-white rounded-[12px] text-[13px] font-bold hover:bg-[#27a06e] disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving…" : "Save All Grades"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#eef1f6]">
              <th className="text-left p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">Student</th>
              <th className="p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2] w-32">Score (0–100)</th>
              <th className="text-left p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((student: any) => {
              const val = scores[student.id] ?? { score: "", remarks: "" };
              const score = parseFloat(val.score);
              const scoreColor = isNaN(score) ? "#9ca8c2" : score >= 70 ? "#2eb67d" : score >= 50 ? "#e8b931" : "#e74c3c";

              return (
                <tr key={student.id} className="border-b border-[#f8fafb]">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2eb67d] to-[#1c9963] flex items-center justify-center text-white text-[10px] font-bold">
                        {student.email[0].toUpperCase()}
                      </div>
                      <span className="text-[13px] font-bold text-[#1c2434]">{student.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={val.score}
                        onChange={(e) => setScores((prev) => ({ ...prev, [student.id]: { ...prev[student.id], score: e.target.value } }))}
                        className="w-full px-3 py-2 rounded-[10px] border border-[#eef1f6] bg-[#f8fafb] text-[13px] font-bold text-center focus:outline-none focus:border-[#2eb67d] transition-colors"
                        style={{ color: scoreColor }}
                        placeholder="—"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={val.remarks}
                      onChange={(e) => setScores((prev) => ({ ...prev, [student.id]: { ...prev[student.id], remarks: e.target.value } }))}
                      className="w-full px-3 py-2 rounded-[10px] border border-[#eef1f6] bg-[#f8fafb] text-[13px] text-[#7a849b] focus:outline-none focus:border-[#2eb67d] transition-colors"
                      placeholder="Optional remark…"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Queries Panel ─────────────────────────────────────────────────────────────
function QueriesPanel({
  queries, loading, onAnswer
}: {
  queries: any[]; loading: boolean; onAnswer: (id: string, answer: string) => void;
}) {
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");

  return (
    <div className="space-y-3">
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-white rounded-[20px] border border-[#eef1f6] animate-pulse" />)}
        </div>
      ) : queries.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-[#eef1f6] p-12 text-center">
          <MessageCircle size={22} className="text-[#2eb67d] mx-auto mb-3" />
          <p className="text-[13px] text-[#9ca8c2]">No queries for this section</p>
        </div>
      ) : (
        queries.map((q: any) => (
          <div key={q.id} className={`bg-white rounded-[20px] border p-5 ${q.status === "open" ? "border-[#e8b931]/40" : "border-[#eef1f6]"}`}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-[13px] text-[#9ca8c2] mb-1">{q.users?.email ?? "Student"}</p>
                <p className="text-[14px] font-bold text-[#1c2434]">{q.question}</p>
              </div>
              <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-[8px] ${
                q.status === "open" ? "bg-[#fefce8] text-[#e8b931]" : "bg-[#edf7f3] text-[#2eb67d]"
              }`}>
                {q.status === "open" ? "Open" : "Answered"}
              </span>
            </div>

            {q.answer && (
              <div className="pl-3 border-l-2 border-[#2eb67d] mb-3">
                <p className="text-[12px] text-[#7a849b]">{q.answer}</p>
              </div>
            )}

            {q.status === "open" && (
              answeringId === q.id ? (
                <div className="space-y-2">
                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-[12px] border border-[#eef1f6] bg-[#f8fafb] text-[13px] text-[#1c2434] resize-none focus:outline-none focus:border-[#2eb67d]"
                    placeholder="Type your answer…"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => { onAnswer(q.id, answerText); setAnsweringId(null); setAnswerText(""); }}
                      disabled={!answerText.trim()}
                      className="px-4 py-1.5 bg-[#2eb67d] text-white rounded-[10px] text-[12px] font-bold hover:bg-[#27a06e] disabled:opacity-50"
                    >
                      Submit Answer
                    </button>
                    <button onClick={() => { setAnsweringId(null); setAnswerText(""); }} className="px-4 py-1.5 border border-[#eef1f6] text-[#7a849b] rounded-[10px] text-[12px] font-bold hover:bg-[#f6f8fb]">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAnsweringId(q.id)}
                  className="text-[12px] font-bold text-[#2eb67d] hover:underline"
                >
                  Answer this query →
                </button>
              )
            )}
          </div>
        ))
      )}
    </div>
  );
}
