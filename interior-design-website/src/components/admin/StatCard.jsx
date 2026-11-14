export default function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <div className="a-card p-4 sm:p-5">
      <div className="flex items-center justify-between text-cream/50">
        <span className="text-xs font-medium">{label}</span>{Icon && <Icon size={16} strokeWidth={1.6} />}
      </div>
      <p className="mt-2 text-3xl font-semibold text-cream tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-sage">{hint}</p>}
    </div>
  );
}
