"use client";

import { useState, useEffect } from "react";
import type { AuthUser } from "@/modules/auth/auth.types";

/**
 * useAuth — client-side authentication hook.
 * Provides current user state and auth actions.
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Subscribe to auth state changes via Supabase
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string) {
    setIsLoading(true);
    try {
      // TODO: Call auth API
      console.log("Login:", email);
    } finally {
      setIsLoading(false);
    }
  }

  async function signup(email: string, password: string, fullName: string) {
    setIsLoading(true);
    try {
      // TODO: Call auth API
      console.log("Signup:", email, fullName);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    // TODO: Call auth API
    setUser(null);
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };
}
