"use client";

import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { Bell, Search, ChevronDown, Filter } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  admin: "Admin",
  trainer: "Trainer",
  student: "Student",
  "super-admin": "Super Admin",
  sections: "Sections",
  users: "Users",
  sessions: "Sessions",
  attendance: "Attendance",
  grades: "Grades",
  orgs: "Organizations",
  health: "Health",
};

export default function Navbar() {
  const pathname = usePathname();
  const { profile } = useUser();
  const email = profile?.email || "";
  const initial = email.charAt(0).toUpperCase() || "U";

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg) => labelMap[seg] || seg);
  const pageTitle = crumbs[crumbs.length - 1] || "Dashboard";

  return (
    <header className="h-[76px] flex items-center justify-between bg-[#f8fafb] px-8 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-5">
        <h1 className="text-[22px] font-extrabold text-[#1c2434] tracking-tight">{pageTitle}</h1>
        {/* Filter Dropdown */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-white border border-[#eef1f6] text-[12px] font-semibold text-[#7a849b] hover:border-[#2eb67d] hover:text-[#2eb67d] transition-all shadow-sm">
          <Filter className="w-3.5 h-3.5" />
          Last Month
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-[12px] bg-white border border-[#eef1f6] w-[220px] shadow-sm">
          <Search className="w-4 h-4 text-[#9ca8c2]" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-[13px] text-[#1c2434] placeholder:text-[#9ca8c2] outline-none w-full font-medium"
            readOnly
          />
        </div>

        {/* Notification */}
        <button className="relative w-[42px] h-[42px] rounded-[12px] bg-white border border-[#eef1f6] flex items-center justify-center text-[#9ca8c2] hover:text-[#1c2434] hover:border-[#1c2434]/10 transition-all shadow-sm">
          <Bell className="w-[18px] h-[18px]" strokeWidth={1.8} />
          <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-[#e74c3c] text-[9px] text-white font-bold flex items-center justify-center ring-2 ring-[#f8fafb]">2</span>
        </button>

        {/* Clerk Profile */}
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-9 h-9 border border-[#eef1f6] shadow-sm"
            }
          }}
        />
      </div>
    </header>
  );
}
