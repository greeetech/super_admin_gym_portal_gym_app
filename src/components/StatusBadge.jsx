export default function StatusBadge({ status }) {
  const configs = {
    active: {
      label: 'Active',
      className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ring-emerald-500/20',
      dot: 'bg-emerald-400',
    },
    suspended: {
      label: 'Suspended',
      className: 'bg-red-500/10 text-red-400 border-red-500/20 ring-red-500/20',
      dot: 'bg-red-400',
    },
    expired: {
      label: 'Expired',
      className: 'bg-amber-500/10 text-amber-400 border-amber-500/20 ring-amber-500/20',
      dot: 'bg-amber-400',
    },
    pending: {
      label: 'Pending',
      className: 'bg-slate-500/10 text-slate-400 border-slate-500/20 ring-slate-500/20',
      dot: 'bg-slate-400',
    },
  };

  const key = (status || 'active').toLowerCase();
  const config = configs[key] || configs.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${config.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}