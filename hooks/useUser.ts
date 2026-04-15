"use client";

import { useUserContext } from "@/components/providers/user-provider";

/**
 * useUser — access current user context.
 */
export function useUser(userId?: string) {
  const { user, role } = useUserContext();
  
  return { user, role, isLoading: false, error: null };
}
