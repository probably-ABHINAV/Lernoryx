"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export interface StatCardProps {
  label?: string;
  title?: string; // Support for the user's snippet preference
  value: string | number;
  change?: string;
  trend?: "up" | "down";
}

export function StatCard({ label, title, value, change, trend }: StatCardProps) {
  const displayTitle = title || label;
  
  return (
    <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
      <Card className="h-full border-slate-200/60 shadow-sm transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">
            {displayTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          {change && (
            <p className="text-xs text-muted-foreground mt-1">
              <span
                className={`inline-flex items-center font-medium ${
                  trend === "up" ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {trend === "up" ? "↗" : "↘"} {change}
              </span>{" "}
              from last period
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
