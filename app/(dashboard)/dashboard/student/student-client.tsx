"use client";

import { useDashboard } from "@/hooks/useDashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StudentClient() {
  const { data, loading } = useDashboard();
  
  const sessions = data?.sessions || [];
  const attendance = data?.attendance || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Your schedule, grades, and attendance at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Upcoming Sessions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3"><Skeleton className="h-6 w-full"/><Skeleton className="h-6 w-full"/></div>
            ) : !sessions.length ? (
              <p className="text-sm text-slate-500">No upcoming sessions.</p>
            ) : (
              <ul className="space-y-4">
                {sessions.map((session: any) => (
                  <li key={session.id} className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="font-medium text-slate-900">{session.topic}</span>
                    <span className="text-slate-500">{session.time}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Attendance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
               <div className="space-y-3"><Skeleton className="h-8 w-full"/><Skeleton className="h-8 w-full"/></div>
            ) : !attendance.length ? (
               <p className="text-sm text-slate-500">No records yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.session_name}</TableCell>
                      <TableCell>{record.date || "—"}</TableCell>
                      <TableCell>
                         <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${record.status === "present" ? "bg-emerald-100 text-emerald-800" : record.status === "absent" ? "bg-rose-100 text-rose-800" : "bg-slate-100 text-slate-800"}`}>
                          {record.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
