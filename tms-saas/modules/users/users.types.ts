import type { UserRole } from "@/modules/auth/auth.types";

/** Full user record from DB. */
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  organizationId: string;
  avatarUrl?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Input for creating a new user. */
export interface CreateUserInput {
  email: string;
  fullName: string;
  role: UserRole;
  organizationId: string;
  phone?: string;
}

/** Input for updating a user. */
export interface UpdateUserInput {
  fullName?: string;
  role?: UserRole;
  phone?: string;
  avatarUrl?: string;
  isActive?: boolean;
}
