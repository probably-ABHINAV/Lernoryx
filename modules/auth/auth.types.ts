/** Credentials for login/signup. */
export interface AuthCredentials {
  email: string;
  password: string;
}

/** Result from an auth operation. */
export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

/** Authenticated user info. */
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
}

/** Current session data. */
export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  expiresAt: number;
}

/** User role enum. */
export type UserRole = "admin" | "trainer" | "student";
