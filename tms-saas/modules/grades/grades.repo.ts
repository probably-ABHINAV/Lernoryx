import { createClient } from "@/lib/supabase/server";
import type { Grade, AddGradeInput } from "./grades.types";

export class GradesRepo {
  static async findByOrg(org_id: string): Promise<Grade[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("grades")
      .select("*")
      .eq("org_id", org_id);

    if (error) throw error;
    return data;
  }

  static async insert(data: AddGradeInput): Promise<Grade> {
    const supabase = await createClient();
    const { data: grade, error } = await supabase
      .from("grades")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return grade;
  }
}
