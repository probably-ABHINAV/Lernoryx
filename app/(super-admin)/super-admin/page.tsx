import { requireSuperAdmin } from "@/lib/auth-server";
import { SuperAdminClient } from "./super-admin-client";

export const metadata = { title: "Platform Overview — TMS Super Admin" };

export default async function SuperAdminPage() {
  await requireSuperAdmin();
  return <SuperAdminClient />;
}
