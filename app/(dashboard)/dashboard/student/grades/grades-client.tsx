"use client";

import { motion } from "framer-motion";
import { Award, TrendingUp, TrendingDown } from "lucide-react";
import { Header } from "@/components/dashboard/header";

interface Grade { id: string; score: number; remarks?: string; sections: { name: string; description?: string }[] }

export function GradesClient({ grades }: { grades: Grade[] }) {
  const avg = grades.length > 0
    ? Math.round(grades.reduce((s, g) => s + (g.score ?? 0), 0) / grades.length)
    : null;

  const best = grades.reduce((best, g) => ((g.score ?? 0) > (best?.score ?? -1) ? g : best), grades[0] ?? null);
  const worst = grades.reduce((worst, g) => ((g.score ?? 0) < (worst?.score ?? 101) ? g : worst), grades[0] ?? null);

  const getGrade = (score: number) => {
    if (score >= 90) return { label: "A+", color: "#2eb67d", bg: "#edf7f3" };
    if (score >= 80) return { label: "A",  color: "#2eb67d", bg: "#edf7f3" };
    if (score >= 70) return { label: "B",  color: "#185fa5", bg: "#e6f1fb" };
    if (score >= 60) return { label: "C",  color: "#e8b931", bg: "#fefce8" };
    return                  { label: "D",  color: "#e74c3c", bg: "#fef2f2" };
  };

  return (
    <div className="space-y-6">
      <Header title="My Grades" subtitle="Performance across all training sections" />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-[20px] border border-[#eef1f6] p-5 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#9ca8c2] mb-2">AVERAGE SCORE</p>
          <p className="text-[32px] font-extrabold text-[#1c2434]">{avg ?? "—"}{avg ? "%" : ""}</p>
        </div>
        <div className="bg-white rounded-[20px] border border-[#eef1f6] p-5 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#9ca8c2] mb-2">BEST SECTION</p>
          <p className="text-[13px] font-extrabold text-[#2eb67d] mt-2">{best?.sections?.[0]?.name ?? "—"}</p>
          {best && <p className="text-[20px] font-extrabold text-[#2eb67d]">{Math.round(best.score)}%</p>}
        </div>
        <div className="bg-white rounded-[20px] border border-[#eef1f6] p-5 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#9ca8c2] mb-2">NEEDS WORK</p>
          <p className="text-[13px] font-extrabold text-[#e74c3c] mt-2">{worst?.sections?.[0]?.name ?? "—"}</p>
          {worst && <p className="text-[20px] font-extrabold text-[#e74c3c]">{Math.round(worst.score)}%</p>}
        </div>
      </div>

      {/* Grade cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {grades.length === 0 ? (
          <div className="lg:col-span-2 bg-white rounded-[20px] border border-[#eef1f6] p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-[#edf7f3] flex items-center justify-center mx-auto mb-4">
              <Award size={24} className="text-[#2eb67d]" />
            </div>
            <p className="text-[15px] font-extrabold text-[#1c2434] mb-2">No grades yet</p>
            <p className="text-[13px] text-[#9ca8c2]">Your trainer will enter grades after assessments</p>
          </div>
        ) : (
          grades.map((grade, i) => {
            const { label, color, bg } = getGrade(grade.score ?? 0);
            const pct = Math.round(grade.score ?? 0);
            return (
              <motion.div
                key={grade.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[20px] border border-[#eef1f6] p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[15px] font-extrabold text-[#1c2434]">{grade.sections?.[0]?.name}</p>
                    {grade.sections?.[0]?.description && (
                      <p className="text-[12px] text-[#9ca8c2] mt-0.5">{grade.sections[0].description}</p>
                    )}
                  </div>
                  <div
                    className="w-10 h-10 rounded-[12px] flex items-center justify-center text-[15px] font-extrabold"
                    style={{ backgroundColor: bg, color }}
                  >
                    {label}
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-2 bg-[#eef1f6] rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#9ca8c2]">{grade.remarks ?? "No remarks"}</span>
                  <span className="text-[20px] font-extrabold" style={{ color }}>{pct}%</span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
