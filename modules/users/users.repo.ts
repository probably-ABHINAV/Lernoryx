import { createClient } from "@/lib/supabase/server";
import type { AppUser, CreateUserInput } from "./users.types";

export class UsersRepo {
  static async findByOrg(org_id: string): Promise<AppUser[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
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
}
