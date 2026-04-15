import type { Session, CreateSessionInput } from "./sessions.types";
import { SessionsRepo } from "./sessions.repo";

export class SessionsService {
  static async list(user: any): Promise<Session[]> {
    return SessionsRepo.findByOrg(user.profile.org_id);
  }

  static async create(user: any, data: Omit<CreateSessionInput, "org_id">): Promise<Session> {
    const input: CreateSessionInput = {
      ...data,
      org_id: user.profile.org_id,
    };
    return SessionsRepo.insert(input);
  }
}
