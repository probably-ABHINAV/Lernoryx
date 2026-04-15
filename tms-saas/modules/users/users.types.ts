export interface AppUser {
  id?: string;
  email: string;
  role: "admin" | "trainer" | "student";
  org_id: string;
}

export interface CreateUserInput {
  email: string;
  role: "admin" | "trainer" | "student";
  org_id: string;
}
