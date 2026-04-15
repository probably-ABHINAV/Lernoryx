import type { Organization, CreateOrgInput, UpdateOrgInput } from "./organizations.types";

/**
 * OrganizationsRepo — database operations for organizations.
 */
export class OrganizationsRepo {
  static async findById(id: string): Promise<Organization | null> {
    throw new Error("Not implemented");
  }

  static async findBySlug(slug: string): Promise<Organization | null> {
    throw new Error("Not implemented");
  }

  static async insert(data: CreateOrgInput): Promise<Organization> {
    throw new Error("Not implemented");
  }

  static async update(id: string, data: UpdateOrgInput): Promise<Organization> {
    throw new Error("Not implemented");
  }

  static async softDelete(id: string): Promise<void> {
    throw new Error("Not implemented");
  }
}
