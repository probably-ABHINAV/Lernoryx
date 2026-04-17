"use client";

import { motion } from "framer-motion";
import { Clock, UserPlus, FileText, CheckCircle2 } from "lucide-react";

const activities = [
  { id: 1, type: "session", text: "Advanced Web Dev Session created", time: "2h ago", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
  { id: 2, type: "attendance", text: "Attendance marked for 24 students", time: "4h ago", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
  { id: 3, type: "user", text: "New trainer Sarah joined", time: "5h ago", icon: UserPlus, color: "text-indigo-500", bg: "bg-indigo-50" },
  { id: 4, type: "system", text: "Platform maintenance completed", time: "1d ago", icon: Clock, color: "text-slate-500", bg: "bg-slate-50" },
];

export function ActivityFeed() {
  return (
    <div className="space-y-6">
      {activities.map((activity, i) => {
        const Icon = activity.icon;
        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="flex gap-4"
          >
            <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${activity.bg}`}>
              <Icon className={`h-4 w-4 ${activity.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{activity.text}</p>
              <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
