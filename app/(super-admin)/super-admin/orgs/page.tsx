import { requireSuperAdmin } from "@/lib/auth-server";
import { OrgsClient } from "./orgs-client";

export const metadata = { title: "Organizations — TMS Super Admin" };

export default async function SuperAdminOrgsPage() {
  await requireSuperAdmin();
  return <OrgsClient />;
}
