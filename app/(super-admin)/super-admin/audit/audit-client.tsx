"use client";

import { useState } from "react";
import useSWR from "swr";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Header } from "@/components/dashboard/header";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const ACTION_COLOR: Record<string, { color: string; bg: string }> = {
  created:  { color: "#2eb67d", bg: "#edf7f3" },
  deleted:  { color: "#e74c3c", bg: "#fef2f2" },
  updated:  { color: "#185fa5", bg: "#e6f1fb" },
  suspended:{ color: "#e8b931", bg: "#fefce8" },
  default:  { color: "#7a849b", bg: "#f0f3f8" },
};

function getActionColor(action: string) {
  if (action.includes("creat")) return ACTION_COLOR.created;
  if (action.includes("delet")) return ACTION_COLOR.deleted;
  if (action.includes("updat") || action.includes("toggl")) return ACTION_COLOR.updated;
  if (action.includes("suspend")) return ACTION_COLOR.suspended;
  return ACTION_COLOR.default;
}

export function AuditClient() {
  const [page, setPage]       = useState(1);
  const [orgId, setOrgId]     = useState("");
  const [action, setAction]   = useState("");

  const params = new URLSearchParams({ page: String(page), limit: "50" });
  if (orgId)  params.set("orgId", orgId);
  if (action) params.set("action", action);

  const { data, isLoading } = useSWR(`/api/super-admin/audit?${params}`, fetcher);
  const logs       = data?.logs ?? [];
  const total      = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <Header title="Audit Log" subtitle={`${total.toLocaleString()} total events across all organizations`} />

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca8c2]" />
          <input
            value={orgId}
            onChange={(e) => { setOrgId(e.target.value); setPage(1); }}
            placeholder="Filter by Org ID…"
            className="pl-8 pr-4 py-2 rounded-[12px] border border-[#eef1f6] bg-white text-[12px] font-mono text-[#1c2434] placeholder:text-[#9ca8c2] focus:outline-none focus:border-[#2eb67d] w-56"
          />
        </div>
        <input
          value={action}
          onChange={(e) => { setAction(e.target.value); setPage(1); }}
          placeholder="Filter by action…"
          className="px-3 py-2 rounded-[12px] border border-[#eef1f6] bg-white text-[12px] text-[#1c2434] placeholder:text-[#9ca8c2] focus:outline-none focus:border-[#2eb67d] w-48"
        />
        {(orgId || action) && (
          <button onClick={() => { setOrgId(""); setAction(""); setPage(1); }} className="px-3 py-2 text-[12px] font-bold text-[#e74c3c] hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {/* Log table */}
      <div className="bg-white rounded-[20px] border border-[#eef1f6] overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-10 bg-[#f8fafb] rounded-[10px] animate-pulse" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[13px] text-[#9ca8c2]">No log entries found</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#eef1f6]">
                  <th className="text-left p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">Action</th>
                  <th className="text-left p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">User</th>
                  <th className="text-left p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">Organization</th>
                  <th className="text-left p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">When</th>
                  <th className="text-left p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">Metadata</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log: any) => {
                  const cfg = getActionColor(log.action);
                  return (
                    <tr key={log.id} className="border-b border-[#f8fafb] hover:bg-[#f8fafb] transition-colors">
                      <td className="p-4">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-[8px]" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                          {log.action.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-[12px] font-bold text-[#1c2434]">{log.users?.email ?? "—"}</p>
                        <p className="text-[10px] text-[#9ca8c2] capitalize">{log.users?.role ?? ""}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-[12px] text-[#7a849b]">{log.organizations?.name ?? "—"}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-[12px] text-[#9ca8c2] whitespace-nowrap">
                          {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(log.created_at))}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-[11px] font-mono text-[#9ca8c2] max-w-[200px] truncate" title={JSON.stringify(log.metadata)}>
                          {log.metadata ? JSON.stringify(log.metadata) : "—"}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-[#eef1f6]">
                <span className="text-[12px] text-[#9ca8c2]">
                  {((page - 1) * 50) + 1}–{Math.min(page * 50, total)} of {total.toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-[8px] border border-[#eef1f6] disabled:opacity-40 hover:bg-[#f6f8fb]">
                    <ChevronLeft size={14} className="text-[#7a849b]" />
                  </button>
                  <span className="text-[12px] font-bold text-[#1c2434]">{page} / {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-[8px] border border-[#eef1f6] disabled:opacity-40 hover:bg-[#f6f8fb]">
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
