"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface RolesChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ["#2eb67d", "#1c2434", "#e8b931", "#e74c3c"];

export function RolesChart({ data }: RolesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[260px] flex items-center justify-center text-[13px] text-[#9ca8c2]">
        No role data available.
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="h-[260px] w-full flex items-center gap-4">
      <div className="w-1/2 h-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
              cornerRadius={5}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                background: "#1c2434",
                color: "#fff",
                boxShadow: "0 10px 30px rgb(0 0 0 / 0.15)",
                fontSize: "12px",
                fontWeight: 700,
                padding: "8px 14px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-[24px] font-extrabold text-[#1c2434]">{total}</p>
            <p className="text-[9px] font-bold text-[#9ca8c2] uppercase tracking-[0.15em]">Total</p>
          </div>
        </div>
      </div>

      <div className="w-1/2 space-y-4">
        {data.map((entry, i) => {
          const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0;
          return (
            <div key={entry.name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[12px] font-bold text-[#1c2434]">{entry.name}</span>
                </div>
                <span className="text-[11px] font-bold text-[#9ca8c2]">{pct}%</span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 rounded-full bg-[#f0f3f8] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
