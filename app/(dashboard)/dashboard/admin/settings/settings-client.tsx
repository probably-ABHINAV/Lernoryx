"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Header } from "@/components/dashboard/header";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const TIMEZONES = [
  "Asia/Kolkata", "UTC", "America/New_York", "America/Los_Angeles",
  "Europe/London", "Europe/Paris", "Asia/Tokyo", "Australia/Sydney",
];

export function SettingsClient() {
  const { data, isLoading, mutate } = useSWR("/api/admin/settings", fetcher, {
    onSuccess: (d) => {
      if (d?.settings) {
        setForm({
          timezone: d.settings.timezone ?? "Asia/Kolkata",
          logoUrl: d.settings.logo_url ?? "",
          notifyEmail: d.settings.notify_email ?? true,
          notifyBeforeSessionMinutes: d.settings.notify_before_session_minutes ?? 30,
        });
      }
    }
  });
  const [form, setForm] = useState({
    timezone: "Asia/Kolkata",
    logoUrl: "",
    notifyEmail: true,
    notifyBeforeSessionMinutes: 30,
  });
  const [saving, setSaving] = useState(false);



  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { toast.success("Settings saved"); mutate(); }
    else toast.error("Failed to save settings");
    setSaving(false);
  }

  if (isLoading) return (
    <div className="space-y-6">
      <Header title="Organization Settings" subtitle="" />
      <div className="bg-white rounded-[20px] border border-[#eef1f6] p-8 space-y-4">
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 bg-[#f8fafb] rounded-[12px] animate-pulse" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Header title="Organization Settings" subtitle="Configure your organization's preferences" />
      <form onSubmit={handleSave} className="space-y-4">
        <div className="bg-white rounded-[20px] border border-[#eef1f6] p-6 space-y-5">
          <h3 className="text-[14px] font-extrabold text-[#1c2434]">General</h3>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2] mb-1.5">Timezone</label>
            <select
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.target.value })}
              className="w-full max-w-xs px-3 py-2.5 rounded-[12px] border border-[#eef1f6] bg-[#f8fafb] text-[13px] font-bold text-[#1c2434] focus:outline-none focus:border-[#2eb67d]"
            >
              {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2] mb-1.5">Logo URL</label>
            <input
              type="url"
              value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              className="w-full max-w-md px-3 py-2.5 rounded-[12px] border border-[#eef1f6] bg-[#f8fafb] text-[13px] text-[#1c2434] placeholder:text-[#9ca8c2] focus:outline-none focus:border-[#2eb67d]"
              placeholder="https://your-cdn.com/logo.png"
            />
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-[#eef1f6] p-6 space-y-5">
          <h3 className="text-[14px] font-extrabold text-[#1c2434]">Notifications</h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-bold text-[#1c2434]">Email notifications</p>
              <p className="text-[12px] text-[#9ca8c2]">Send emails for invites and session reminders</p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, notifyEmail: !form.notifyEmail })}
              className={`w-11 h-6 rounded-full transition-colors relative ${form.notifyEmail ? "bg-[#2eb67d]" : "bg-[#eef1f6]"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${form.notifyEmail ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ca8c2] mb-1.5">
              Session reminder (minutes before)
            </label>
            <input
              type="number"
              value={form.notifyBeforeSessionMinutes}
              onChange={(e) => setForm({ ...form, notifyBeforeSessionMinutes: parseInt(e.target.value) || 30 })}
              min={0}
              max={1440}
              className="w-24 px-3 py-2.5 rounded-[12px] border border-[#eef1f6] bg-[#f8fafb] text-[13px] font-bold text-[#1c2434] text-center focus:outline-none focus:border-[#2eb67d]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-[#2eb67d] text-white rounded-[12px] text-[13px] font-bold hover:bg-[#27a06e] disabled:opacity-50 transition-colors">
            <Save size={15} />
            {saving ? "Saving…" : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
