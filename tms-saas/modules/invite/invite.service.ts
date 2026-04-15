import { createClient } from "@/lib/supabase/server";

export async function sendInvite(user: any, email: string, role: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("invites").insert({
    email,
    role,
    org_id: user.profile.org_id,
    invited_by: user.id,
  }).select().single();

  if (error) throw error;
  
  // Here you would normally also trigger an actual email via services/email.service.ts
  // For example: await sendEmail(email, "You're invited!", `Link: /signup?email=${email}`)
  
  return data;
}
