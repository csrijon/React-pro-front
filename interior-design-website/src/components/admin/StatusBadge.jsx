const MAP = {
  published: 'bg-emerald-900/50 text-emerald-300', draft: 'bg-amber-900/40 text-amber-300',
  New: 'bg-sky-900/50 text-sky-300', 'In Progress': 'bg-amber-900/40 text-amber-300', Contacted: 'bg-violet-900/40 text-violet-300',
  Completed: 'bg-emerald-900/50 text-emerald-300', Rejected: 'bg-red-900/40 text-red-300',
};
export default function StatusBadge({ status }) {
  return <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold capitalize ${MAP[status] || 'bg-white/10 text-cream/70'}`}>{status}</span>;
}
