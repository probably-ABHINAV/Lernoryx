"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { MessageCircle, CheckCircle, Clock, Send } from "lucide-react";
import { Header } from "@/components/dashboard/header";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function QueriesClient({ sections }: { sections: { id: string; name: string }[] }) {
  const [selectedSection, setSelectedSection] = useState(sections[0]?.id ?? "");
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading, mutate } = useSWR(
    selectedSection ? `/api/student/queries?sectionId=${selectedSection}` : null,
    fetcher
  );

  const queries = data?.queries ?? [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || question.length < 10) {
      toast.error("Question must be at least 10 characters");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/student/queries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionId: selectedSection, question }),
    });
    if (res.ok) {
      toast.success("Question submitted!");
      setQuestion("");
      mutate();
    } else {
      const err = await res.json();
      toast.error(err.error ?? "Failed to submit");
    }
    setSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <Header title="My Queries" subtitle="Ask questions, get answers from your trainers" />

      {/* Section selector */}
      {sections.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSection(s.id)}
              className={`px-4 py-2 rounded-[12px] text-[13px] font-bold transition-colors ${
                selectedSection === s.id
                  ? "bg-[#1c2434] text-white"
                  : "bg-white border border-[#eef1f6] text-[#7a849b] hover:bg-[#f6f8fb]"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {/* Ask form */}
      <div className="bg-white rounded-[20px] border border-[#eef1f6] p-6">
        <h2 className="text-[15px] font-extrabold text-[#1c2434] mb-4">Ask a Question</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here — be as specific as possible..."
            rows={3}
            className="w-full px-4 py-3 rounded-[12px] border border-[#eef1f6] bg-[#f8fafb] text-[13px] text-[#1c2434] placeholder:text-[#9ca8c2] resize-none focus:outline-none focus:border-[#2eb67d] transition-colors"
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#9ca8c2]">{question.length}/1000 characters</span>
            <button
              type="submit"
              disabled={submitting || !selectedSection || question.length < 10}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#2eb67d] text-white rounded-[12px] text-[13px] font-bold hover:bg-[#27a06e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={14} />
              {submitting ? "Submitting…" : "Submit Question"}
            </button>
          </div>
        </form>
      </div>

      {/* Query list */}
      <div className="bg-white rounded-[20px] border border-[#eef1f6] p-6">
        <h2 className="text-[15px] font-extrabold text-[#1c2434] mb-5">
          My Questions ({queries.length})
        </h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-[#f8fafb] rounded-[14px] animate-pulse" />)}
          </div>
        ) : queries.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-full bg-[#edf7f3] flex items-center justify-center mx-auto mb-3">
              <MessageCircle size={20} className="text-[#2eb67d]" />
            </div>
            <p className="text-[13px] font-bold text-[#1c2434] mb-1">No questions yet</p>
            <p className="text-[12px] text-[#9ca8c2]">Ask your first question above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {queries.map((q: any) => (
              <div key={q.id} className={`rounded-[14px] p-4 border ${q.status === "answered" ? "border-[#edf7f3] bg-[#f8fdfb]" : "border-[#eef1f6] bg-[#f8fafb]"}`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-[13px] font-bold text-[#1c2434]">{q.question}</p>
                  <span className={`shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-[8px] ${
                    q.status === "answered"
                      ? "bg-[#edf7f3] text-[#2eb67d]"
                      : "bg-[#fefce8] text-[#e8b931]"
                  }`}>
                    {q.status === "answered" ? <CheckCircle size={10} /> : <Clock size={10} />}
                    {q.status === "answered" ? "Answered" : "Pending"}
                  </span>
                </div>
                {q.answer && (
                  <div className="mt-2 pl-3 border-l-2 border-[#2eb67d]">
                    <p className="text-[11px] font-bold text-[#2eb67d] mb-1">Trainer&apos;s Response</p>
                    <p className="text-[12px] text-[#7a849b]">{q.answer}</p>
                  </div>
                )}
                <p className="text-[11px] text-[#9ca8c2] mt-2">
                  Asked {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(q.created_at))}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
