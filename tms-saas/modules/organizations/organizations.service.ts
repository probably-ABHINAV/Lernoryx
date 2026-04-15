import type {
  Organization,
  CreateOrgInput,
  UpdateOrgInput,
} from "./organizations.types";

/**
 * OrganizationsService — organization management business logic.
 */
export class OrganizationsService {
  static async getById(id: string): Promise<Organization | null> {
    throw new Error("Not implemented");
  }

  static async getBySlug(slug: string): Promise<Organization | null> {
    throw new Error("Not implemented");
  }

  static async create(input: CreateOrgInput): Promise<Organization> {
    // TODO: Generate slug, validate, create org
    throw new Error("Not implemented");
  }

  static async update(id: string, input: UpdateOrgInput): Promise<Organization> {
    throw new Error("Not implemented");
  }

  static async delete(id: string): Promise<void> {
    throw new Error("Not implemented");
  }
}
