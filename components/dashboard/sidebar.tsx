"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { 
  LayoutDashboard, 
  Layers, 
  Users, 
  CalendarDays, 
  CalendarCheck, 
  GraduationCap, 
  Building2 
} from "lucide-react";
import { cn } from "@/lib/utils";

const routes = {
  admin: [
    { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/admin/sections", label: "Sections", icon: Layers },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
  ],
  trainer: [
    { href: "/dashboard/trainer", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/trainer/sessions", label: "Sessions", icon: CalendarDays },
    { href: "/dashboard/trainer/attendance", label: "Attendance", icon: CalendarCheck },
  ],
  student: [
    { href: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/student/attendance", label: "Attendance", icon: CalendarCheck },
    { href: "/dashboard/student/grades", label: "Grades", icon: GraduationCap },
  ],
  super_admin: [
    { href: "/super-admin", label: "Overview", icon: LayoutDashboard },
    { href: "/super-admin/orgs", label: "Organizations", icon: Building2 },
  ],
};

export default function Sidebar() {
  const { role } = useUser();
  const pathname = usePathname();

  const links = role && routes[role as keyof typeof routes] ? routes[role as keyof typeof routes] : [];

  return (
    <div className="w-64 bg-slate-950 text-slate-300 p-5 flex flex-col h-full border-r border-slate-800">
      <div className="mb-8 px-3">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm">
            T
          </div>
          TMS
        </h2>
      </div>

      <nav className="space-y-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 py-2.5 px-3 rounded-md transition-all font-medium text-sm",
                isActive 
                  ? "bg-indigo-600 text-white shadow-sm" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-indigo-200" : "text-slate-400")} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      
      {role && (
        <div className="mt-auto px-3 py-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 uppercase text-xs font-bold">
              {role.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-medium text-white capitalize">{role.replace("_", " ")}</p>
              <p className="text-[10px] text-slate-500">Authenticated user</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
