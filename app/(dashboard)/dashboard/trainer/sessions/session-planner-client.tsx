"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Plus, Calendar, BookOpen } from "lucide-react";
import { Header } from "@/components/dashboard/header";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function SessionPlannerClient() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ sectionId: "", sessionDate: "", topic: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const { data: sessionsData, isLoading, mutate } = useSWR("/api/trainer/sessions", fetcher);
  const { data: sectionsData } = useSWR("/api/trainer/sections", fetcher);

  const sessions = sessionsData?.sessions ?? [];
  const sections = sectionsData?.sections ?? [];

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.sectionId || !form.sessionDate || !form.topic) {
      toast.error("Section, date, and topic are required");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/trainer/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("Session scheduled!");
      setForm({ sectionId: "", sessionDate: "", topic: "", notes: "" });
      setShowForm(false);
      mutate();
    } else {
      toast.error("Failed to schedule session");
    }
    setSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <Header title="Session Planner" subtitle="Schedule and manage your training sessions">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#2eb67d] text-white rounded-[12px] text-[13px] font-bold hover:bg-[#27a06e] transition-colors"
        >
          <Plus size={16} />
          New Session
        </button>
      </Header>

      {showForm && (
        <div className="bg-white rounded-[20px] border border-[#2eb67d]/30 p-6 shadow-sm">
          <h3 className="text-[14px] font-extrabold text-[#1c2434] mb-4">Schedule New Session</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2] mb-1.5">Section</label>
              <select
                value={form.sectionId}
                onChange={(e) => setForm({ ...form, sectionId: e.target.value })}
                className="w-full px-3 py-2.5 rounded-[12px] border border-[#eef1f6] bg-[#f8fafb] text-[13px] font-bold text-[#1c2434] focus:outline-none focus:border-[#2eb67d]"
                required
              >
                <option value="">Select section…</option>
                {sections.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2] mb-1.5">Date</label>
              <input
                type="date"
                value={form.sessionDate}
                onChange={(e) => setForm({ ...form, sessionDate: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2.5 rounded-[12px] border border-[#eef1f6] bg-[#f8fafb] text-[13px] font-bold text-[#1c2434] focus:outline-none focus:border-[#2eb67d]"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2] mb-1.5">Topic</label>
              <input
                type="text"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                placeholder="What will you cover?"
                className="w-full px-3 py-2.5 rounded-[12px] border border-[#eef1f6] bg-[#f8fafb] text-[13px] text-[#1c2434] placeholder:text-[#9ca8c2] focus:outline-none focus:border-[#2eb67d]"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2] mb-1.5">Notes (optional)</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Prep notes for students…"
                className="w-full px-3 py-2.5 rounded-[12px] border border-[#eef1f6] bg-[#f8fafb] text-[13px] text-[#1c2434] placeholder:text-[#9ca8c2] focus:outline-none focus:border-[#2eb67d]"
              />
            </div>
            <div className="lg:col-span-2 flex gap-3">
              <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-[#2eb67d] text-white rounded-[12px] text-[13px] font-bold hover:bg-[#27a06e] disabled:opacity-50">
                {submitting ? "Scheduling…" : "Schedule Session"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-[#eef1f6] text-[#7a849b] rounded-[12px] text-[13px] font-bold hover:bg-[#f6f8fb]">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Session list */}
      <div className="bg-white rounded-[20px] border border-[#eef1f6] overflow-hidden">
        <div className="p-5 border-b border-[#eef1f6]">
          <h3 className="text-[14px] font-extrabold text-[#1c2434]">All Sessions</h3>
        </div>
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-[#f8fafb] rounded-[12px] animate-pulse" />)}
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar size={22} className="text-[#2eb67d] mx-auto mb-3" />
            <p className="text-[13px] text-[#9ca8c2]">No sessions scheduled yet</p>
          </div>
        ) : (
          <div className="divide-y divide-[#f8fafb]">
            {sessions.map((session: any) => {
              const isPast = new Date(session.session_date) < new Date();
              return (
                <div key={session.id} className="flex items-center gap-4 p-4 hover:bg-[#f8fafb] transition-colors">
                  <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${isPast ? "bg-[#f0f3f8]" : "bg-[#edf7f3]"}`}>
                    <BookOpen size={16} className={isPast ? "text-[#9ca8c2]" : "text-[#2eb67d]"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#1c2434] truncate">{session.topic}</p>
                    <p className="text-[11px] text-[#9ca8c2]">{session.sections?.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[12px] font-bold text-[#7a849b]">
                      {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(session.session_date))}
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[8px] ${isPast ? "bg-[#f0f3f8] text-[#9ca8c2]" : "bg-[#edf7f3] text-[#2eb67d]"}`}>
                      {isPast ? "Past" : "Upcoming"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
