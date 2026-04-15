"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/modules/auth/auth.service";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: "📊",
  },
  {
    label: "Students",
    href: "/admin/students",
    icon: "🎓",
  },
  {
    label: "Trainers",
    href: "/admin/trainers",
    icon: "👨‍🏫",
  },
  {
    label: "Sections",
    href: "/admin/sections",
    icon: "📋",
  },
  {
    label: "Sessions",
    href: "/admin/sessions",
    icon: "📅",
  },
  {
    label: "Attendance",
    href: "/admin/attendance",
    icon: "✅",
  },
  {
    label: "Grades",
    href: "/admin/grades",
    icon: "📝",
  },
  {
    label: "Billing",
    href: "/admin/billing",
    icon: "💳",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: "⚙️",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login"); // Redirect to login on logout
  }

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
        <span className="text-xl font-bold text-indigo-600">TMS</span>
        <span className="text-sm font-medium text-slate-500">SaaS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-sm font-semibold text-indigo-600">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">admin@tms.com</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-2 w-full flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
