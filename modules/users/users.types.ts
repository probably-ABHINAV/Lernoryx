export interface AppUser {
  id?: string;
  email: string;
  role: "admin" | "trainer" | "student" | "super_admin" | "pending";
  org_id: string;
  upload_count?: number;
}

export interface CreateUserInput {
  email: string;
  role: "admin" | "trainer" | "student" | "super_admin";
  org_id: string;
}
