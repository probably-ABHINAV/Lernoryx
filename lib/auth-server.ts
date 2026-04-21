import "server-only";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export async function requireSuperAdmin() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const supabase = createClient();
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !user) {
    throw new Error("User profile not found");
  }

  // Super admin pages always use actual role, ignoring impersonation
  if (user.role !== "super_admin") {
    throw new Error("Unauthorized: Super Admin access required");
  }

  return {
    ...user,
    actualRole: user.role, // Exposed for logic compatibility
  };
}
