"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useClerk } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Layers,
  Users,
  CalendarDays,
  CalendarCheck,
  GraduationCap,
  Building2,
  LogOut,
  BookOpen,
  HeartPulse,
  Settings,
  CreditCard,
  TrendingUp,
  MessageCircle,
  LayoutGrid,
  Calendar,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const routes = {
  admin: [
    { section: "General", items: [
      { href: "/dashboard/admin",             icon: LayoutDashboard, label: "Dashboard"   },
      { href: "/dashboard/admin/sections",    icon: BookOpen,        label: "Sections"    },
      { href: "/dashboard/admin/users",       icon: Users,           label: "Users"       },
      { href: "/dashboard/admin/analytics",   icon: TrendingUp,      label: "Analytics"   },
      { href: "/dashboard/admin/settings",    icon: Settings,        label: "Settings"    },
    ]},
  ],
  trainer: [
    { section: "General", items: [
      { href: "/dashboard/trainer",             icon: LayoutDashboard, label: "Dashboard"     },
      { href: "/dashboard/trainer/sections",    icon: LayoutGrid,      label: "My Sections"   },
      { href: "/dashboard/trainer/attendance",  icon: CalendarCheck,   label: "Mark Attendance"},
      { href: "/dashboard/trainer/sessions",    icon: Calendar,        label: "Session Planner"},
    ]},
  ],
  student: [
    { section: "General", items: [
      { href: "/dashboard/student",            icon: LayoutDashboard, label: "Dashboard"    },
      { href: "/dashboard/student/attendance", icon: CalendarCheck,   label: "Attendance"   },
      { href: "/dashboard/student/grades",     icon: TrendingUp,      label: "My Grades"    },
      { href: "/dashboard/student/modules",    icon: BookOpen,        label: "Modules & Docs"},
      { href: "/dashboard/student/queries",    icon: MessageCircle,   label: "Ask a Query"  },
    ]},
  ],
  super_admin: [
    { section: "Platform", items: [
      { href: "/super-admin", label: "Overview", icon: LayoutDashboard },
      { href: "/super-admin/orgs", label: "Organizations", icon: Building2 },
      { href: "/super-admin/health", label: "Health", icon: HeartPulse },
    ]},
  ],
};

const rolePlanLabel: Record<string, string> = {
  super_admin: "SUPER ADMIN",
  admin: "ADMIN PANEL",
  trainer: "TRAINER PANEL",
  student: "TRAINEE PORTAL",
};

export default function Sidebar() {
  const { profile } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const email = profile?.email || "";
  const role = profile?.role || "";
  
  const { signOut } = useClerk();
  
  async function handleLogout() {
    await signOut({ redirectUrl: '/sign-in' });
  }
  const initial = email.charAt(0).toUpperCase() || "U";
  const displayName = email.split("@")[0] || "User";

  const groups = role && routes[role as keyof typeof routes]
    ? routes[role as keyof typeof routes]
    : [];

  return (
    <aside className="w-[264px] shrink-0 flex flex-col h-full bg-white border-r border-[#eef1f6] select-none">
      {/* Brand */}
      <div className="px-7 pt-7 pb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9ca8c2] mb-1.5">
          {rolePlanLabel[role || ""] || "PLATFORM"}
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] bg-[#1c2434] flex items-center justify-center">
            <BookOpen className="w-[18px] h-[18px] text-white" />
          </div>
          <span className="text-[17px] font-extrabold text-[#1c2434] tracking-tight">TMS Platform</span>
        </div>
      </div>

      <div className="mx-6 h-px bg-[#eef1f6]" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-5 pt-5 space-y-0.5">
        {groups.map((group: any) => (
          <div key={group.section} className="space-y-0.5">
            <p className="px-3 pt-4 pb-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9ca8c2]">
              {group.section}
            </p>
            {group.items.map((link: any) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-[12px] rounded-[14px] text-[13.5px] font-semibold transition-all duration-150",
                    isActive
                      ? "bg-[#edf7f3] text-[#2eb67d]"
                      : "text-[#7a849b] hover:text-[#1c2434] hover:bg-[#f6f8fb]"
                  )}
                >
                  <Icon
                    className={cn("w-[18px] h-[18px] shrink-0")}
                    strokeWidth={isActive ? 2 : 1.7}
                  />
                  {link.label}
                </Link>
              );
            })}
          </div>
        ))}

        {/* Extra links */}
        <div className="space-y-0.5">
          <p className="px-3 pt-6 pb-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9ca8c2]">
            Support
          </p>
          <button className="flex items-center gap-3 px-4 py-[12px] rounded-[14px] text-[13.5px] font-semibold text-[#7a849b] hover:text-[#1c2434] hover:bg-[#f6f8fb] transition-all w-full">
            <Settings className="w-[18px] h-[18px]" strokeWidth={1.7} />
            Settings
          </button>
          <button className="flex items-center gap-3 px-4 py-[12px] rounded-[14px] text-[13.5px] font-semibold text-[#7a849b] hover:text-[#1c2434] hover:bg-[#f6f8fb] transition-all w-full">
            <HelpCircle className="w-[18px] h-[18px]" strokeWidth={1.7} />
            Help Center
          </button>
        </div>
      </nav>

      {/* User */}
      <div className="px-5 pb-5">
        <div className="mx-1 h-px bg-[#eef1f6] mb-4" />
        <div className="flex items-center gap-3 px-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2eb67d] to-[#1c9963] flex items-center justify-center text-[13px] font-bold text-white">
              {initial}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#2eb67d] ring-2 ring-white" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[13px] font-bold text-[#1c2434] truncate capitalize">{displayName}</p>
            <p className="text-[11px] text-[#9ca8c2] font-medium capitalize">{(role || "").replace("_", " ")}</p>
          </div>
          <button onClick={handleLogout} className="p-2 rounded-[10px] text-[#9ca8c2] hover:text-[#e74c3c] hover:bg-red-50 transition-all">
            <LogOut className="w-4 h-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </aside>
  );
}
