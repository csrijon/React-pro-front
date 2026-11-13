import { Link } from 'react-router-dom'
import { Building2, CheckCircle2, Users, MessageSquare, FolderKanban, IndianRupee } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import { useAsync } from '../../hooks/useAsync'
import { propertyService } from '../../services/propertyService'
import { projectService } from '../../services/projectService'
import { agentService } from '../../services/agentService'
import { inquiryService } from '../../services/inquiryService'
import { viewsSeries } from '../../data/misc'
import { formatPrice, timeAgo, formatDate } from '../../utils/format'
import { AdminHeader, StatusBadge, TableSkeleton } from '../../components/admin/AdminUI'
import { ErrorState } from '../../components/common/States'

const COLORS = ['#063E2F', '#267032', '#d97706', '#94a3b8']

export default function Dashboard() {
  const d = useAsync(() => Promise.all([propertyService.list(), projectService.list(), agentService.list(), inquiryService.list(), inquiryService.appointments.list()]), [])
  if (d.loading) return <><AdminHeader title="Dashboard" /><TableSkeleton /></>
  if (d.error) return <ErrorState error={d.error} onRetry={d.reload} />
  const [props, projs, agents, inqs, apts] = d.data
  const total = props.reduce((s, p) => s + (p.purpose === 'Buy' ? p.price : 0), 0)
  const stats = [[Building2, 'Total properties', props.length], [CheckCircle2, 'Active listings', props.filter((p) => !['Sold', 'Rented', 'Draft'].includes(p.status)).length], [Users, 'Total agents', agents.length], [MessageSquare, 'New enquiries', inqs.filter((i) => i.status === 'New').length], [FolderKanban, 'Total projects', projs.length], [IndianRupee, 'Total property value', formatPrice(total)]]
  const dist = ['For Sale', 'For Rent', 'Sold', 'Rented'].map((s) => ({ name: s, value: props.filter((p) => p.status === s).length })).filter((x) => x.value)
  const recent = [...props].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4)
  return (
    <>
      <AdminHeader title="Dashboard" subtitle="A snapshot of your listings, enquiries and visits." />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-6">
        {stats.map(([I, l, v]) => <div key={l} className="card min-w-0 p-4"><span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-50 text-primary"><I size={18} /></span><p className="mt-3 font-heading text-2xl font-semibold">{v}</p><p className="text-xs text-muted">{l}</p></div>)}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <section className="card min-w-0 p-5"><h2 className="font-semibold">Property views</h2><p className="text-xs text-muted">Last 30 days</p>
          <div className="mt-4 h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={viewsSeries} margin={{ left: -20, right: 8 }}><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#267032" stopOpacity={0.3} /><stop offset="100%" stopColor="#267032" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid stroke="#E5E7EB" vertical={false} /><XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} /><YAxis tickLine={false} axisLine={false} fontSize={12} /><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB' }} /><Area type="monotone" dataKey="views" stroke="#267032" strokeWidth={2.5} fill="url(#g)" /></AreaChart></ResponsiveContainer></div></section>
        <section className="card min-w-0 p-5"><h2 className="font-semibold">Property status</h2>
          <div className="mt-4 h-44"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={dist} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>{dist.map((_, i) => <Cell key={i} fill={COLORS[i % 4]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
          <ul className="mt-2 space-y-1.5 text-sm">{dist.map((x, i) => <li key={x.name} className="flex items-center justify-between"><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % 4] }} />{x.name}</span><strong>{x.value}</strong></li>)}</ul></section>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="card min-w-0 p-5"><div className="flex justify-between"><h2 className="font-semibold">Recent enquiries</h2><Link to="/admin/inquiries" className="text-xs font-medium text-accent">View all</Link></div>
          <ul className="mt-3 divide-y divide-line">{inqs.slice(0, 5).map((q) => <li key={q.id} className="py-3 text-sm"><div className="flex justify-between gap-2"><strong>{q.name}</strong><span className="shrink-0 text-xs text-muted">{timeAgo(q.createdAt)}</span></div><p className="truncate text-muted">{q.property}</p></li>)}</ul></section>
        <section className="card min-w-0 p-5"><div className="flex justify-between"><h2 className="font-semibold">Recent listings</h2><Link to="/admin/properties" className="text-xs font-medium text-accent">View all</Link></div>
          <ul className="mt-3 divide-y divide-line">{recent.map((p) => <li key={p.id} className="flex items-center gap-3 py-3 text-sm"><img src={p.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover" /><div className="min-w-0 flex-1"><p className="truncate font-medium">{p.title}</p><p className="text-xs text-muted">{formatPrice(p.price, p.purpose)}</p></div><StatusBadge status={p.status} /></li>)}</ul></section>
        <section className="card min-w-0 p-5"><div className="flex justify-between"><h2 className="font-semibold">Upcoming visits</h2><Link to="/admin/appointments" className="text-xs font-medium text-accent">View all</Link></div>
          <ul className="mt-3 divide-y divide-line">{apts.slice(0, 5).map((a) => <li key={a.id} className="flex items-center justify-between gap-2 py-3 text-sm"><div className="min-w-0"><p className="font-medium">{a.name}</p><p className="truncate text-xs text-muted">{a.property} · {formatDate(a.date)}, {a.time}</p></div><StatusBadge status={a.status} /></li>)}</ul></section>
      </div>
    </>
  )
}
