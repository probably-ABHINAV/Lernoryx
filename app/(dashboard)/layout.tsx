import { requireAuth } from "@/lib/requireAuth";
import { UserProvider } from "@/components/providers/user-provider";
import DashboardLayoutUI from "@/components/dashboard/layout";
import { RoleSwitcher } from "@/components/super-admin/role-switcher";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <UserProvider>
      <DashboardLayoutUI>{children}</DashboardLayoutUI>
      <RoleSwitcher />
    </UserProvider>
  );
}

