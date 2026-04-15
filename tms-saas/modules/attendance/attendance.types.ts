export type AttendanceStatus = "Present" | "Absent" | "Late";

export interface Attendance {
  id?: string;
  session_id: string;
  student_id: string;
  status: AttendanceStatus;
  org_id: string;
}

export interface MarkAttendanceInput {
  session_id: string;
  student_id: string;
  status: AttendanceStatus;
  org_id: string;
}
