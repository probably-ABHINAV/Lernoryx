"use client";

import { createContext, useContext } from "react";
import type { AppUser } from "@/modules/users/users.types";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export type AuthUser = SupabaseUser & { profile: AppUser };

interface UserContextType {
  user: AuthUser | null;
  role: string | null;
}

const UserContext = createContext<UserContextType>({ user: null, role: null });

export function UserProvider({
  user,
  children,
}: {
  user: AuthUser | null;
  children: React.ReactNode;
}) {
  const role = user?.profile?.role || null;
  return (
    <UserContext.Provider value={{ user, role }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
