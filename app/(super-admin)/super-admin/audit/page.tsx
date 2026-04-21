import { requireSuperAdmin } from "@/lib/auth-server";
import { AuditClient } from "./audit-client";

export const metadata = { title: "Audit Log — TMS Super Admin" };

export default async function AuditPage() {
  await requireSuperAdmin();
  return <AuditClient />;
}
