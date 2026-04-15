import type { Section, CreateSectionInput } from "./sections.types";
import { SectionsRepo } from "./sections.repo";
// Using `any` for user type to match your example, but normally we'd import AuthUser
export class SectionsService {
  static async list(user: any): Promise<Section[]> {
    return SectionsRepo.findByOrg(user.profile.org_id);
  }

  static async create(user: any, name: string, description?: string): Promise<Section> {
    const input: CreateSectionInput = {
      name,
      description,
      org_id: user.profile.org_id,
      // created_by: user.id
    };
    return SectionsRepo.insert(input);
  }
}
