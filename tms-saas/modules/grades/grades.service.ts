import type { Grade, AddGradeInput } from "./grades.types";
import { GradesRepo } from "./grades.repo";

export class GradesService {
  static async list(user: any): Promise<Grade[]> {
    return GradesRepo.findByOrg(user.profile.org_id);
  }

  static async addGrade(user: any, data: Omit<AddGradeInput, "org_id">): Promise<Grade> {
    const input: AddGradeInput = {
      ...data,
      org_id: user.profile.org_id,
    };
    return GradesRepo.insert(input);
  }
}
