// app/(dashboard)/dashboard/page.tsx
import { requireAuth } from "@/lib/requireAuth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await requireAuth();

  switch (user.profile.role) {
    case "super_admin":
      redirect("/super-admin");
    case "admin":
      redirect("/dashboard/admin");
    case "trainer":
      redirect("/dashboard/trainer");
    case "student":
      redirect("/dashboard/student");
    case "pending":
      redirect("/pending");
    default:
      redirect("/pending");
  }
}
