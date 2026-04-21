import { requireSuperAdmin } from "@/lib/auth-server";
import { HealthClient } from "./health-client";

export const metadata = { title: "Platform Health — TMS Super Admin" };

export default async function HealthPage() {
  await requireSuperAdmin();
  return <HealthClient />;
}
