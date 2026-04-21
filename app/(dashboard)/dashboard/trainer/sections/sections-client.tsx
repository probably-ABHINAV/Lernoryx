"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import { motion } from "framer-motion";
import { Users, BookOpen, ChevronRight, LayoutGrid } from "lucide-react";
import { Header } from "@/components/dashboard/header";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function SectionsClient() {
  const router = useRouter();
  const { data, isLoading } = useSWR("/api/trainer/sections", fetcher);
  const sections = data?.sections ?? [];

  return (
    <div className="space-y-6">
      <Header title="My Sections" subtitle="All training batches assigned to you" />

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-white rounded-[20px] border border-[#eef1f6] animate-pulse" />
          ))}
        </div>
      ) : sections.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-[#eef1f6] p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-[#edf7f3] flex items-center justify-center mx-auto mb-4">
            <LayoutGrid size={22} className="text-[#2eb67d]" />
          </div>
          <p className="text-[15px] font-extrabold text-[#1c2434] mb-2">No sections assigned</p>
          <p className="text-[13px] text-[#9ca8c2]">
            An admin needs to create sessions and assign you as trainer
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sections.map((section: any, i: number) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => router.push(`/dashboard/trainer/sections/${section.id}`)}
              className="bg-white rounded-[20px] border border-[#eef1f6] p-6 cursor-pointer hover:border-[#2eb67d]/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[15px] font-extrabold text-[#1c2434]">{section.name}</h3>
                  <p className="text-[12px] text-[#9ca8c2] mt-0.5 line-clamp-1">{section.description ?? "No description"}</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-[8px] ${
                  section.is_active
                    ? "bg-[#edf7f3] text-[#2eb67d]"
                    : "bg-[#f0f3f8] text-[#9ca8c2]"
                }`}>
                  {section.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-[#9ca8c2]" />
                    <span className="text-[12px] text-[#7a849b]">{section.studentCount} students</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={14} className="text-[#9ca8c2]" />
                    <span className="text-[12px] text-[#7a849b]">max {section.max_capacity}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#9ca8c2] group-hover:text-[#2eb67d] transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
