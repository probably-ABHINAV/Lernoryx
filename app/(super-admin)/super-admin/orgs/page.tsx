import type { Metadata } from "next";
import { requireAuth } from "@/lib/requireAuth";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Organizations",
  description: "Manage all organizations on the platform.",
};

export default async function SuperAdminOrgsPage() {
  const user = await requireAuth();
  if (!user.profile || user.profile.actual_role !== "super_admin") {
    redirect("/dashboard");
  }

  // Use service role client to bypass RLS for platform-wide visibility
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: orgs } = await supabase
    .from("organizations")
    .select("id, name, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const organizations = orgs || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Organizations</h1>
          <p className="text-sm text-slate-500">All registered organizations on the platform.</p>
        </div>
        <span className="text-xs text-slate-400">{organizations.length} total</span>
      </div>

      {organizations.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-sm text-slate-500">No organizations registered yet.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/60">
                <TableHead className="text-xs font-medium uppercase text-slate-500">Name</TableHead>
                <TableHead className="text-xs font-medium uppercase text-slate-500">ID</TableHead>
                <TableHead className="text-xs font-medium uppercase text-slate-500">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((org: any) => (
                <TableRow key={org.id} className="hover:bg-slate-50/40">
                  <TableCell className="text-sm font-medium text-slate-900">{org.name}</TableCell>
                  <TableCell className="text-xs font-mono text-slate-400">{org.id}</TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {org.created_at ? new Date(org.created_at).toLocaleDateString() : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
