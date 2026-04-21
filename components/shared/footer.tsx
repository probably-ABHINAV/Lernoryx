import Link from "next/link";
import { BookOpen, Globe, Code2, Mail } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Methodology", href: "#methodology" },
    { label: "Analytics", href: "#analytics" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Experience", href: "/experience" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Documentation", href: "/docs" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-white border-t border-black/[0.03] pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-8 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-16 lg:gap-8">
          {/* Brand Col */}
          <div className="col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[10px] bg-[#1c2434] flex items-center justify-center">
                <BookOpen className="w-[16px] h-[16px] text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[18px] font-bold text-[#1c2434] tracking-[-0.03em]">
                TMS<span className="text-[#2eb67d]">.</span>
              </span>
            </Link>
            <p className="text-[13px] leading-relaxed text-[#7a849b] max-w-[260px] font-medium opacity-80">
              Operational perfection for modern academies. The system of record for your trainers, students, and growth.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-[#9ca8c2] hover:text-[#1c2434] transition-colors">
                <Globe size={16} strokeWidth={2} />
              </a>
              <a href="#" className="text-[#9ca8c2] hover:text-[#1c2434] transition-colors">
                <Code2 size={16} strokeWidth={2} />
              </a>
              <a href="#" className="text-[#9ca8c2] hover:text-[#1c2434] transition-colors">
                <Mail size={16} strokeWidth={2} />
              </a>
            </div>
          </div>

          {/* Links Cols */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="col-span-1">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1c2434] mb-8">
                {category}
              </h3>
              <ul className="space-y-5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[12px] font-bold text-[#9ca8c2] uppercase tracking-[0.1em] hover:text-[#1c2434] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-24 pt-10 border-t border-black/[0.03] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9ca8c2]">
            © {new Date().getFullYear()} TMS Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-[#9ca8c2]">
            <a href="#" className="hover:text-[#1c2434] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#1c2434] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#1c2434] transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
