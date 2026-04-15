import { createClient } from "@/lib/supabase/server";
import type { Session, CreateSessionInput } from "./sessions.types";

export class SessionsRepo {
  static async findByOrg(org_id: string): Promise<Session[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("org_id", org_id);

    if (error) throw error;
    return data;
  }

  static async insert(data: CreateSessionInput): Promise<Session> {
    const supabase = await createClient();
    const { data: session, error } = await supabase
      .from("sessions")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return session;
  }
}
