"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Building2, Users, BookOpen, Calendar, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show:  { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const QUICK_LINKS = [
  { href: "/super-admin/orgs",    label: "Manage Organizations", icon: Building2, desc: "Create, suspend, configure orgs" },
  { href: "/super-admin/health",  label: "Platform Health",      icon: TrendingUp, desc: "DB, Auth, Storage latency" },
  { href: "/super-admin/audit",   label: "Audit Log",            icon: Calendar,  desc: "Every action across every org" },
  { href: "/super-admin/flags",   label: "Feature Flags",        icon: BookOpen,  desc: "Toggle features per org" },
];

export function SuperAdminClient() {
  const { data, isLoading } = useSWR("/api/super-admin/platform", fetcher);
  const totals = data?.totals ?? {};
  const trend  = data?.trend  ?? [];

  const statCards = [
    { label: "TOTAL ORGS",     value: totals.totalOrgs    ?? "—", sub: `${totals.activeOrgs ?? 0} active`, color: "#2eb67d" },
    { label: "TOTAL USERS",    value: totals.totalUsers   ?? "—", sub: `${totals.mau ?? 0} MAU`, color: "#185fa5" },
    { label: "TOTAL SECTIONS", value: totals.totalSections ?? "—", sub: "across all orgs", color: "#e8b931" },
    { label: "TOTAL SESSIONS", value: totals.totalSessions ?? "—", sub: "all time", color: "#1c2434" },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-[20px] bg-[#1c2434] p-8"
      >
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 right-28 w-64 h-64 rounded-full bg-white/[0.03]" />
        <div className="absolute top-6 right-20 w-20 h-20 rounded-full bg-[#2eb67d]/20" />
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 rounded-[10px] bg-[#2eb67d]/20 text-[#2eb67d] text-[11px] font-bold uppercase tracking-[0.15em] mb-3">
            SUPER ADMIN
          </span>
          <h1 className="text-[22px] font-extrabold text-white tracking-tight mb-1">
            Platform Overview
          </h1>
          <p className="text-[13px] text-white/50">
            {totals.totalOrgs ?? "—"} organizations · {totals.totalUsers ?? "—"} users · {totals.mau ?? "—"} MAU
          </p>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-[20px] border border-[#eef1f6] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#9ca8c2] mb-2">{s.label}</p>
            <p className="text-[28px] font-extrabold leading-none mb-1" style={{ color: s.color }}>
              {isLoading ? "—" : s.value}
            </p>
            <p className="text-[11px] text-[#9ca8c2]">{s.sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Two col: growth chart + plan breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Org growth trend */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-[20px] border border-[#eef1f6] p-6">
          <h2 className="text-[15px] font-extrabold text-[#1c2434] mb-5">Organization Growth (Weekly)</h2>
          {isLoading || trend.length === 0 ? (
            <div className="h-48 bg-[#f8fafb] rounded-[14px] animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="orgGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2eb67d" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2eb67d" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f8" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9ca8c2" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca8c2" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1c2434", border: "none", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                  formatter={(v: any) => [v, "New Orgs"]}
                />
                <Area type="monotone" dataKey="count" stroke="#2eb67d" strokeWidth={2.5} fill="url(#orgGrowthGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Plan breakdown */}
        <motion.div variants={itemVariants} className="bg-white rounded-[20px] border border-[#eef1f6] p-6">
          <h2 className="text-[15px] font-extrabold text-[#1c2434] mb-5">Plan Breakdown</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-8 bg-[#f8fafb] rounded-[10px] animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(totals.planBreakdown ?? {}).map(([plan, count]) => {
                const planColors: Record<string, string> = {
                  free: "#9ca8c2", starter: "#2eb67d", pro: "#185fa5", enterprise: "#1c2434",
                };
                const total = totals.totalOrgs || 1;
                const pct = Math.round(((count as number) / total) * 100);
                return (
                  <div key={plan}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] font-bold capitalize" style={{ color: planColors[plan] ?? "#9ca8c2" }}>{plan}</span>
                      <span className="text-[12px] font-bold text-[#1c2434]">{count as number}</span>
                    </div>
                    <div className="h-1.5 bg-[#eef1f6] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: planColors[plan] ?? "#9ca8c2" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick links */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between p-5 bg-white rounded-[20px] border border-[#eef1f6] hover:border-[#2eb67d]/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-[12px] bg-[#edf7f3] flex items-center justify-center">
                  <Icon size={18} className="text-[#2eb67d]" />
                </div>
                <div>
                  <p className="text-[14px] font-extrabold text-[#1c2434]">{link.label}</p>
                  <p className="text-[12px] text-[#9ca8c2]">{link.desc}</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-[#9ca8c2] group-hover:text-[#2eb67d] transition-colors" />
            </Link>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
