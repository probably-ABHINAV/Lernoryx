"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { useDashboard } from "@/hooks/useDashboard";
import dynamic from "next/dynamic";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Lazy load heavy chart payloads for performance optimizations
const RolesChart = dynamic(() => import("@/components/dashboard/charts/roles-chart").then(mod => mod.RolesChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[250px] w-full rounded-lg" />
});

const AttendanceChart = dynamic(() => import("@/components/dashboard/charts/attendance-chart").then(mod => mod.AttendanceChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[250px] w-full rounded-lg" />
});

export function AdminClient() {
  const { data, loading } = useDashboard();
  
  const sections = data?.sections || [];
  const users = data?.users || [];

  const activeTrainers = users.filter((u: any) => u.role === "trainer").length;
  const totalStudents = users.filter((u: any) => u.role === "student").length;

  const roleData = [
    { name: "Admins", value: users.filter((u: any) => u.role === "admin").length },
    { name: "Trainers", value: activeTrainers },
    { name: "Students", value: totalStudents },
  ].filter((d: any) => d.value > 0);

  // Simulated Attendance metrics until live integration
  const mockAttendance = [
    { date: "Mon", attendance: 82 },
    { date: "Tue", attendance: 90 },
    { date: "Wed", attendance: 85 },
    { date: "Thu", attendance: 95 },
    { date: "Fri", attendance: 88 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Platform Overview</h1>
        <p className="mt-1 text-sm text-slate-500">
          Analytics and activity for your organization
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? <Skeleton className="h-32 w-full rounded-xl" /> : (
           <StatCard title="Total Sections" value={sections.length} trend="up" change="+2" />
        )}
        {loading ? <Skeleton className="h-32 w-full rounded-xl" /> : (
           <StatCard title="Total Students" value={totalStudents} trend="up" change="+12" />
        )}
        {loading ? <Skeleton className="h-32 w-full rounded-xl" /> : (
           <StatCard title="Active Trainers" value={activeTrainers} trend="up" change="+1" />
        )}
        <StatCard title="Overall Attendance" value="88%" trend="up" change="+4%" />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm border-slate-200/60">
          <CardHeader>
            <CardTitle>Attendance Trends</CardTitle>
          </CardHeader>
          <CardContent>
             <AttendanceChart data={mockAttendance} />
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200/60">
          <CardHeader>
            <CardTitle>Platform Roles</CardTitle>
          </CardHeader>
          <CardContent>
             {loading ? <Skeleton className="h-[250px] w-full rounded-lg" /> : <RolesChart data={roleData} />}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Tables + Activity Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-slate-200/60">
            <CardHeader>
              <CardTitle>Recent Sections</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3"><Skeleton className="h-8 w-full"/><Skeleton className="h-8 w-full"/></div>
              ) : !sections.length ? (
                <div className="text-center text-sm text-slate-500 py-6">No sections yet. Create one 🚀</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sections.slice(0, 4).map((section: any) => (
                      <TableRow key={section.id}>
                        <TableCell className="font-medium">{section.name}</TableCell>
                        <TableCell className="text-slate-500">{section.description || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-sm border-slate-200/60 h-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
