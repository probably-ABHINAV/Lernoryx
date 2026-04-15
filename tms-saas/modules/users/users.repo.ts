// import { supabase } from "@/lib/supabase";
import type { User, CreateUserInput, UpdateUserInput } from "./users.types";

/**
 * UsersRepo — database operations for users.
 */
export class UsersRepo {
  static async findById(id: string): Promise<User | null> {
    // TODO: Query users table
    throw new Error("Not implemented");
  }

  static async findByEmail(email: string): Promise<User | null> {
    // TODO: Query users table
    throw new Error("Not implemented");
  }

  static async findByOrg(orgId: string): Promise<User[]> {
    // TODO: Query with org filter + pagination
    throw new Error("Not implemented");
  }

  static async insert(data: CreateUserInput): Promise<User> {
    // TODO: Insert into users table
    throw new Error("Not implemented");
  }

  static async update(id: string, data: UpdateUserInput): Promise<User> {
    // TODO: Update users table
    throw new Error("Not implemented");
  }

  static async softDelete(id: string): Promise<void> {
    // TODO: Set deleted_at timestamp
    throw new Error("Not implemented");
  }
}
