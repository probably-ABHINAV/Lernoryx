/** A grade record for a student. */
export interface Grade {
  id: string;
  studentId: string;
  sectionId: string;
  sessionId?: string;
  title: string;
  type: GradeType;
  score: number;
  maxScore: number;
  percentage: number;
  feedback?: string;
  gradedBy: string; // trainer ID
  gradedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type GradeType = "assignment" | "quiz" | "exam" | "project" | "participation";

export interface CreateGradeInput {
  studentId: string;
  sectionId: string;
  sessionId?: string;
  title: string;
  type: GradeType;
  score: number;
  maxScore: number;
  feedback?: string;
  gradedBy: string;
}

export interface UpdateGradeInput {
  score?: number;
  maxScore?: number;
  feedback?: string;
}

/** Aggregated grade summary for a student. */
export interface GradeSummary {
  totalGrades: number;
  averagePercentage: number;
  gradesByType: Record<GradeType, { count: number; avgPercentage: number }>;
}
