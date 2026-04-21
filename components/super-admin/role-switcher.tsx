"use client";

import { useTransition } from "react";
import { setImpersonateRole } from "@/app/actions/impersonate";
import { useUser } from "@/hooks/useUser";
import { Eye } from "lucide-react";

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

  const actualRole = profile?.actualRole;
  const currentRole = profile?.role;

  if (actualRole !== "super_admin") return null;

  const handleSwitch = (newRole: string | null) => {
    startTransition(async () => {
      await setImpersonateRole(newRole as any);
      window.location.href = newRole ? "/dashboard" : "/super-admin";
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-1 bg-white px-2.5 py-2 rounded-[16px] shadow-xl shadow-black/5 ring-1 ring-[#eef1f6]">
      <div className="w-9 h-9 rounded-[10px] bg-[#f6f8fb] flex items-center justify-center mr-1">
        <Eye className="w-4 h-4 text-[#9ca8c2]" strokeWidth={2} />
      </div>
      {roles.map((r) => {
        const isActive = currentRole === r;
        return (
          <button
            key={r}
            onClick={() => handleSwitch(r === "super_admin" ? null : r)}
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
  );
}
