export interface Grade {
  id?: string;
  student_id: string;
  section_id: string;
  score: number;
  remarks?: string;
  org_id: string;
}

export interface AddGradeInput {
  student_id: string;
  section_id: string;
  score: number;
  remarks?: string;
  org_id: string;
}
