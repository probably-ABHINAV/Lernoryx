import type { Attendance, MarkAttendanceInput } from "./attendance.types";
import { AttendanceRepo } from "./attendance.repo";

export class AttendanceService {
  static async list(user: any): Promise<Attendance[]> {
    return AttendanceRepo.findByOrg(user.profile.org_id);
  }

  static async markAttendance(user: any, data: Omit<MarkAttendanceInput, "org_id">): Promise<Attendance> {
    const input: MarkAttendanceInput = {
      ...data,
      org_id: user.profile.org_id,
    };
    return AttendanceRepo.upsert(input);
  }
}
