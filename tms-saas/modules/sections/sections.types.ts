/** A training section (class/group). */
export interface Section {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  trainerId: string;
  maxCapacity: number;
  currentEnrollment: number;
  schedule: SectionSchedule;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Weekly schedule for a section. */
export interface SectionSchedule {
  days: DayOfWeek[];
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  timezone: string;
}

export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface CreateSectionInput {
  name: string;
  description?: string;
  organizationId: string;
  trainerId: string;
  maxCapacity: number;
  schedule: SectionSchedule;
}

export interface UpdateSectionInput {
  name?: string;
  description?: string;
  trainerId?: string;
  maxCapacity?: number;
  schedule?: SectionSchedule;
  isActive?: boolean;
}
