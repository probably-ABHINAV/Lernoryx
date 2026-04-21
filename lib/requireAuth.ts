import "server-only";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { createClient } from "./supabase/server";

export async function requireAuth() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const db = createClient();
  const { data: dbUser, error } = await db
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  let user = dbUser;

  if (error || !user) {
    const { syncUser } = await import("./syncUser");
    const syncedUser = await syncUser();
    
    if (syncedUser) {
      user = syncedUser;
    } else {
      throw new Error("User profile not found. Onboarding may be incomplete.");
    }
  }

  const cookieStore = await cookies();
  const impersonateRole = cookieStore.get("tms_impersonate_role")?.value;

  // Standardized identity object
  const profile = {
    ...user,
    tmsId: user.id,
    actual_role: user.role,
    role: (user.role === "super_admin" && impersonateRole) ? impersonateRole : user.role,
  };

  return {
    ...user,
    profile, // Legacy compatibility
  };
}
