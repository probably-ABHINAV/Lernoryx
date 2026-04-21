"use client";

import { useSession, useUser, useClerk } from "@clerk/nextjs";

export function useAuth() {
  const { session, isLoaded: sessionLoaded } = useSession();
  const { user, isLoaded: userLoaded } = useUser();
  const { signOut } = useClerk();

  const isAuthenticated = !!user;

  async function logout() {
    await signOut({ redirectUrl: "/sign-in" });
  }

  return {
    user,
    session,
    loading: !sessionLoaded || !userLoaded,
    error: null,
    isAuthenticated,
    logout,
  };
}
