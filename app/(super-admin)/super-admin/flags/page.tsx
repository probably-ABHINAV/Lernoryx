import { requireSuperAdmin } from "@/lib/auth-server";
import { FeatureFlagsClient } from "./feature-flags-client";

export const metadata = { title: "Feature Flags — TMS Super Admin" };

export default async function FeatureFlagsPage() {
  await requireSuperAdmin();
  return <FeatureFlagsClient />;
}
