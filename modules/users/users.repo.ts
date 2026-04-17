import { createClient } from "@/lib/supabase/server";
import type { AppUser, CreateUserInput } from "./users.types";

export class UsersRepo {
  static async findByOrg(org_id: string): Promise<AppUser[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .select("id, email, full_name, role, org_id, created_at, updated_at")
      .eq("org_id", org_id);

    if (error) throw error;
    return data;
  }

  static async insert(data: CreateUserInput): Promise<AppUser> {
    const supabase = await createClient();
    const { data: user, error } = await supabase
      .from("users")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return user;
  }

  static async getUploadCount(id: string): Promise<number> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .select("upload_count")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data?.upload_count || 0;
  }

  static async incrementUploadCount(id: string): Promise<void> {
    const supabase = await createClient();
    // Using simple generic read-write transaction logic. For extreme scale, use RPC execution.
    const currentCount = await this.getUploadCount(id);
    const { error } = await supabase
      .from("users")
      .update({ upload_count: currentCount + 1 })
      .eq("id", id);
      
    if (error) throw error;
  }
}
