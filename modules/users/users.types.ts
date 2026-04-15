export interface AppUser {
  id?: string;
  email: string;
  role: "admin" | "trainer" | "student" | "super_admin";
  org_id: string;
}

export interface CreateUserInput {
  email: string;
  role: "admin" | "trainer" | "student" | "super_admin";
  org_id: string;
}
