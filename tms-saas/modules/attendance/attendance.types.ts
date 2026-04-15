/** A single attendance record. */
export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: AttendanceStatus;
  markedBy: string; // trainer or admin ID
  markedAt: string;
  notes?: string;
}

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

/** Input for marking attendance. */
export interface MarkAttendanceInput {
  sessionId: string;
  studentId: string;
  status: AttendanceStatus;
  markedBy: string;
  notes?: string;
}

/** Summary stats for attendance. */
export interface AttendanceSummary {
  totalSessions: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number; // percentage
}
