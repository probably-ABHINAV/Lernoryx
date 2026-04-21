"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Mail, Shield, Trash2, Plus, Copy, Check } from "lucide-react";
import { Header } from "@/components/dashboard/header";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  admin:     { label: "Admin",    color: "#1c2434", bg: "#eef1f6" },
  trainer:   { label: "Trainer",  color: "#185fa5", bg: "#e6f1fb" },
  student:   { label: "Student",  color: "#2eb67d", bg: "#edf7f3" },
  pending:   { label: "Pending",  color: "#e8b931", bg: "#fefce8" },
};

export function UsersManagerClient() {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "student" });
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const { data: usersData, isLoading: usersLoading, mutate: mutateUsers } = useSWR("/api/admin/users", fetcher);
  const { data: invitesData, mutate: mutateInvites } = useSWR("/api/admin/invites", fetcher);

  const users = usersData?.users ?? [];
  const invites = invitesData?.invites ?? [];
  const filtered = roleFilter === "all" ? users : users.filter((u: any) => u.role === roleFilter);

  async function handleRoleChange(userId: string, role: string) {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });
    if (res.ok) { toast.success("Role updated"); mutateUsers(); }
    else toast.error("Failed to update role");
  }

  async function handleRemove(userId: string) {
    if (!confirm("Remove this user from the organization?")) return;
    const res = await fetch(`/api/admin/users?userId=${userId}`, { method: "DELETE" });
    if (res.ok) { toast.success("User removed"); mutateUsers(); }
    else toast.error("Failed to remove user");
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/admin/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inviteForm),
    });
    const data = await res.json();
    if (res.ok) {
      setInviteLink(data.inviteLink);
      mutateInvites();
    } else {
      toast.error(data.error ?? "Failed to create invite");
    }
    setSubmitting(false);
  }

  async function handleCopyLink() {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Invite link copied!");
  }

  async function handleRevokeInvite(id: string) {
    const res = await fetch(`/api/admin/invites?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Invite revoked"); mutateInvites(); }
  }

  return (
    <div className="space-y-6">
      <Header title="User Management" subtitle={`${users.length} members in your organization`}>
        <button onClick={() => { setShowInviteForm(!showInviteForm); setInviteLink(null); }} className="flex items-center gap-2 px-4 py-2 bg-[#2eb67d] text-white rounded-[12px] text-[13px] font-bold hover:bg-[#27a06e]">
          <Plus size={16} />
          Invite Member
        </button>
      </Header>

      {showInviteForm && (
        <div className="bg-white rounded-[20px] border border-[#2eb67d]/30 p-6">
          <h3 className="text-[14px] font-extrabold text-[#1c2434] mb-4">Invite New Member</h3>
          {!inviteLink ? (
            <form onSubmit={handleInvite} className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2] mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-[12px] border border-[#eef1f6] bg-[#f8fafb] text-[13px] text-[#1c2434] focus:outline-none focus:border-[#2eb67d]"
                  placeholder="colleague@company.com"
                  required
                />
              </div>
              <div className="w-36">
                <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2] mb-1.5">Role</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-[12px] border border-[#eef1f6] bg-[#f8fafb] text-[13px] font-bold text-[#1c2434] focus:outline-none focus:border-[#2eb67d]"
                >
                  <option value="student">Student</option>
                  <option value="trainer">Trainer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-[#2eb67d] text-white rounded-[12px] text-[13px] font-bold hover:bg-[#27a06e] disabled:opacity-50 whitespace-nowrap">
                {submitting ? "Generating…" : "Generate Invite"}
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <p className="text-[13px] font-bold text-[#1c2434]">Invite link generated for <span className="text-[#2eb67d]">{inviteForm.email}</span></p>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2.5 rounded-[12px] bg-[#f8fafb] border border-[#eef1f6] text-[12px] text-[#7a849b] font-mono truncate">
                  {inviteLink}
                </div>
                <button onClick={handleCopyLink} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-[12px] text-[12px] font-bold transition-colors ${copied ? "bg-[#edf7f3] text-[#2eb67d]" : "bg-[#1c2434] text-white hover:bg-[#2a3549]"}`}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
              <p className="text-[11px] text-[#9ca8c2]">Link expires in 7 days. Share it directly with the invitee.</p>
              <button onClick={() => { setInviteLink(null); setInviteForm({ email: "", role: "student" }); setShowInviteForm(false); }} className="text-[12px] text-[#7a849b] hover:underline">
                Done
              </button>
            </div>
          )}
        </div>
      )}

      {/* Role filter */}
      <div className="flex gap-2">
        {["all", "admin", "trainer", "student", "pending"].map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-3 py-1.5 rounded-[10px] text-[12px] font-bold capitalize transition-colors ${
              roleFilter === role
                ? "bg-[#1c2434] text-white"
                : "bg-white border border-[#eef1f6] text-[#7a849b] hover:bg-[#f6f8fb]"
            }`}
          >
            {role === "all" ? `All (${users.length})` : role}
          </button>
        ))}
      </div>

      {/* Users table */}
      <div className="bg-white rounded-[20px] border border-[#eef1f6] overflow-hidden">
        {usersLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 bg-[#f8fafb] rounded-[12px] animate-pulse" />)}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#eef1f6]">
                <th className="text-left p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">User</th>
                <th className="text-center p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">Role</th>
                <th className="text-center p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">Joined</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((u: any) => {
                const cfg = ROLE_CONFIG[u.role] ?? ROLE_CONFIG["pending"];
                return (
                  <tr key={u.id} className="border-b border-[#f8fafb] hover:bg-[#f8fafb] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2eb67d] to-[#1c9963] flex items-center justify-center text-white text-[11px] font-bold">
                          {u.email[0].toUpperCase()}
                        </div>
                        <span className="text-[13px] font-bold text-[#1c2434]">{u.email}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="px-3 py-1.5 rounded-[10px] text-[12px] font-bold border-0 focus:outline-none focus:ring-1 focus:ring-[#2eb67d] cursor-pointer"
                        style={{ backgroundColor: cfg.bg, color: cfg.color }}
                      >
                        <option value="admin">Admin</option>
                        <option value="trainer">Trainer</option>
                        <option value="student">Student</option>
                        <option value="pending">Pending</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-[12px] text-[#9ca8c2]">
                        {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(u.created_at))}
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleRemove(u.id)} className="p-2 rounded-[10px] hover:bg-[#fef2f2] text-[#9ca8c2] hover:text-[#e74c3c] transition-colors ml-auto block">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pending invites */}
      {invites.filter((i: any) => i.status === "pending").length > 0 && (
        <div className="bg-white rounded-[20px] border border-[#eef1f6] p-6">
          <h3 className="text-[14px] font-extrabold text-[#1c2434] mb-4">Pending Invites</h3>
          <div className="space-y-2">
            {invites.filter((i: any) => i.status === "pending").map((invite: any) => (
              <div key={invite.id} className="flex items-center justify-between p-3 rounded-[12px] bg-[#fefce8] border border-[#e8b931]/20">
                <div className="flex items-center gap-3">
                  <Mail size={14} className="text-[#e8b931]" />
                  <span className="text-[13px] font-bold text-[#1c2434]">{invite.email}</span>
                  <span className="text-[11px] text-[#9ca8c2]">·</span>
                  <span className="text-[11px] font-bold text-[#7a849b] capitalize">{invite.role}</span>
                </div>
                <button onClick={() => handleRevokeInvite(invite.id)} className="text-[11px] font-bold text-[#e74c3c] hover:underline">
                  Revoke
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
