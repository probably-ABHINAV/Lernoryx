import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SuperAdminPage() {
  const user = await requireAuth();
  
  if (user.profile?.role !== "super_admin") {
    redirect("/dashboard");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Super Admin Platform</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage all organizations and platform functionality.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold">Organizations</h2>
          <p className="mt-4 text-3xl font-bold">12</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold">Total Platform Users</h2>
          <p className="mt-4 text-3xl font-bold">5,340</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold">Platform Revenue</h2>
          <p className="mt-4 text-3xl font-bold">$125,000</p>
        </div>
      </div>
    </div>
  );
}
