import type { AttendanceRecord, MarkAttendanceInput } from "./attendance.types";

/**
 * AttendanceRepo — database operations for attendance records.
 */
export class AttendanceRepo {
  static async findBySession(sessionId: string): Promise<AttendanceRecord[]> {
    throw new Error("Not implemented");
  }

  static async findByStudent(studentId: string): Promise<AttendanceRecord[]> {
    throw new Error("Not implemented");
  }

  static async insert(data: MarkAttendanceInput): Promise<AttendanceRecord> {
    throw new Error("Not implemented");
  }

  static async bulkInsert(data: MarkAttendanceInput[]): Promise<AttendanceRecord[]> {
    throw new Error("Not implemented");
  }

  static async update(id: string, status: AttendanceRecord["status"]): Promise<void> {
    throw new Error("Not implemented");
  }
}
