"use client";

import { useState, useRef } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Search, Plus, Pause, Play, Trash2, Download, ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import { Header } from "@/components/dashboard/header";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const PLAN_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  free:       { label: "Free",       color: "#9ca8c2", bg: "#f0f3f8" },
  starter:    { label: "Starter",    color: "#2eb67d", bg: "#edf7f3" },
  pro:        { label: "Pro",        color: "#185fa5", bg: "#e6f1fb" },
  enterprise: { label: "Enterprise", color: "#1c2434", bg: "#eef1f6" },
};

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  active:    { color: "#2eb67d", bg: "#edf7f3" },
  suspended: { color: "#e8b931", bg: "#fefce8" },
  deleted:   { color: "#e74c3c", bg: "#fef2f2" },
};

export function OrgsClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", plan: "free", seatLimit: 10 });
  const [creating, setCreating] = useState(false);

  const { data, isLoading, mutate } = useSWR(
    `/api/super-admin/orgs?page=${page}&limit=20&q=${debouncedSearch}`,
    fetcher
  );

  const orgs       = data?.orgs ?? [];
  const total      = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  function handleSearch(v: string) {
    setSearch(v);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => { setDebouncedSearch(v); setPage(1); }, 400);
  }

  async function handleAction(id: string, action: string, extra?: Record<string, unknown>) {
    const res = await fetch("/api/super-admin/orgs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action, ...extra }),
    });
    if (res.ok) { toast.success(`Done: ${action}`); mutate(); }
    else { const err = await res.json(); toast.error(err.error ?? "Failed"); }
  }

  async function handleDelete(id: string, name: string) {
    const input = prompt(`Type the organization name "${name}" to confirm permanent deletion:`);
    if (input !== name) { toast.error("Name did not match — deletion cancelled"); return; }
    const res = await fetch(`/api/super-admin/orgs?id=${id}&confirm=DELETE`, { method: "DELETE" });
    if (res.ok) { toast.success("Organization deleted"); mutate(); }
    else { const err = await res.json(); toast.error(err.error ?? "Failed"); }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const res = await fetch("/api/super-admin/orgs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: createForm.name, plan: createForm.plan, seatLimit: createForm.seatLimit }),
    });
    if (res.ok) {
      toast.success("Organization created");
      setShowCreate(false);
      setCreateForm({ name: "", plan: "free", seatLimit: 10 });
      mutate();
    } else {
      const err = await res.json();
      toast.error(err.error ?? "Failed to create org");
    }
    setCreating(false);
  }

  function handleExport(orgId: string) {
    window.open(`/api/super-admin/export?orgId=${orgId}&type=full`, "_blank");
  }

  return (
    <div className="space-y-6">
      <Header title="Organizations" subtitle={`${total} total organizations on the platform`}>
        <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 bg-[#2eb67d] text-white rounded-[12px] text-[13px] font-bold hover:bg-[#27a06e]">
          <Plus size={16} />
          New Org
        </button>
      </Header>

      {showCreate && (
        <div className="bg-white rounded-[20px] border border-[#2eb67d]/30 p-6">
          <h3 className="text-[14px] font-extrabold text-[#1c2434] mb-4">Create New Organization</h3>
          <form onSubmit={handleCreate} className="flex items-end gap-4 flex-wrap">
            <div className="flex-1 min-w-48">
              <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2] mb-1.5">Name</label>
              <input
                type="text"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-[12px] border border-[#eef1f6] bg-[#f8fafb] text-[13px] font-bold text-[#1c2434] focus:outline-none focus:border-[#2eb67d]"
                required
                placeholder="Acme Corp"
              />
            </div>
            <div className="w-36">
              <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2] mb-1.5">Plan</label>
              <select
                value={createForm.plan}
                onChange={(e) => setCreateForm({ ...createForm, plan: e.target.value })}
                className="w-full px-3 py-2.5 rounded-[12px] border border-[#eef1f6] bg-[#f8fafb] text-[13px] font-bold text-[#1c2434] focus:outline-none focus:border-[#2eb67d]"
              >
                <option value="free">Free</option>
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div className="w-28">
              <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2] mb-1.5">Seat Limit</label>
              <input
                type="number"
                value={createForm.seatLimit}
                onChange={(e) => setCreateForm({ ...createForm, seatLimit: parseInt(e.target.value) || 10 })}
                min={1}
                className="w-full px-3 py-2.5 rounded-[12px] border border-[#eef1f6] bg-[#f8fafb] text-[13px] font-bold text-[#1c2434] text-center focus:outline-none focus:border-[#2eb67d]"
              />
            </div>
            <button type="submit" disabled={creating} className="px-5 py-2.5 bg-[#2eb67d] text-white rounded-[12px] text-[13px] font-bold hover:bg-[#27a06e] disabled:opacity-50">
              {creating ? "Creating…" : "Create"}
            </button>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca8c2]" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search organizations…"
          className="w-full max-w-sm pl-9 pr-4 py-2.5 rounded-[12px] border border-[#eef1f6] bg-white text-[13px] text-[#1c2434] placeholder:text-[#9ca8c2] focus:outline-none focus:border-[#2eb67d]"
        />
      </div>

      {/* Orgs table */}
      <div className="bg-white rounded-[20px] border border-[#eef1f6] overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-14 bg-[#f8fafb] rounded-[12px] animate-pulse" />)}
          </div>
        ) : orgs.length === 0 ? (
          <div className="p-16 text-center">
            <Building2 size={22} className="text-[#2eb67d] mx-auto mb-3" />
            <p className="text-[13px] text-[#9ca8c2]">No organizations found</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#eef1f6]">
                  <th className="text-left p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">Organization</th>
                  <th className="text-center p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">Plan</th>
                  <th className="text-center p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">Users</th>
                  <th className="text-center p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">Status</th>
                  <th className="text-center p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">Created</th>
                  <th className="p-4" />
                </tr>
              </thead>
              <tbody>
                {orgs.map((org: any) => {
                  const planCfg   = PLAN_CONFIG[org.plan]   ?? PLAN_CONFIG.free;
                  const statusCfg = STATUS_CONFIG[org.status] ?? STATUS_CONFIG.active;
                  return (
                    <tr key={org.id} className={`border-b border-[#f8fafb] transition-colors ${org.status === "suspended" ? "bg-[#fefce8]/40" : org.status === "deleted" ? "bg-[#fef2f2]/30 opacity-60" : "hover:bg-[#f8fafb]"}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-[10px] bg-[#edf7f3] flex items-center justify-center">
                            <Building2 size={14} className="text-[#2eb67d]" />
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-[#1c2434]">{org.name}</p>
                            <p className="text-[11px] font-mono text-[#9ca8c2]">{org.id.slice(0, 8)}…</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-[8px]" style={{ backgroundColor: planCfg.bg, color: planCfg.color }}>
                          {planCfg.label}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-[12px] font-bold text-[#7a849b]">{org.userCount}/{org.seat_limit}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-[8px] capitalize" style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}>
                          {org.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-[12px] text-[#9ca8c2]">
                          {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(org.created_at))}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          {org.status === "active" ? (
                            <button onClick={() => handleAction(org.id, "suspend")} title="Suspend" className="p-2 rounded-[10px] hover:bg-[#fefce8] text-[#9ca8c2] hover:text-[#e8b931] transition-colors">
                              <Pause size={13} />
                            </button>
                          ) : org.status === "suspended" ? (
                            <button onClick={() => handleAction(org.id, "restore")} title="Restore" className="p-2 rounded-[10px] hover:bg-[#edf7f3] text-[#9ca8c2] hover:text-[#2eb67d] transition-colors">
                              <Play size={13} />
                            </button>
                          ) : null}
                          <button onClick={() => handleExport(org.id)} title="Export data" className="p-2 rounded-[10px] hover:bg-[#e6f1fb] text-[#9ca8c2] hover:text-[#185fa5] transition-colors">
                            <Download size={13} />
                          </button>
                          {org.status !== "deleted" && (
                            <button onClick={() => handleDelete(org.id, org.name)} title="Delete" className="p-2 rounded-[10px] hover:bg-[#fef2f2] text-[#9ca8c2] hover:text-[#e74c3c] transition-colors">
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-[#eef1f6]">
                <span className="text-[12px] text-[#9ca8c2]">
                  Showing {((page - 1) * 20) + 1}–{Math.min(page * 20, total)} of {total}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-[8px] border border-[#eef1f6] disabled:opacity-40 hover:bg-[#f6f8fb] transition-colors"
                  >
                    <ChevronLeft size={14} className="text-[#7a849b]" />
                  </button>
                  <span className="text-[12px] font-bold text-[#1c2434]">{page} / {totalPages}</span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-[8px] border border-[#eef1f6] disabled:opacity-40 hover:bg-[#f6f8fb] transition-colors"
                  >
                    <ChevronRight size={14} className="text-[#7a849b]" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
