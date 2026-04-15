import type {
  AttendanceRecord,
  MarkAttendanceInput,
  AttendanceSummary,
} from "./attendance.types";

/**
 * AttendanceService — business logic for tracking attendance.
 */
export class AttendanceService {
  static async getBySession(sessionId: string): Promise<AttendanceRecord[]> {
    throw new Error("Not implemented");
  }

  static async getByStudent(studentId: string): Promise<AttendanceRecord[]> {
    throw new Error("Not implemented");
  }

  static async markAttendance(input: MarkAttendanceInput): Promise<AttendanceRecord> {
    throw new Error("Not implemented");
  }

  static async bulkMarkAttendance(inputs: MarkAttendanceInput[]): Promise<AttendanceRecord[]> {
    throw new Error("Not implemented");
  }

  static async getSummary(
    sectionId: string,
    dateRange?: { from: string; to: string }
  ): Promise<AttendanceSummary> {
    throw new Error("Not implemented");
  }
}
