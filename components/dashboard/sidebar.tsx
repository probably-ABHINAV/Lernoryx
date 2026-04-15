"use client";

import Link from "next/link";
import { useUser } from "@/hooks/useUser";

export default function Sidebar() {
  const { role } = useUser();

  return (
    <div className="w-64 bg-gray-900 text-white p-5 flex flex-col h-full">
      <h2 className="text-xl font-bold mb-6 tracking-wide">Platform</h2>

      <nav className="space-y-3 flex-1">
        {role === "admin" && (
          <>
            <Link href="/dashboard/admin" className="block py-2 px-3 rounded hover:bg-gray-800 transition-colors">Dashboard</Link>
            <Link href="/dashboard/admin/sections" className="block py-2 px-3 rounded hover:bg-gray-800 transition-colors">Sections</Link>
            <Link href="/dashboard/admin/users" className="block py-2 px-3 rounded hover:bg-gray-800 transition-colors">Users</Link>
          </>
        )}

        {role === "trainer" && (
          <>
            <Link href="/dashboard/trainer" className="block py-2 px-3 rounded hover:bg-gray-800 transition-colors">Dashboard</Link>
            <Link href="/dashboard/trainer/sessions" className="block py-2 px-3 rounded hover:bg-gray-800 transition-colors">Sessions</Link>
            <Link href="/dashboard/trainer/attendance" className="block py-2 px-3 rounded hover:bg-gray-800 transition-colors">Attendance</Link>
          </>
        )}

        {role === "student" && (
          <>
            <Link href="/dashboard/student" className="block py-2 px-3 rounded hover:bg-gray-800 transition-colors">Dashboard</Link>
            <Link href="/dashboard/student/attendance" className="block py-2 px-3 rounded hover:bg-gray-800 transition-colors">Attendance</Link>
            <Link href="/dashboard/student/grades" className="block py-2 px-3 rounded hover:bg-gray-800 transition-colors">Grades</Link>
          </>
        )}

        {role === "super_admin" && (
          <>
             <Link href="/super-admin" className="block py-2 px-3 rounded hover:bg-gray-800 transition-colors">Overview</Link>
             <Link href="/super-admin/orgs" className="block py-2 px-3 rounded hover:bg-gray-800 transition-colors">Organizations</Link>
          </>
        )}
      </nav>
      <div className="mt-auto py-4 text-xs text-gray-500">
        Logged in as {role}
      </div>
    </div>
  );
}
