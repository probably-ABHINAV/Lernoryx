"use client";

import { useState } from "react";
import useSWR from "swr";
import { FileText, Download, BookOpen } from "lucide-react";
import { Header } from "@/components/dashboard/header";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const FILE_ICONS: Record<string, string> = {
  pdf:  "📄", doc: "📝", docx: "📝",
  ppt:  "📊", pptx: "📊", xls: "📈",
  xlsx: "📈", mp4: "🎥", zip: "📦",
};

function getFileType(url: string): string {
  const ext = url.split(".").pop()?.toLowerCase() ?? "file";
  return FILE_ICONS[ext] ?? "📎";
}

export function ModulesClient({ sections }: { sections: { id: string; name: string; description?: string }[] }) {
  const [selectedSection, setSelectedSection] = useState(sections[0]?.id ?? "");

  const { data, isLoading } = useSWR(
    selectedSection ? `/api/student/content?sectionId=${selectedSection}` : null,
    fetcher
  );

  const content = data?.content ?? [];

  return (
    <div className="space-y-6">
      <Header title="Modules & Docs" subtitle="Training materials uploaded by your trainers" />

      {/* Section tabs */}
      <div className="flex gap-2 flex-wrap">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSection(s.id)}
            className={`px-4 py-2 rounded-[12px] text-[13px] font-bold transition-colors ${
              selectedSection === s.id
                ? "bg-[#1c2434] text-white"
                : "bg-white border border-[#eef1f6] text-[#7a849b] hover:bg-[#f6f8fb]"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Content grid */}
      <div className="bg-white rounded-[20px] border border-[#eef1f6] p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-extrabold text-[#1c2434]">
            {sections.find((s) => s.id === selectedSection)?.name ?? "Materials"}
          </h2>
          <span className="text-[12px] text-[#9ca8c2]">{content.length} file{content.length !== 1 ? "s" : ""}</span>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-[#f8fafb] rounded-[14px] animate-pulse" />)}
          </div>
        ) : content.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-full bg-[#edf7f3] flex items-center justify-center mx-auto mb-4">
              <BookOpen size={22} className="text-[#2eb67d]" />
            </div>
            <p className="text-[14px] font-extrabold text-[#1c2434] mb-2">No materials yet</p>
            <p className="text-[13px] text-[#9ca8c2]">Your trainer hasn&apos;t uploaded any files for this section</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {content.map((item: any) => (
              <a
                key={item.id}
                href={item.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-[14px] bg-[#f8fafb] hover:bg-[#edf7f3] border border-transparent hover:border-[#2eb67d]/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-[10px] bg-white border border-[#eef1f6] flex items-center justify-center text-lg">
                  {getFileType(item.file_url)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#1c2434] truncate">{item.title}</p>
                  <p className="text-[11px] text-[#9ca8c2]">
                    {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(item.created_at))}
                  </p>
                </div>
                <Download size={14} className="text-[#9ca8c2] group-hover:text-[#2eb67d] transition-colors shrink-0" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
