"use client";

import { useState, useEffect } from "react";
import type { User } from "@/modules/users/users.types";

/**
 * useUser — fetch and cache user profile data.
 */
export function useUser(userId?: string) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    // TODO: Fetch user from API
    // fetch(`/api/users/${userId}`)
    //   .then(res => res.json())
    //   .then(data => setUser(data))
    //   .catch(err => setError(err.message))
    //   .finally(() => setIsLoading(false));

    setIsLoading(false);
  }, [userId]);

  return { user, isLoading, error };
}
