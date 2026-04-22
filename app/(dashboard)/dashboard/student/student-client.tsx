"use client";

import { motion } from "framer-motion";
import useSWR from "swr";
import { BookOpen, Calendar, TrendingUp, Award, Zap, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { useEffect } from "react";
import { updateStreak } from "@/app/actions/streak";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// Animation variants
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function StudentClient() {
  const { data, isLoading } = useSWR("/api/student/dashboard", fetcher);

  useEffect(() => {
    updateStreak().catch(console.error);
  }, []);

  const upcomingSessions = data?.upcomingSessions ?? [];
  const grades = data?.grades ?? [];
  const streak = data?.streak ?? { current_streak: 0, total_xp: 0 };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* ── Welcome Banner ─────────────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-[20px] bg-[#1c2434] p-8"
      >
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 right-24 w-56 h-56 rounded-full bg-white/[0.03]" />
        <div className="absolute top-6 right-16 w-20 h-20 rounded-full bg-[#2eb67d]/20" />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <span className="inline-block px-3 py-1 rounded-[10px] bg-[#2eb67d]/20 text-[#2eb67d] text-[11px] font-bold uppercase tracking-[0.15em] mb-3">
              TRAINEE PORTAL
            </span>
            <h1 className="text-[22px] font-extrabold text-white tracking-tight mb-1">
              Your Training Dashboard
            </h1>
            <p className="text-[13px] text-white/50">
              {upcomingSessions.length > 0
                ? `${upcomingSessions.length} session${upcomingSessions.length > 1 ? "s" : ""} coming up`
                : "No upcoming sessions scheduled"}
            </p>
          </div>
          {streak.current_streak > 0 && (
            <div className="flex items-center gap-2 bg-[#2eb67d]/20 rounded-[12px] px-4 py-2">
              <Zap size={16} className="text-[#2eb67d]" />
              <span className="text-white font-bold text-[13px]">{streak.current_streak} day streak</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="UPCOMING SESSIONS"
          value={isLoading ? "—" : upcomingSessions.length}
          sparkData={[2, 3, 2, 4, 3, upcomingSessions.length]}
          accentColor="#2eb67d"
        />
        <StatCard
          label="ATTENDANCE RATE"
          value={isLoading ? "—" : `${data?.attendanceRate ?? 0}%`}
          trend="up"
          change="+2%"
          sparkData={[88, 90, 91, 94, 93, data?.attendanceRate ?? 0]}
          accentColor="#1c2434"
        />
        <StatCard
          label="AVG SCORE"
          value={isLoading ? "—" : data?.avgGrade ? `${data.avgGrade}%` : "N/A"}
          sparkData={[80, 82, 85, 84, 87, data?.avgGrade ?? 0]}
          accentColor="#e8b931"
        />
        <StatCard
          label="TOTAL XP"
          value={isLoading ? "—" : streak.total_xp}
          sparkData={[10, 30, 50, 70, 90, streak.total_xp]}
          accentColor="#2eb67d"
        />
      </motion.div>

      {/* ── Two column layout ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <motion.div variants={itemVariants} className="bg-white rounded-[20px] border border-[#eef1f6] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[15px] font-extrabold text-[#1c2434]">Upcoming Sessions</h2>
            <a href="/dashboard/student/attendance" className="text-[12px] text-[#2eb67d] font-bold hover:underline">
              View all
            </a>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 rounded-[14px] bg-[#f8fafb] animate-pulse" />
              ))}
            </div>
          ) : upcomingSessions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-[#edf7f3] flex items-center justify-center mx-auto mb-3">
                <Calendar size={20} className="text-[#2eb67d]" />
              </div>
              <p className="text-[13px] font-bold text-[#1c2434] mb-1">No upcoming sessions</p>
              <p className="text-[12px] text-[#9ca8c2]">Your trainer hasn&apos;t scheduled any yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.slice(0, 5).map((session: any) => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-[14px] bg-[#f8fafb] hover:bg-[#f0f3f8] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[10px] bg-[#edf7f3] flex items-center justify-center">
                      <BookOpen size={16} className="text-[#2eb67d]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#1c2434]">{session.topic}</p>
                      <p className="text-[11px] text-[#9ca8c2]">{session.sections?.name}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#2eb67d] bg-[#edf7f3] px-2 py-1 rounded-[8px]">
                    {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(session.session_date))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Grades Summary */}
        <motion.div variants={itemVariants} className="bg-white rounded-[20px] border border-[#eef1f6] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[15px] font-extrabold text-[#1c2434]">Grades by Section</h2>
            <a href="/dashboard/student/grades" className="text-[12px] text-[#2eb67d] font-bold hover:underline">
              Full report
            </a>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-[14px] bg-[#f8fafb] animate-pulse" />
              ))}
            </div>
          ) : grades.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-[#edf7f3] flex items-center justify-center mx-auto mb-3">
                <TrendingUp size={20} className="text-[#2eb67d]" />
              </div>
              <p className="text-[13px] font-bold text-[#1c2434] mb-1">No grades yet</p>
              <p className="text-[12px] text-[#9ca8c2]">Grades will appear once your trainer enters them</p>
            </div>
          ) : (
            <div className="space-y-3">
              {grades.map((grade: any, i: number) => {
                const pct = Math.round(grade.score ?? 0);
                const color = pct >= 80 ? "#2eb67d" : pct >= 60 ? "#e8b931" : "#e74c3c";
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-bold text-[#1c2434]">{grade.sections?.name}</span>
                      <span className="text-[12px] font-bold" style={{ color }}>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-[#eef1f6] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
