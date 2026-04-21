"use client";

import { useDashboard } from "@/hooks/useDashboard";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, CalendarCheck, BookOpen, MoreHorizontal, Clock, User } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

export function TrainerClient() {
  const { data, loading } = useDashboard();

  const sessions = data?.sessions || [];
  const attendance = data?.attendance || [];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-[#1c2434] rounded-[20px] p-7 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[13px] font-semibold text-[#9ca8c2]">Hello, Trainer! 📚</p>
          <h2 className="text-[20px] font-extrabold text-white mt-1 tracking-tight">Manage Your Training Sessions</h2>
          <p className="text-[13px] text-[#7a849b] mt-1.5">Track trainee attendance and monitor training progress.</p>
        </div>
        <div className="absolute right-8 top-4 w-20 h-20 rounded-full border-[5px] border-[#2eb67d] opacity-10" />
        <div className="absolute right-20 bottom-2 w-12 h-12 rounded-[14px] border-[4px] border-[#e8b931] opacity-10 rotate-12" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard title="Today's Sessions" value={sessions.length} sparkData={[2, 3, 1, 4, 2, 3]} accentColor="#2eb67d" />
        <StatCard title="Trainee Attendance" value={attendance.length} sparkData={[5, 8, 6, 12, 9, 15]} accentColor="#1c2434" />
        <StatCard title="Training Completion" value="94%" trend="up" change="+3%" sparkData={[80, 85, 88, 90, 92, 94]} accentColor="#e8b931" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sessions */}
        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
          <div className="px-7 pt-7 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-extrabold text-[#1c2434]">Today&apos;s Training Sessions</h2>
              <p className="text-[12px] text-[#9ca8c2] font-medium mt-1">Scheduled training for today</p>
            </div>
            <button className="w-8 h-8 rounded-[10px] bg-[#f6f8fb] flex items-center justify-center text-[#9ca8c2] hover:text-[#1c2434] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          {loading ? (
            <div className="px-7 pb-7 space-y-3">
              <Skeleton className="h-14 w-full rounded-[14px]" />
              <Skeleton className="h-14 w-full rounded-[14px]" />
            </div>
          ) : !sessions.length ? (
            <div className="px-7 py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[#edf7f3] flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="w-7 h-7 text-[#2eb67d]" />
              </div>
              <p className="text-[15px] font-extrabold text-[#1c2434]">No sessions today</p>
              <p className="text-[13px] text-[#9ca8c2] mt-1.5 font-medium">Your scheduled sessions will appear here.</p>
            </div>
          ) : (
            <div className="px-7 pb-5 space-y-3">
              {sessions.map((s: any) => (
                <div key={s.id} className="flex items-center gap-4 p-4 rounded-[14px] bg-[#f8fafb] hover:bg-[#f0f3f8] transition-colors">
                  <div className="w-10 h-10 rounded-[10px] bg-[#edf7f3] flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-[#2eb67d]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-[#1c2434]">{s.topic}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#9ca8c2] font-medium">
                      <Clock className="w-3 h-3" /> {s.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
          <div className="px-7 pt-7 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-extrabold text-[#1c2434]">Trainee Attendance</h2>
              <p className="text-[12px] text-[#9ca8c2] font-medium mt-1">Latest trainee attendance records</p>
            </div>
            <button className="w-8 h-8 rounded-[10px] bg-[#f6f8fb] flex items-center justify-center text-[#9ca8c2] hover:text-[#1c2434] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          {loading ? (
            <div className="px-7 pb-7 space-y-3">
              <Skeleton className="h-14 w-full rounded-[14px]" />
              <Skeleton className="h-14 w-full rounded-[14px]" />
            </div>
          ) : !attendance.length ? (
            <div className="px-7 py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[#edf7f3] flex items-center justify-center mx-auto mb-4">
                <CalendarCheck className="w-7 h-7 text-[#2eb67d]" />
              </div>
              <p className="text-[15px] font-extrabold text-[#1c2434]">No attendance data</p>
              <p className="text-[13px] text-[#9ca8c2] mt-1.5 font-medium">Records will appear as you mark attendance.</p>
            </div>
          ) : (
            <div className="px-7 pb-5 space-y-3">
              {attendance.slice(0, 5).map((r: any) => (
                <div key={r.id} className="flex items-center gap-4 p-4 rounded-[14px] bg-[#f8fafb] hover:bg-[#f0f3f8] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#1c2434] flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-[#1c2434]">{r.student_name}</p>
                  </div>
                  <span className={`text-[11px] font-bold px-3 py-1.5 rounded-[8px] ${
                    r.status === "present" ? "bg-[#edf7f3] text-[#2eb67d]" : "bg-[#fef0f0] text-[#e74c3c]"
                  }`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
