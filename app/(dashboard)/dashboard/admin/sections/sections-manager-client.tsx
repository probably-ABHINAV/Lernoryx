"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Users, BookOpen, ToggleLeft, ToggleRight } from "lucide-react";
import { Header } from "@/components/dashboard/header";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface SectionForm { name: string; description: string; maxCapacity: number }
const DEFAULT_FORM: SectionForm = { name: "", description: "", maxCapacity: 30 };

export function SectionsManagerClient() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SectionForm>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data, isLoading, mutate } = useSWR("/api/admin/sections", fetcher);
  const sections = data?.sections ?? [];

  function openCreate() { setForm(DEFAULT_FORM); setEditingId(null); setShowForm(true); }
  function openEdit(s: any) { setForm({ name: s.name, description: s.description ?? "", maxCapacity: s.max_capacity }); setEditingId(s.id); setShowForm(true); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const method = editingId ? "PATCH" : "POST";
    const body = editingId ? { id: editingId, ...form } : form;

    const res = await fetch("/api/admin/sections", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description || undefined,
        maxCapacity: form.maxCapacity,
        ...(editingId ? { id: editingId } : {}),
      }),
    });

    if (res.ok) {
      toast.success(editingId ? "Section updated" : "Section created");
      setShowForm(false);
      setEditingId(null);
      setForm(DEFAULT_FORM);
      mutate();
    } else {
      const err = await res.json();
      toast.error(err.error ?? "Failed to save");
    }
    setSaving(false);
  }

  async function handleToggleActive(id: string, current: boolean) {
    const res = await fetch("/api/admin/sections", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !current }),
    });
    if (res.ok) { toast.success(`Section ${!current ? "activated" : "deactivated"}`); mutate(); }
    else toast.error("Failed to update");
  }

  async function handleDelete(id: string, force = false) {
    const res = await fetch(`/api/admin/sections?id=${id}${force ? "&force=true" : ""}`, { method: "DELETE" });

    if (res.status === 409) {
      const data = await res.json();
      if (confirm(`This section has ${data.enrollmentCount} enrolled students. Delete anyway and remove all enrollments?`)) {
        return handleDelete(id, true);
      }
      return;
    }

    if (res.ok) { toast.success("Section deleted"); setDeleteConfirm(null); mutate(); }
    else { const err = await res.json(); toast.error(err.error ?? "Failed to delete"); }
  }

  return (
    <div className="space-y-6">
      <Header title="Training Sections" subtitle="Manage all training batches in your organization">
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-[#2eb67d] text-white rounded-[12px] text-[13px] font-bold hover:bg-[#27a06e] transition-colors">
          <Plus size={16} />
          New Section
        </button>
      </Header>

      {showForm && (
        <div className="bg-white rounded-[20px] border border-[#2eb67d]/30 p-6">
          <h3 className="text-[14px] font-extrabold text-[#1c2434] mb-4">
            {editingId ? "Edit Section" : "Create New Section"}
          </h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2] mb-1.5">Section Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-[12px] border border-[#eef1f6] bg-[#f8fafb] text-[13px] font-bold text-[#1c2434] focus:outline-none focus:border-[#2eb67d]"
                required
                placeholder="e.g. Leadership Workshop Q1"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2] mb-1.5">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2.5 rounded-[12px] border border-[#eef1f6] bg-[#f8fafb] text-[13px] text-[#1c2434] placeholder:text-[#9ca8c2] focus:outline-none focus:border-[#2eb67d]"
                placeholder="Optional description…"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2] mb-1.5">Max Capacity</label>
              <input
                type="number"
                value={form.maxCapacity}
                onChange={(e) => setForm({ ...form, maxCapacity: parseInt(e.target.value) || 30 })}
                min={1}
                max={500}
                className="w-full px-3 py-2.5 rounded-[12px] border border-[#eef1f6] bg-[#f8fafb] text-[13px] font-bold text-[#1c2434] focus:outline-none focus:border-[#2eb67d]"
              />
            </div>
            <div className="lg:col-span-3 flex gap-3">
              <button type="submit" disabled={saving} className="px-5 py-2.5 bg-[#2eb67d] text-white rounded-[12px] text-[13px] font-bold hover:bg-[#27a06e] disabled:opacity-50">
                {saving ? "Saving…" : editingId ? "Update Section" : "Create Section"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-5 py-2.5 border border-[#eef1f6] text-[#7a849b] rounded-[12px] text-[13px] font-bold hover:bg-[#f6f8fb]">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-white rounded-[20px] border border-[#eef1f6] animate-pulse" />)}
        </div>
      ) : sections.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-[#eef1f6] p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-[#edf7f3] flex items-center justify-center mx-auto mb-4">
            <BookOpen size={22} className="text-[#2eb67d]" />
          </div>
          <p className="text-[15px] font-extrabold text-[#1c2434] mb-2">No sections yet</p>
          <p className="text-[13px] text-[#9ca8c2] mb-5">Create your first training batch to get started</p>
          <button onClick={openCreate} className="px-5 py-2.5 bg-[#2eb67d] text-white rounded-[12px] text-[13px] font-bold hover:bg-[#27a06e]">
            Create Section
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[20px] border border-[#eef1f6] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#eef1f6]">
                <th className="text-left p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">Section</th>
                <th className="text-center p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">Students</th>
                <th className="text-center p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">Sessions</th>
                <th className="text-center p-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2]">Status</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {sections.map((section: any) => (
                <tr key={section.id} className="border-b border-[#f8fafb] hover:bg-[#f8fafb] transition-colors">
                  <td className="p-4">
                    <p className="text-[13px] font-bold text-[#1c2434]">{section.name}</p>
                    <p className="text-[11px] text-[#9ca8c2]">{section.description ?? "No description"}</p>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users size={12} className="text-[#9ca8c2]" />
                      <span className="text-[12px] font-bold text-[#7a849b]">
                        {section.enrollments?.[0]?.count ?? 0}/{section.max_capacity}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-[12px] font-bold text-[#7a849b]">
                      {section.sessions?.[0]?.count ?? 0}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleActive(section.id, section.is_active)}
                      className="flex items-center gap-1.5 mx-auto"
                    >
                      {section.is_active
                        ? <ToggleRight size={18} className="text-[#2eb67d]" />
                        : <ToggleLeft size={18} className="text-[#9ca8c2]" />}
                      <span className={`text-[11px] font-bold ${section.is_active ? "text-[#2eb67d]" : "text-[#9ca8c2]"}`}>
                        {section.is_active ? "Active" : "Inactive"}
                      </span>
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(section)} className="p-2 rounded-[10px] hover:bg-[#f0f3f8] text-[#9ca8c2] hover:text-[#1c2434] transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(section.id)} className="p-2 rounded-[10px] hover:bg-[#fef2f2] text-[#9ca8c2] hover:text-[#e74c3c] transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
