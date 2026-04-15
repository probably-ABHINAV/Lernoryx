/** Full organization record. */
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  plan: OrgPlan;
  maxStudents: number;
  maxTrainers: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Input for creating an organization. */
export interface CreateOrgInput {
  name: string;
  plan?: OrgPlan;
}

/** Input for updating an organization. */
export interface UpdateOrgInput {
  name?: string;
  logoUrl?: string;
  plan?: OrgPlan;
  isActive?: boolean;
}

/** Subscription plan tiers. */
export type OrgPlan = "starter" | "professional" | "enterprise";
