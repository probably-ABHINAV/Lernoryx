import { createClient } from "@/lib/supabase/client";

export async function signUp(email: string, password: string, fullName?: string) {
  const supabase = createClient();

  // Step 1: Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;

  const user = data.user;

  // Step 2: Create organization
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({
      name: fullName ? `${fullName}'s Organization` : "My Organization",
      slug: fullName ? fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now() : `org-${Date.now()}`,
      plan: "starter",
      maxStudents: 50,
      maxTrainers: 5,
      isActive: true,
    })
    .select()
    .single();

  if (orgError) {
    console.error("Failed to create organization:", orgError);
    // Ideally, we'd want to rollback or handle this, but for now we proceed or throw:
    throw orgError;
  }

  // Step 3: Insert user into users table with org_id
  const { error: userError } = await supabase.from("users").insert({
    id: user?.id,
    email,
    fullName: fullName || "New User",
    role: "admin",
    organizationId: org.id,
    isActive: true,
  });

  if (userError) {
    console.error("Failed to create user profile:", userError);
    throw userError;
  }

  return data;
}

export async function login(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
}
