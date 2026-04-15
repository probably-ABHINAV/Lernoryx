export interface StatCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

export function StatCard({ label, value, change, trend }: StatCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </p>
        <span
          className={`inline-flex items-center text-xs font-semibold ${
            trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend === "up" ? "↑" : "↓"} {change}
        </span>
      </div>
    </div>
  );
}
