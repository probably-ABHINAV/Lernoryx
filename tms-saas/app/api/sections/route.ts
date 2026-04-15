import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) return new Response("Unauthorized", { status: 401 });

  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("organizationId", user.profile.organizationId);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}
