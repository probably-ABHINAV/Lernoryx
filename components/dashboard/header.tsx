"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function Header({ title, subtitle, backHref, backLabel, children }: { title: string, subtitle?: string, backHref?: string, backLabel?: string, children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#eef1f6] pt-2">
      <div>
        {backHref && (
          <Link href={backHref} className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#7a849b] hover:text-[#1c2434] transition-colors mb-2">
            <ArrowLeft size={14} />
            {backLabel || "Back"}
          </Link>
        )}
        <h2 className="text-[20px] font-extrabold text-[#1c2434] tracking-tight">{title}</h2>
        {subtitle && <p className="text-[13px] text-[#9ca8c2] font-medium mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
