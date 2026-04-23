"use client";

import { useTransition } from "react";
import { setImpersonateRole } from "@/app/actions/impersonate";
import { useUser } from "@/hooks/useUser";
import { Eye, ShieldAlert } from "lucide-react";

const roles = ["super_admin", "admin", "trainer", "student"] as const;

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  trainer: "Trainer",
  student: "Student",
};

export function RoleSwitcher() {
  const { profile } = useUser();
  const [isPending, startTransition] = useTransition();

  // useUser hook typically returns profile.actual_role based on requireAuth logic
  const actualRole = profile?.actual_role || profile?.actualRole;
  const currentRole = profile?.role;

  if (actualRole !== "super_admin") return null;

  const handleSwitch = (newRole: string | null) => {
    startTransition(async () => {
      await setImpersonateRole((newRole || "super_admin") as any);
      window.location.href = newRole && newRole !== "super_admin" ? "/dashboard" : "/super-admin";
    });
  };

  const isImpersonating = currentRole && currentRole !== "super_admin";

  return (
    <>
      {/* 1. Persistent Top Banner (Visible everywhere when impersonating) */}
      {isImpersonating && (
        <div className="fixed top-0 left-0 w-full z-[100] bg-[#e8b931] text-[#1c2434] py-1.5 px-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} className="text-[#1c2434]" />
            <p className="text-[12px] font-extrabold uppercase tracking-widest">
              SUPER ADMIN IMPERSONATION: {roleLabels[currentRole]}
            </p>
          </div>
          <button
            onClick={() => handleSwitch("super_admin")}
            disabled={isPending}
            className="text-[11px] font-bold bg-[#1c2434] text-white px-3 py-1 rounded-[6px] hover:bg-black transition-colors"
          >
            END IMPERSONATION
          </button>
        </div>
      )}

      {/* 2. Floating Role Switcher */}
      <div className="fixed bottom-6 right-6 z-[90] flex items-center gap-1 bg-white px-2.5 py-2 rounded-[16px] shadow-xl shadow-black/5 ring-1 ring-[#eef1f6]">
        <div className="w-9 h-9 rounded-[10px] bg-[#f6f8fb] flex items-center justify-center mr-1">
          <Eye className="w-4 h-4 text-[#9ca8c2]" strokeWidth={2} />
        </div>
        {roles.map((r) => {
          const isActive = currentRole === r;
          return (
            <button
              key={r}
              onClick={() => handleSwitch(r)}
              disabled={isPending}
              className={`
                px-4 py-2 rounded-[10px] text-[12px] font-bold transition-all duration-200
                ${isActive
                  ? "bg-[#1c2434] text-white shadow-lg shadow-[#1c2434]/15"
                  : "text-[#7a849b] hover:bg-[#f6f8fb] hover:text-[#1c2434]"
                }
                ${isPending ? "opacity-50 cursor-wait" : ""}
              `}
            >
              {roleLabels[r]}
            </button>
          );
        })}
      </div>
    </>
  );
}
