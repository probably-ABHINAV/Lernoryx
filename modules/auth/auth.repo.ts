// import { supabase } from "@/lib/supabase";

/**
 * AuthRepo — database operations for auth-related data.
 */
export class AuthRepo {
  /**
   * Create a user profile after signup.
   */
  static async createProfile(userId: string, data: { fullName: string; email: string }) {
    // TODO: Insert into profiles table
    throw new Error("Not implemented");
  }

  /**
   * Get profile by user ID.
   */
  static async getProfileByUserId(userId: string) {
    // TODO: Query profiles table
    throw new Error("Not implemented");
  }
}
