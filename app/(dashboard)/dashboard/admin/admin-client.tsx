"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { useDashboard } from "@/hooks/useDashboard";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Layers, Users, UserCheck, BarChart3, ArrowUpRight, MoreHorizontal, BookOpen, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

const RolesChart = dynamic(
  () => import("@/components/dashboard/charts/roles-chart").then((mod) => mod.RolesChart),
  { ssr: false, loading: () => <Skeleton className="h-[260px] w-full rounded-[20px]" /> }
);

const AttendanceChart = dynamic(
  () => import("@/components/dashboard/charts/attendance-chart").then((mod) => mod.AttendanceChart),
  { ssr: false, loading: () => <Skeleton className="h-[280px] w-full rounded-[20px]" /> }
);

const trainingProgress = [
  { name: "Leadership & Management", progress: 85, color: "#2eb67d", trainees: 32 },
  { name: "Safety & Compliance", progress: 62, color: "#e8b931", trainees: 18 },
  { name: "Technical Onboarding", progress: 94, color: "#1c2434", trainees: 24 },
  { name: "Soft Skills Workshop", progress: 41, color: "#e74c3c", trainees: 15 },
];

export function AdminClient() {
  const { data, loading } = useDashboard();

  const sections = data?.sections || [];
  const users = data?.users || [];

  const activeTrainers = users.filter((u: any) => u.role === "trainer").length;
  const totalStudents = users.filter((u: any) => u.role === "student").length;

  const roleData = [
    { name: "Admins", value: users.filter((u: any) => u.role === "admin").length || 1 },
    { name: "Trainers", value: activeTrainers || 4 },
    { name: "Trainees", value: totalStudents || 45 },
  ].filter((d: any) => d.value > 0);

  const mockAttendance = [
    { date: "Mon", attendance: 78 },
    { date: "Tue", attendance: 86 },
    { date: "Wed", attendance: 82 },
    { date: "Thu", attendance: 94 },
    { date: "Fri", attendance: 88 },
    { date: "Sat", attendance: 72 },
    { date: "Sun", attendance: 65 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#1c2434] rounded-[20px] p-7 flex items-center justify-between overflow-hidden relative">
        <div className="relative z-10">
          <p className="text-[13px] font-semibold text-[#9ca8c2]">Welcome back! 👋</p>
          <h2 className="text-[22px] font-extrabold text-white mt-1 tracking-tight">Training Management Dashboard</h2>
          <p className="text-[13px] text-[#7a849b] mt-2 max-w-md">
            Track training programs, manage batches, monitor trainer performance, and review trainee attendance in one place.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <Link
              href="/dashboard/admin/sections"
              className="px-5 py-2.5 rounded-[12px] bg-[#2eb67d] text-white text-[12px] font-bold hover:bg-[#27a06e] transition-colors shadow-lg shadow-[#2eb67d]/20"
            >
              View Sections
            </Link>
            <Link
              href="/dashboard/admin/users"
              className="px-5 py-2.5 rounded-[12px] bg-white/10 text-white text-[12px] font-bold hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              Manage Users
            </Link>
          </div>
        </div>
        {/* Decorative shapes */}
        <div className="absolute right-0 top-0 w-[280px] h-full opacity-10">
          <div className="absolute right-6 top-6 w-28 h-28 rounded-full border-[6px] border-[#2eb67d]" />
          <div className="absolute right-24 bottom-4 w-16 h-16 rounded-full border-[4px] border-[#e8b931]" />
          <div className="absolute right-2 bottom-8 w-20 h-20 rounded-[20px] border-[5px] border-white rotate-12" />
        </div>
      </div>

      {/* KPIs with sparklines */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[140px] rounded-[20px]" />
          ))
        ) : (
          <>
            <StatCard
              title="Training Batches"
              value={sections.length || 12}
              trend="up" change="+2.5%"
              sparkData={[4, 6, 5, 9, 7, 12, 10, 15, 12]}
              accentColor="#2eb67d"
            />
            <StatCard
              title="Total Trainees"
              value={totalStudents || 89}
              trend="up" change="+12"
              sparkData={[20, 35, 28, 45, 50, 62, 55, 78, 89]}
              accentColor="#1c2434"
            />
            <StatCard
              title="Active Trainers"
              value={activeTrainers || 8}
              trend="up" change="+1"
              sparkData={[3, 4, 4, 5, 6, 5, 7, 7, 8]}
              accentColor="#e8b931"
            />
            <StatCard
              title="Avg. Attendance"
              value="88%"
              trend="up" change="+4.2%"
              subtitle="This Week"
              subtitleValue="94%"
              sparkData={[65, 72, 78, 82, 86, 88, 94, 88]}
              accentColor="#2eb67d"
            />
          </>
        )}
      </div>

      {/* Charts + Course Progress */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Area Chart — 2/3 */}
        <div className="xl:col-span-2 bg-white rounded-[20px] shadow-sm overflow-hidden">
          <div className="px-7 pt-7 pb-2 flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-extrabold text-[#1c2434]">Training Attendance</h2>
              <p className="text-[12px] text-[#9ca8c2] font-medium mt-1">Weekly attendance across all training batches</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2eb67d]" />
              <span className="text-[11px] font-semibold text-[#9ca8c2]">Attendance %</span>
            </div>
          </div>
          <div className="px-4 pb-4">
            <AttendanceChart data={mockAttendance} />
          </div>
        </div>

        {/* Course Progress — 1/3 */}
        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
          <div className="px-7 pt-7 pb-4 flex items-center justify-between">
            <h2 className="text-[16px] font-extrabold text-[#1c2434]">Training Progress</h2>
            <button className="w-8 h-8 rounded-[10px] bg-[#f6f8fb] flex items-center justify-center text-[#9ca8c2] hover:text-[#1c2434] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="px-7 pb-7 space-y-5">
            {trainingProgress.map((program) => (
              <div key={program.name}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-[13px] font-bold text-[#1c2434]">{program.name}</p>
                    <p className="text-[11px] text-[#9ca8c2] font-medium mt-0.5">{program.trainees} trainees</p>
                  </div>
                  <span className="text-[12px] font-extrabold text-[#1c2434]">{program.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#f0f3f8] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${program.progress}%`, backgroundColor: program.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row — Donut + Table */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* Donut */}
        <div className="xl:col-span-2 bg-white rounded-[20px] shadow-sm overflow-hidden">
          <div className="px-7 pt-7 pb-2 flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-extrabold text-[#1c2434]">Team Distribution</h2>
              <p className="text-[12px] text-[#9ca8c2] font-medium mt-1">Users by role</p>
            </div>
            <button className="w-8 h-8 rounded-[10px] bg-[#f6f8fb] flex items-center justify-center text-[#9ca8c2] hover:text-[#1c2434] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="px-6 pb-6">
            {loading ? <Skeleton className="h-[260px] w-full rounded-[20px]" /> : <RolesChart data={roleData} />}
          </div>
        </div>

        {/* Table */}
        <div className="xl:col-span-3 bg-white rounded-[20px] shadow-sm overflow-hidden">
          <div className="px-7 pt-7 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-extrabold text-[#1c2434]">Recent Batches</h2>
              <p className="text-[12px] text-[#9ca8c2] font-medium mt-1">Latest training batches</p>
            </div>
            <Link href="/dashboard/admin/sections" className="flex items-center gap-1.5 text-[12px] font-bold text-[#2eb67d] hover:text-[#27a06e] transition-colors px-4 py-2 rounded-[10px] bg-[#edf7f3] hover:bg-[#e0f2ec]">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="px-7 pb-7 space-y-3">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ) : !sections.length ? (
            <div className="px-7 py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[#edf7f3] flex items-center justify-center mx-auto mb-4">
                <Layers className="w-7 h-7 text-[#2eb67d]" />
              </div>
              <p className="text-[15px] font-extrabold text-[#1c2434]">No batches yet</p>
              <p className="text-[13px] text-[#9ca8c2] mt-1.5 max-w-[260px] mx-auto font-medium">Create your first training batch to start organizing programs.</p>
              <Link
                href="/dashboard/admin/sections"
                className="inline-flex items-center gap-1.5 mt-5 px-5 py-2.5 rounded-[12px] bg-[#2eb67d] text-white text-[12px] font-bold hover:bg-[#27a06e] transition-colors shadow-lg shadow-[#2eb67d]/20"
              >
                <Layers className="w-3.5 h-3.5" /> Create Batch
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-[#f0f3f8]">
                  <TableHead className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9ca8c2] py-3.5 px-7">Name</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9ca8c2] py-3.5">Description</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9ca8c2] py-3.5">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sections.slice(0, 5).map((section: any) => (
                  <TableRow key={section.id} className="hover:bg-[#f8fafb] border-b border-[#f0f3f8]">
                    <TableCell className="px-7 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-[10px] bg-[#edf7f3] flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-[#2eb67d]" />
                        </div>
                        <span className="text-[13px] font-bold text-[#1c2434]">{section.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[13px] text-[#9ca8c2] font-medium py-4">{section.description || "—"}</TableCell>
                    <TableCell className="py-4">
                      <span className="text-[11px] font-bold px-3 py-1.5 rounded-[8px] bg-[#edf7f3] text-[#2eb67d]">Active</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
