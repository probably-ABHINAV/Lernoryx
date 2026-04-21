import * as Sentry from "@sentry/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export async function setSentryUserContext() {
  try {
    const { userId } = await auth();

    if (!userId) return;

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress;

    const supabase = createClient();

    // Fetch extra data from DB
    const { data: dbUser } = await supabase
      .from("users")
      .select("role, org_id")
      .eq("id", userId)
      .single();

    // Set user in Sentry globally for current transaction
    Sentry.setUser({
      id: userId,
      email: email || undefined,
    });

    // Add more context (role, org)
    Sentry.setContext("user_details", {
      role: dbUser?.role ?? "unknown",
      org_id: dbUser?.org_id ?? "unknown",
    });

  } catch (error) {
    // Fail silently so auth extraction doesn't crash the actual request
    console.warn("Failed to set Sentry advanced context:", error);
  }
}
