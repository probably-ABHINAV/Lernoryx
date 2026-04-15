/** A training section (class/group). */
export interface Section {
  id: string;
  name: string;
  description?: string;
  org_id: string;
  trainer_id?: string;
  maxCapacity: number;
  currentEnrollment: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSectionInput {
  name: string;
  description?: string;
  org_id: string;
  trainer_id?: string;
  maxCapacity?: number;
}
