import type { Session, CreateSessionInput, UpdateSessionInput } from "./sessions.types";

/**
 * SessionsService — manage individual training sessions.
 */
export class SessionsService {
  static async getById(id: string): Promise<Session | null> {
    throw new Error("Not implemented");
  }

  static async listBySection(sectionId: string): Promise<Session[]> {
    throw new Error("Not implemented");
  }

  static async listByTrainer(trainerId: string, date?: string): Promise<Session[]> {
    throw new Error("Not implemented");
  }

  static async listToday(orgId: string): Promise<Session[]> {
    throw new Error("Not implemented");
  }

  static async create(input: CreateSessionInput): Promise<Session> {
    throw new Error("Not implemented");
  }

  static async update(id: string, input: UpdateSessionInput): Promise<Session> {
    throw new Error("Not implemented");
  }

  static async cancel(id: string, reason: string): Promise<void> {
    throw new Error("Not implemented");
  }
}
