import { createClient } from "@/lib/supabase/server";
import type { Section, CreateSectionInput } from "./sections.types";

/**
 * SectionsRepo — database operations for sections.
 */
export class SectionsRepo {
  static async findByOrg(org_id: string): Promise<Section[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sections")
      .select("id, name, description, maxCapacity, currentEnrollment, isActive, org_id, createdAt, updatedAt")
      .eq("org_id", org_id);

    if (error) throw error;
    return data;
  }

  static async insert(data: CreateSectionInput): Promise<Section> {
    const supabase = await createClient();
    const { data: section, error } = await supabase
      .from("sections")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return section;
  }
}
