import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await requireAuth();

  const role = user.profile?.role;

  if (role === "admin") redirect("/dashboard/admin");
  if (role === "trainer") redirect("/dashboard/trainer");
  if (role === "student") redirect("/dashboard/student");
  if (role === "super_admin") redirect("/super-admin");

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Redirecting to dashboard...</p>
    </div>
  );
}
