import { Search } from 'lucide-react'

export const AdminHeader = ({ title, subtitle, action }) => (
  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
    <div><h1 className="text-2xl font-semibold">{title}</h1>{subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}</div>{action}
  </div>
)

export const SearchBox = ({ value, onChange, placeholder = 'Search' }) => (
  <div className="relative w-full sm:max-w-xs"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input className="input pl-9" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} /></div>
)

const tones = {
  green: 'bg-green-50 text-green-700', amber: 'bg-amber-50 text-amber-700', blue: 'bg-sky-50 text-sky-700', red: 'bg-red-50 text-red-700', gray: 'bg-slate-100 text-slate-600',
}
const map = { New: 'blue', Contacted: 'amber', Converted: 'green', Closed: 'gray', Active: 'green', Inactive: 'gray', Pending: 'amber', Confirmed: 'green', Completed: 'gray', Cancelled: 'red', Published: 'green', Hidden: 'gray', 'For Sale': 'green', 'For Rent': 'amber', Sold: 'gray', Rented: 'gray', Draft: 'gray', 'Ready to Move': 'green', 'Under Construction': 'amber', Upcoming: 'blue', Verified: 'green', Approved: 'green', Rejected: 'red', 'Pending review': 'amber', Unverified: 'gray' }
export const StatusBadge = ({ status }) => <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${tones[map[status] || 'gray']}`}>{status}</span>

export const Table = ({ head, children, empty }) => (
  <div className="card overflow-x-auto">
    <table className="w-full min-w-[640px] text-left text-sm">
      <thead className="border-b border-line bg-slate-50/60 text-xs text-muted"><tr>{head.map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
      <tbody className="divide-y divide-line">{children}</tbody>
    </table>
    {empty}
  </div>
)
export const TableSkeleton = () => <div className="card space-y-3 p-5">{Array.from({ length: 5 }, (_, i) => <div key={i} className="skeleton h-10" />)}</div>
