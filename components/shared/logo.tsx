export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
        <span className="text-sm font-bold text-white">T</span>
      </div>
      <span className="text-lg font-bold text-slate-900">
        TMS<span className="text-indigo-600">.</span>
      </span>
    </div>
  );
}
