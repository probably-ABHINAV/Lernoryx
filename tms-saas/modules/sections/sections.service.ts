import type { Section, CreateSectionInput, UpdateSectionInput } from "./sections.types";

/**
 * SectionsService — manage training sections (classes/groups).
 */
export class SectionsService {
  static async getById(id: string): Promise<Section | null> {
    throw new Error("Not implemented");
  }

  static async listByOrg(orgId: string): Promise<Section[]> {
    throw new Error("Not implemented");
  }

  static async listByTrainer(trainerId: string): Promise<Section[]> {
    throw new Error("Not implemented");
  }

  static async create(input: CreateSectionInput): Promise<Section> {
    throw new Error("Not implemented");
  }

  static async update(id: string, input: UpdateSectionInput): Promise<Section> {
    throw new Error("Not implemented");
  }

  static async delete(id: string): Promise<void> {
    throw new Error("Not implemented");
  }

  static async addStudent(sectionId: string, studentId: string): Promise<void> {
    throw new Error("Not implemented");
  }

  static async removeStudent(sectionId: string, studentId: string): Promise<void> {
    throw new Error("Not implemented");
  }
}
