"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AttendanceChartProps {
  data: any[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1c2434] text-white px-4 py-2.5 rounded-[12px] shadow-xl text-[12px] font-bold">
        <p className="text-[#9ca8c2] text-[10px] font-semibold mb-0.5">{label}</p>
        <p>{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export function AttendanceChart({ data }: AttendanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[280px] flex items-center justify-center text-[13px] text-[#9ca8c2]">
        No attendance data to display.
      </div>
    );
  }

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="attendanceFillGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2eb67d" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#2eb67d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f0f3f8" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#9ca8c2", fontWeight: 600 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#9ca8c2", fontWeight: 600 }}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Area
            type="monotone"
            dataKey="attendance"
            stroke="#2eb67d"
            strokeWidth={2.5}
            fill="url(#attendanceFillGreen)"
            dot={false}
            activeDot={{ r: 5, fill: "#2eb67d", strokeWidth: 3, stroke: "#fff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
