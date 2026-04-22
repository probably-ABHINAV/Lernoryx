"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Users, 
  Calendar, 
  ShieldCheck, 
  BarChart3, 
  GraduationCap,
  ChevronRight,
  TrendingUp,
  Layout,
  Clock,
  Sparkles
} from "lucide-react";

// ── Animation Constants ───────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] }
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
};

// ── Shared Components ─────────────────────────────────────────────────────

function LiveUIPreview() {
  return (
    <div className="relative w-full max-w-5xl mx-auto mt-20 px-4">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square bg-[#2eb67d]/3 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative grid grid-cols-12 gap-4 lg:gap-6">
        {/* Analytics Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, x: -20 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true }}
          className="col-span-12 lg:col-span-7 bg-white rounded-[24px] border border-black/[0.03] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] font-bold text-[#9ca8c2] uppercase tracking-[0.2em] mb-1">Growth Profile</p>
              <h4 className="text-[18px] font-bold text-[#1c2434]">Academy Performance</h4>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f6f8fb] border border-black/[0.02]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2eb67d] animate-pulse" />
              <span className="text-[10px] font-bold text-[#1c2434] uppercase tracking-wider">Live View</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {[
              { label: "Student Engagement", val: "94.2%", color: "#2eb67d", width: "94%" },
              { label: "Course Completion", val: "88.7%", color: "#1c2434", width: "88%" },
              { label: "Resource Utilization", val: "72.4%", color: "#9ca8c2", width: "72%" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="flex justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#7a849b] uppercase tracking-wide">{stat.label}</span>
                  <span className="text-[12px] font-bold text-[#1c2434]">{stat.val}</span>
                </div>
                <div className="h-1.5 bg-[#f6f8fb] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: stat.width }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: stat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Small Roster Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="col-span-12 lg:col-span-5 flex flex-col gap-4 lg:gap-6"
        >
          <div className="bg-white rounded-[24px] border border-black/[0.03] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.06)] p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#1c2434] flex items-center justify-center text-white font-bold text-[13px]">AS</div>
              <div>
                <p className="text-[13px] font-bold text-[#1c2434]">Aditya Sharma</p>
                <p className="text-[11px] text-[#9ca8c2]">Batch 2024-C • Active Now</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#fcfdfe] border border-black/[0.02] rounded-[14px] p-4">
                <p className="text-[9px] font-bold text-[#9ca8c2] uppercase tracking-widest mb-1">XP Points</p>
                <p className="text-[16px] font-extrabold text-[#2eb67d]">1,240</p>
              </div>
              <div className="bg-[#fcfdfe] border border-black/[0.02] rounded-[14px] p-4">
                <p className="text-[9px] font-bold text-[#9ca8c2] uppercase tracking-widest mb-1">Rank</p>
                <p className="text-[16px] font-extrabold text-[#1c2434]">#04</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1c2434] rounded-[24px] border border-white/5 shadow-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[10px] bg-white/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="text-[13px] font-bold text-white tracking-wide">Next Live Session</span>
            </div>
            <span className="text-[11px] font-bold text-[#2eb67d] bg-[#2eb67d]/10 px-3 py-1 rounded-full uppercase tracking-widest">In 24m</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafbfc] selection:bg-[#2eb67d] selection:text-white">
      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-32 lg:pt-56 lg:pb-48 px-8 overflow-hidden">
        <div className="mx-auto max-w-7xl text-center relative z-10">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="flex flex-col items-center"
          >
            <motion.div 
              variants={fadeUp}
              className="px-4 py-1.5 rounded-full bg-white border border-black/[0.03] shadow-sm mb-10 flex items-center gap-2"
            >
              <Sparkles className="w-3 h-3 text-[#2eb67d]" />
              <span className="text-[11px] font-bold text-[#1c2434] uppercase tracking-[0.25em]">Elevating Excellence</span>
            </motion.div>
            
            <motion.h1 
              variants={fadeUp}
              className="text-[48px] md:text-[84px] font-bold text-[#1c2434] tracking-[-0.04em] leading-[0.9] max-w-5xl mb-8"
            >
              The Operating System for <br className="hidden lg:block" /> 
              <span className="text-[#2eb67d] lowercase italic font-serif opacity-90 pr-2">Modern</span> Training.
            </motion.h1>

            <motion.p 
              variants={fadeUp}
              className="text-[15px] md:text-[18px] text-[#7a849b] leading-relaxed max-w-2xl font-medium mb-12 opacity-80"
            >
              Operational perfection for academies that refuse to compromise. 
              Manage students, track performance, and scale your vision from one 
              singular, bespoke command center.
            </motion.p>

            <motion.div 
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <Link
                href="/sign-up"
                className="px-10 py-4 bg-[#1c2434] text-white rounded-[14px] text-[13px] font-bold uppercase tracking-[0.15em] hover:bg-[#2a3549] transition-all duration-500 shadow-xl shadow-black/10"
              >
                Begin the experience
              </Link>
              <Link
                href="#features"
                className="flex items-center gap-3 text-[13px] font-bold text-[#1c2434] uppercase tracking-[0.15em] hover:opacity-60 transition-opacity"
              >
                Discovery <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          <LiveUIPreview />
        </div>
      </section>

      {/* ── BENTO FEATURES ───────────────────────────────────────────────── */}
      <section id="features" className="py-32 lg:py-48 px-8 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-24">
            <div className="max-w-2xl">
              <h2 className="text-[11px] font-bold text-[#2eb67d] uppercase tracking-[0.3em] mb-6">Methodology</h2>
              <h3 className="text-[36px] md:text-[52px] font-bold text-[#1c2434] tracking-tight leading-[1.1]">
                Bespoke tools built for <br /> operational precision.
              </h3>
            </div>
            <p className="text-[14px] font-medium text-[#7a849b] max-w-md pb-2 leading-relaxed opacity-80">
              We stripped away the complexity to provide a refined environment where data meets design. 
              No clutter, just clarity.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            {/* Massive Card */}
            <div className="col-span-12 lg:col-span-8 bg-[#f9fafc] rounded-[32px] p-10 border border-black/[0.02] flex flex-col justify-between group overflow-hidden relative min-h-[420px]">
              <div className="relative z-10">
                <BarChart3 className="w-8 h-8 text-[#1c2434] mb-6" />
                <h4 className="text-[24px] font-bold text-[#1c2434] mb-4">Deep Analytics Command</h4>
                <p className="text-[14px] font-medium text-[#7a849b] max-w-md leading-relaxed opacity-90">
                  Track student lifecycle from enrollment to graduation with precision metrics that don&apos;t just show data—they reveal insights.
                </p>
              </div>
              <div className="absolute top-10 right-10 flex gap-2">
                 <div className="w-16 h-8 bg-white/50 backdrop-blur rounded-full border border-black/[0.05]" />
                 <div className="w-24 h-8 bg-white/80 backdrop-blur rounded-full border border-black/[0.1]" />
              </div>
              {/* Decorative Mock Chart Snippet */}
              <div className="absolute -bottom-10 right-0 left-0 h-40 bg-gradient-to-t from-white to-transparent px-10 flex items-end justify-between gap-2 overflow-hidden pointer-events-none opacity-40">
                 {[40, 70, 45, 90, 65, 80, 55, 95, 75, 40].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                      className="w-full bg-[#1c2434] rounded-t-lg" 
                    />
                 ))}
              </div>
            </div>

            {/* Vertical Cards */}
            <div className="col-span-12 lg:col-span-4 grid grid-rows-2 gap-4 lg:gap-6">
              <div className="bg-white border border-black/[0.05] shadow-sm rounded-[32px] p-8">
                 <Users className="w-6 h-6 text-[#2eb67d] mb-6" />
                 <h4 className="text-[18px] font-bold text-[#1c2434] mb-2">Role Intelligence</h4>
                 <p className="text-[13px] font-medium text-[#7a849b] leading-relaxed opacity-90">
                   Dedicated interfaces tailored for admins, trainers, and trainees.
                 </p>
              </div>
              <div className="bg-[#2eb67d] rounded-[32px] p-8 group overflow-hidden relative">
                 <ShieldCheck className="w-6 h-6 text-white mb-6" />
                 <h4 className="text-[18px] font-bold text-white mb-2">Enterprise Vault</h4>
                 <p className="text-[13px] font-medium text-white/70 leading-relaxed">
                   Bank-grade security protocols protecting every byte of your academy data.
                 </p>
                 <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              </div>
            </div>

            {/* Horizontal Cards */}
            <div className="col-span-12 lg:col-span-5 bg-white border border-black/[0.05] shadow-sm rounded-[32px] p-8 flex flex-col justify-center">
              <Clock className="w-6 h-6 text-[#7a849b] mb-6" />
              <h4 className="text-[18px] font-bold text-[#1c2434] mb-2">Session Flow</h4>
              <p className="text-[13px] font-medium text-[#7a849b] leading-relaxed">
                Automated scheduling and smart attendance tracking designed for high-frequency environments.
              </p>
            </div>
            
            <div className="col-span-12 lg:col-span-7 bg-[#1c2434] rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-8 group">
               <div className="flex-1">
                 <GraduationCap className="w-6 h-6 text-[#2eb67d] mb-6" />
                 <h4 className="text-[18px] font-bold text-white mb-2">Student Immersion</h4>
                 <p className="text-[13px] font-medium text-white/50 leading-relaxed">
                   Gamified experience paths that turn training into a rewarding journey for every student.
                 </p>
               </div>
               <div className="w-32 h-32 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <TrendingUp className="text-white/20 w-10 h-10" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ──────────────────────────────────────────────────── */}
      <section className="py-40 lg:py-56 px-8 bg-[#fafbfc]">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <h2 className="text-[11px] font-bold text-[#2eb67d] uppercase tracking-[0.4em] mb-10">The Commencement</h2>
            <h3 className="text-[40px] md:text-[64px] font-bold text-[#1c2434] tracking-[-0.04em] leading-[1] mb-10">
              Your vision, <br /> perfectly managed.
            </h3>
            <p className="text-[15px] md:text-[17px] text-[#7a849b] font-medium leading-relaxed max-w-xl mb-14 opacity-80">
              Join the future of high-impact academies. No complexity, no compromises. 
              Start your bespoke platform integration today.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/sign-up"
                className="px-12 py-5 bg-[#1c2434] text-white rounded-[16px] text-[13px] font-bold uppercase tracking-[0.2em] hover:bg-[#2a3549] transition-all duration-500 shadow-2xl shadow-black/10"
              >
                Join the platform
              </Link>
              <Link
                href="/contact"
                className="px-12 py-5 border border-black/[0.08] text-[#1c2434] rounded-[16px] text-[13px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-all duration-500"
              >
                Talk to Sales
              </Link>
            </div>

            <div className="mt-20 flex items-center gap-10 opacity-40">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1c2434]">High-Impact Security</span>
               <div className="w-1.5 h-1.5 rounded-full bg-[#1c2434]" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1c2434]">Verified Platform</span>
               <div className="w-1.5 h-1.5 rounded-full bg-[#1c2434]" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1c2434]">24/7 Priority</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
