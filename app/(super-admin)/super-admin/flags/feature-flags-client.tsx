"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Globe, Building2 } from "lucide-react";
import { Header } from "@/components/dashboard/header";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function Toggle({ enabled, onToggle, loading }: { enabled: boolean; onToggle: () => void; loading?: boolean }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={loading}
      className={`w-11 h-6 rounded-full transition-colors relative disabled:opacity-50 ${enabled ? "bg-[#2eb67d]" : "bg-[#eef1f6]"}`}
    >
      <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

export function FeatureFlagsClient() {
  const [orgId, setOrgId] = useState<string>("");
  const [saving, setSaving] = useState<string | null>(null);

  // Platform-wide defaults
  const { data: platformData, mutate: mutatePlatform } = useSWR("/api/super-admin/feature-flags", fetcher);

  // Per-org overrides (only when orgId is set)
  const { data: orgData, mutate: mutateOrg } = useSWR(
    orgId ? `/api/super-admin/feature-flags?orgId=${orgId}` : null,
    fetcher
  );

  const { data: orgsData } = useSWR("/api/super-admin/orgs?limit=100", fetcher);

  const platformFlags = platformData?.flags ?? [];
  const orgFlags      = orgData?.flags ?? [];
  const displayFlags  = orgId ? orgFlags : platformFlags;

  async function handleToggle(flagName: string, currentEnabled: boolean, forOrgId?: string) {
    const key = `${forOrgId ?? "platform"}_${flagName}`;
    setSaving(key);

    const res = await fetch("/api/super-admin/feature-flags", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flagName,
        enabled: !currentEnabled,
        orgId: forOrgId ?? null,
      }),
    });

    if (res.ok) {
      toast.success(`${flagName} ${!currentEnabled ? "enabled" : "disabled"}${forOrgId ? " for org" : " platform-wide"}`);
      if (forOrgId) mutateOrg(); else mutatePlatform();
    } else {
      toast.error("Failed to update flag");
    }
    setSaving(null);
  }

  return (
    <div className="space-y-6">
      <Header title="Feature Flags" subtitle="Control feature availability platform-wide or per organization" />

      {/* Scope selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOrgId("")}
          className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-[13px] font-bold transition-colors ${
            !orgId ? "bg-[#1c2434] text-white" : "bg-white border border-[#eef1f6] text-[#7a849b] hover:bg-[#f6f8fb]"
          }`}
        >
          <Globe size={14} />
          Platform Defaults
        </button>
        <div className="relative">
          <Building2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca8c2]" />
          <select
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
            className={`pl-8 pr-4 py-2 rounded-[12px] text-[13px] font-bold border transition-colors focus:outline-none ${
              orgId
                ? "bg-[#1c2434] text-white border-transparent"
                : "bg-white border-[#eef1f6] text-[#7a849b] hover:bg-[#f6f8fb]"
            }`}
          >
            <option value="">Per Organization…</option>
            {(orgsData?.orgs ?? []).map((o: any) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </div>
      </div>

      {orgId && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#e6f1fb] rounded-[12px]">
          <Building2 size={14} className="text-[#185fa5]" />
          <p className="text-[12px] font-bold text-[#185fa5]">
            Showing overrides for: {orgsData?.orgs?.find((o: any) => o.id === orgId)?.name ?? orgId}
          </p>
          <span className="text-[11px] text-[#185fa5]/70">— Changes override the platform default for this org only</span>
        </div>
      )}

      {/* Flags table */}
      <div className="bg-white rounded-[20px] border border-[#eef1f6] overflow-hidden">
        <div className="p-5 border-b border-[#eef1f6]">
          <h3 className="text-[14px] font-extrabold text-[#1c2434]">
            {orgId ? "Organization Overrides" : "Platform Feature Flags"}
          </h3>
        </div>
        <div className="divide-y divide-[#f8fafb]">
          {displayFlags.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-[13px] text-[#9ca8c2]">No feature flags configured</p>
            </div>
          ) : (
            displayFlags.map((flag: any) => {
              const saveKey = `${orgId || "platform"}_${flag.flag_name}`;
              return (
                <div key={flag.flag_name} className="flex items-center justify-between p-5 hover:bg-[#f8fafb] transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-bold text-[#1c2434] font-mono">{flag.flag_name}</p>
                      {flag.hasOverride && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-[8px] bg-[#e6f1fb] text-[#185fa5]">
                          org override
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#9ca8c2] mt-0.5">{flag.description ?? ""}</p>
                  </div>
                  <Toggle
                    enabled={flag.enabled}
                    loading={saving === saveKey}
                    onToggle={() => handleToggle(flag.flag_name, flag.enabled, orgId || undefined)}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
