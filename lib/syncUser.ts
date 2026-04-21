import "server-only";
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "./supabase/server";

export async function syncUser() {
  const user = await currentUser();
  if (!user) return null;

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  const db = createClient();

  // Check if user already exists
  const { data: existingUser, error } = await db
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  // If user already exists, onboarding was completed
  if (existingUser) {
    return existingUser;
  }

  // MIGRATION SUPPORT: Check if email exists with a legacy UUID ID
  // This allows old users to "claim" their accounts when logging in via Clerk for the first time
  const { data: userByEmail } = await db
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (userByEmail) {
    // Update the existing row with the new Clerk ID
    const { data: updatedUser, error: updateError } = await db
      .from("users")
      .update({ id: user.id })
      .eq("email", email)
      .select()
      .single();

    if (!updateError) {
      return updatedUser;
    }
    console.error("Error updating legacy user ID:", updateError);
  }

  // Handle new user logic
  // Check for invite
  const { data: invite } = await db
    .from("invites")
    .select("*")
    .eq("email", email)
    .eq("status", "pending")
    .maybeSingle();

  if (invite) {
    // Fulfil invite
    const { data: newUser, error: insertError } = await db
      .from("users")
      .insert({
        id: user.id,
        email: email,
        role: invite.role,
        org_id: invite.org_id,
      })
      .select()
      .single();

    if (!insertError) {
      await db.from("invites").update({ status: "accepted" }).eq("id", invite.id);
      return newUser;
    }
  } else {
    // Create new organization and assign as admin
    const { data: org, error: orgError } = await db
      .from("organizations")
      .insert({
        name: `${user.firstName || user.username || email.split("@")[0]}'s Organization`,
      })
      .select()
      .single();

    if (!orgError && org) {
      const { data: newUser } = await db
        .from("users")
        .insert({
          id: user.id,
          email: email,
          role: "admin",
          org_id: org.id,
        })
        .select()
        .single();
      return newUser;
    } else {
      // Fallback
      const { data: fallbackUser } = await db
        .from("users")
        .insert({
          id: user.id,
          email: email,
          role: "pending",
          org_id: null,
        })
        .select()
        .single();
      return fallbackUser;
    }
  }
}
