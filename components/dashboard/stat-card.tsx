"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

export interface StatCardProps {
  label?: string;
  title?: string;
  value: string | number;
  subtitle?: string;
  subtitleValue?: string | number;
  change?: string;
  trend?: "up" | "down";
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  sparkData?: number[];
  accentColor?: string;
}

function MiniSparkline({ data, color = "#2eb67d" }: { data: number[]; color?: string }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const barCount = data.length;
  const barWidth = 4;
  const gap = 3;
  const height = 36;
  const svgWidth = barCount * (barWidth + gap) - gap;

  return (
    <svg width={svgWidth} height={height} className="opacity-70">
      {data.map((val, i) => {
        const barHeight = Math.max(4, ((val - min) / range) * (height - 4));
        return (
          <rect
            key={i}
            x={i * (barWidth + gap)}
            y={height - barHeight}
            width={barWidth}
            height={barHeight}
            rx={2}
            fill={color}
            opacity={i === data.length - 1 ? 1 : 0.4}
          />
        );
      })}
    </svg>
  );
}

export function StatCard({
  label,
  title,
  value,
  subtitle,
  subtitleValue,
  change,
  trend,
  icon,
  sparkData,
  accentColor = "#2eb67d",
}: StatCardProps) {
  const displayTitle = title || label;

  return (
    <div className="bg-white rounded-[20px] p-7 shadow-sm hover:shadow-md transition-shadow duration-300 group">
      {/* Top Row */}
      <div className="flex items-start justify-between mb-1">
        <p className="text-[11px] font-bold text-[#9ca8c2] uppercase tracking-[0.15em]">{displayTitle}</p>
        {change && (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-[10px] ${
              trend === "up"
                ? "bg-[#edf7f3] text-[#2eb67d]"
                : "bg-[#fef0f0] text-[#e74c3c]"
            }`}
          >
            {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>

      {/* Value + Sparkline */}
      <div className="flex items-end justify-between mt-2">
        <div>
          <p className="text-[32px] font-extrabold text-[#1c2434] leading-none tracking-tight">{value}</p>
          {subtitle && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[11px] font-bold text-[#9ca8c2] uppercase tracking-wider">{subtitle}</span>
              {subtitleValue !== undefined && (
                <span className="text-[12px] font-extrabold text-[#1c2434]">{subtitleValue}</span>
              )}
            </div>
          )}
        </div>
        {sparkData && (
          <MiniSparkline data={sparkData} color={accentColor} />
        )}
      </div>
    </div>
  );
}
