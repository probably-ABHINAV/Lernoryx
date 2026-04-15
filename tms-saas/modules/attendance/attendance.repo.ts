import { createClient } from "@/lib/supabase/server";
import type { Attendance, MarkAttendanceInput } from "./attendance.types";

export class AttendanceRepo {
  static async findByOrg(org_id: string): Promise<Attendance[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("org_id", org_id);

    if (error) throw error;
    return data;
  }

  static async upsert(data: MarkAttendanceInput): Promise<Attendance> {
    const supabase = await createClient();
    const { data: record, error } = await supabase
      .from("attendance")
      .upsert(data, { onConflict: 'session_id, student_id' }) // Assuming a unique constraint exists
      .select()
      .single();

    if (error) throw error;
    return record;
  }
}
