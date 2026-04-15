import { requireAuth } from "@/lib/auth";
import { UserProvider } from "@/components/providers/user-provider";
import DashboardLayoutUI from "@/components/dashboard/layout";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <UserProvider user={user as any}>
      <DashboardLayoutUI>{children}</DashboardLayoutUI>
    </UserProvider>
  );
}
