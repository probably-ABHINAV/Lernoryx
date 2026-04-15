import type { Session, CreateSessionInput, UpdateSessionInput } from "./sessions.types";

/**
 * SessionsRepo — database operations for sessions.
 */
export class SessionsRepo {
  static async findById(id: string): Promise<Session | null> {
    throw new Error("Not implemented");
  }

  static async findBySection(sectionId: string): Promise<Session[]> {
    throw new Error("Not implemented");
  }

  static async findByTrainer(trainerId: string, date?: string): Promise<Session[]> {
    throw new Error("Not implemented");
  }

  static async findToday(orgId: string): Promise<Session[]> {
    throw new Error("Not implemented");
  }

  static async insert(data: CreateSessionInput): Promise<Session> {
    throw new Error("Not implemented");
  }

  static async update(id: string, data: UpdateSessionInput): Promise<Session> {
    throw new Error("Not implemented");
  }

  static async cancel(id: string, reason: string): Promise<void> {
    throw new Error("Not implemented");
  }
}
