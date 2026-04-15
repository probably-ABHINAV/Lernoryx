import type { Section, CreateSectionInput, UpdateSectionInput } from "./sections.types";

/**
 * SectionsRepo — database operations for sections.
 */
export class SectionsRepo {
  static async findById(id: string): Promise<Section | null> {
    throw new Error("Not implemented");
  }

  static async findByOrg(orgId: string): Promise<Section[]> {
    throw new Error("Not implemented");
  }

  static async findByTrainer(trainerId: string): Promise<Section[]> {
    throw new Error("Not implemented");
  }

  static async insert(data: CreateSectionInput): Promise<Section> {
    throw new Error("Not implemented");
  }

  static async update(id: string, data: UpdateSectionInput): Promise<Section> {
    throw new Error("Not implemented");
  }

  static async softDelete(id: string): Promise<void> {
    throw new Error("Not implemented");
  }

  static async addStudentToSection(sectionId: string, studentId: string): Promise<void> {
    throw new Error("Not implemented");
  }

  static async removeStudentFromSection(sectionId: string, studentId: string): Promise<void> {
    throw new Error("Not implemented");
  }
}
