"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { BookOpen, Menu, X } from "lucide-react";

const links = [
  { label: "Features", href: "#features" },
  { label: "Methodology", href: "#methodology" },
  { label: "Experience", href: "#experience" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-white/70 backdrop-blur-md py-4 border-b border-black/[0.03] shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)]"
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 lg:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-[10px] bg-[#1c2434] flex items-center justify-center group-hover:rotate-6 transition-transform duration-500">
            <BookOpen className="w-[16px] h-[16px] text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[18px] font-bold text-[#1c2434] tracking-[-0.03em]">
            TMS<span className="text-[#2eb67d]">.</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-12 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[12px] font-bold text-[#9ca8c2] hover:text-[#1c2434] uppercase tracking-[0.15em] transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-[12px] font-bold text-[#1c2434] uppercase tracking-[0.15em] px-4 py-2 hover:opacity-60 transition-opacity"
          >
            Log in
          </Link>
          <Link
            href="/sign-up"
            className="bg-[#1c2434] text-white text-[12px] font-bold uppercase tracking-[0.15em] px-7 py-3 rounded-[12px] hover:bg-[#2a3549] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500"
          >
            Join the platform
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-[10px] text-[#1c2434] hover:bg-[#f6f8fb]"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-black/[0.03] px-8 py-8 space-y-4 animate-in slide-in-from-top-4 duration-500 shadow-xl">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-[14px] font-bold text-[#9ca8c2] hover:text-[#1c2434] uppercase tracking-[0.15em]"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-6 mt-6 border-t border-black/[0.03] flex flex-col gap-3">
            <Link href="/sign-in" className="py-4 text-[12px] font-bold text-[#1c2434] text-center uppercase tracking-[0.15em] border border-[#1c2434] rounded-[12px]">
              Log in
            </Link>
            <Link href="/sign-up" className="py-4 text-[12px] font-bold text-white bg-[#1c2434] text-center uppercase tracking-[0.15em] rounded-[12px]">
              Join the platform
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
