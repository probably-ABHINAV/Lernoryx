import type { Grade, CreateGradeInput, UpdateGradeInput } from "./grades.types";

/**
 * GradesRepo — database operations for grades.
 */
export class GradesRepo {
  static async findById(id: string): Promise<Grade | null> {
    throw new Error("Not implemented");
  }

  static async findByStudent(studentId: string): Promise<Grade[]> {
    throw new Error("Not implemented");
  }

  static async findBySection(sectionId: string): Promise<Grade[]> {
    throw new Error("Not implemented");
  }

  static async insert(data: CreateGradeInput): Promise<Grade> {
    throw new Error("Not implemented");
  }

  static async update(id: string, data: UpdateGradeInput): Promise<Grade> {
    throw new Error("Not implemented");
  }

  static async delete(id: string): Promise<void> {
    throw new Error("Not implemented");
  }
}
