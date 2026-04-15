import type { Grade, CreateGradeInput, UpdateGradeInput, GradeSummary } from "./grades.types";

/**
 * GradesService — business logic for grade management.
 */
export class GradesService {
  static async getById(id: string): Promise<Grade | null> {
    throw new Error("Not implemented");
  }

  static async listByStudent(studentId: string): Promise<Grade[]> {
    throw new Error("Not implemented");
  }

  static async listBySection(sectionId: string): Promise<Grade[]> {
    throw new Error("Not implemented");
  }

  static async create(input: CreateGradeInput): Promise<Grade> {
    throw new Error("Not implemented");
  }

  static async update(id: string, input: UpdateGradeInput): Promise<Grade> {
    throw new Error("Not implemented");
  }

  static async delete(id: string): Promise<void> {
    throw new Error("Not implemented");
  }

  static async getStudentSummary(studentId: string): Promise<GradeSummary> {
    throw new Error("Not implemented");
  }
}
