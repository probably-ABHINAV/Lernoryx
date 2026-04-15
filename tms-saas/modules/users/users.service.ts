import type { User, CreateUserInput, UpdateUserInput } from "./users.types";
// import { UsersRepo } from "./users.repo";

/**
 * UsersService — user management business logic.
 */
export class UsersService {
  static async getById(id: string): Promise<User | null> {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  static async getByEmail(email: string): Promise<User | null> {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  static async list(orgId: string): Promise<User[]> {
    // TODO: Implement with pagination
    throw new Error("Not implemented");
  }

  static async create(input: CreateUserInput): Promise<User> {
    // TODO: Validate, create user
    throw new Error("Not implemented");
  }

  static async update(id: string, input: UpdateUserInput): Promise<User> {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  static async delete(id: string): Promise<void> {
    // TODO: Soft delete
    throw new Error("Not implemented");
  }
}
