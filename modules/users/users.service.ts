import type { AppUser, CreateUserInput } from "./users.types";
import { UsersRepo } from "./users.repo";

export class UsersService {
  static async list(user: any): Promise<AppUser[]> {
    return UsersRepo.findByOrg(user.profile.org_id);
  }

  static async create(user: any, newUser: Omit<CreateUserInput, "org_id">): Promise<AppUser> {
    const input: CreateUserInput = {
      ...newUser,
      org_id: user.profile.org_id,
    };
    return UsersRepo.insert(input);
  }
}
