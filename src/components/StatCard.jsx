export default function StatCard({ title, value, subtext, icon: Icon, badge, gradient = 'blue' }) {
  const gradients = {
    blue: 'from-blue-600/20 via-blue-500/5 to-transparent border-blue-500/30 text-blue-400',
    purple: 'from-purple-600/20 via-purple-500/5 to-transparent border-purple-500/30 text-purple-400',
    emerald: 'from-emerald-600/20 via-emerald-500/5 to-transparent border-emerald-500/30 text-emerald-400',
    amber: 'from-amber-600/20 via-amber-500/5 to-transparent border-amber-500/30 text-amber-400',
  };

  const selected = gradients[gradient] || gradients.blue;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 shadow-xl backdrop-blur-sm ${selected}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-white">{value}</span>
        {badge && (
          <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs font-medium text-slate-300">
            {badge}
          </span>
        )}
      </div>
      {subtext && <p className="mt-2 text-xs text-slate-400">{subtext}</p>}
    </div>
  );
}