export default function LoadingSpinner({ label = 'Loading', className = '', dark = false }) {
  return (
    <div className={`flex items-center justify-center gap-3 py-16 ${dark ? 'text-cream/60' : 'text-forest/70'} ${className}`} role="status">
      <span className={`h-5 w-5 rounded-full border-2 ${dark ? 'border-sage/30 border-t-sage' : 'border-forest/20 border-t-forest'} animate-spin`} />
      <span className="text-sm">{label}</span>
    </div>
  );
}
