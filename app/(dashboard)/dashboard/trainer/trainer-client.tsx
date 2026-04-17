import { useDashboard } from "@/hooks/useDashboard";
import { FileUpload } from "@/components/ui/file-upload";
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

export function TrainerClient() {
  const { data, loading } = useDashboard();
  
  const sessions = data?.sessions || [];
  const attendance = data?.attendance || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Trainer Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your sessions and track student progress
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3"><Skeleton className="h-8 w-full"/><Skeleton className="h-8 w-full"/></div>
            ) : !sessions.length ? (
              <p className="text-sm text-slate-500">No sessions scheduled for today.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Topic</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session: any) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">{session.time}</TableCell>
                      <TableCell>{session.topic}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Attendance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance Updates</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3"><Skeleton className="h-8 w-full"/><Skeleton className="h-8 w-full"/></div>
            ) : !attendance.length ? (
              <p className="text-sm text-slate-500">Attendance data will appear here.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.slice(0, 5).map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.student_name}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${record.status === "present" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
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

        {/* Dynamic Resource Deployment */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Resource Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-slate-500 mb-4">Securely push PDF curriculums and media natively into active Section nodes. Resources map directly into private tenant paths automatically.</p>
             <FileUpload sectionId="default-trainer-section" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
