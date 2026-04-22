"use client";

import { createContext, useContext } from "react";
import useSWR from "swr";

export interface TmsUserProfile {
  email: string;
  role: "super_admin" | "admin" | "trainer" | "student" | "pending";
  actualRole?: string;
  actual_role?: string;
  orgId: string | null;
  tmsId: string;
}

interface UserContextType {
  profile: TmsUserProfile | null;
  loading: boolean;
  error: unknown;
  mutate: () => void;
}

export const UserContext = createContext<UserContextType>({
  profile: null,
  loading: true,
  error: null,
  mutate: () => {},
});

const fetcher = (url: string) =>
  fetch(url).then((r) => (r.ok ? r.json() : null));

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error, mutate } = useSWR<TmsUserProfile>(
    "/api/auth/me",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,    // Only refetch every 60 seconds
    }
  );

  return (
    <UserContext.Provider
      value={{ profile: data ?? null, loading: isLoading, error, mutate }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
