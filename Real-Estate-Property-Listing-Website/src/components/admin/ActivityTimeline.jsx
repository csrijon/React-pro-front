import { useState } from 'react'
import { Plus, Pencil, Trash2, Check, X, LogIn, ShieldAlert, KeyRound, UserPlus, ChevronDown } from 'lucide-react'
import { timeAgo } from '../../utils/format'

export const ACTIONS = {
  create: ['Created', Plus, 'bg-green-50 text-green-700'], update: ['Updated', Pencil, 'bg-sky-50 text-sky-700'], delete: ['Deleted', Trash2, 'bg-red-50 text-red-700'],
  approve: ['Approved', Check, 'bg-green-50 text-green-700'], reject: ['Rejected', X, 'bg-red-50 text-red-700'], login: ['Login', LogIn, 'bg-slate-100 text-slate-600'],
  login_failed: ['Failed login', ShieldAlert, 'bg-amber-50 text-amber-700'], register: ['Sign-up', UserPlus, 'bg-slate-100 text-slate-600'], password_change: ['Password', KeyRound, 'bg-slate-100 text-slate-600'],
}
export const ActionBadge = ({ action }) => {
  const [label, Icon, tone] = ACTIONS[action] || [action, Pencil, 'bg-slate-100 text-slate-600']
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}><Icon size={12} />{label}</span>
}

export function Changes({ changes }) {
  const rows = Object.entries(changes || {}).filter(([, v]) => v)
  if (!rows.length) return null
  return (
    <dl className="mt-2 space-y-1 rounded-lg bg-surface p-3 text-xs">
      {rows.map(([k, [from, to]]) => (
        <div key={k} className="grid grid-cols-[6rem_1fr] gap-2"><dt className="font-medium text-muted">{k}</dt><dd className="min-w-0 break-words"><span className="text-red-600 line-through">{from}</span> <span className="text-muted">→</span> <span className="text-green-700">{to}</span></dd></div>
      ))}
    </dl>
  )
}

export function LogEntry({ e }) {
  const [open, setOpen] = useState(false)
  const has = e.changes && Object.keys(e.changes).length > 0
  return (
    <li className="py-3">
      <div className="flex flex-wrap items-start gap-x-3 gap-y-1">
        <ActionBadge action={e.action} />
        <div className="min-w-0 flex-1 text-sm [overflow-wrap:anywhere]"><p>{e.summary}</p>
          <p className="text-xs text-muted">{e.actorName} <span className="capitalize">({e.actorRole})</span> · <time dateTime={e.createdAt} title={new Date(e.createdAt).toLocaleString()}>{timeAgo(e.createdAt)}</time></p></div>
        {has && <button onClick={() => setOpen((o) => !o)} className="btn-ghost btn-sm" aria-expanded={open}>Details<ChevronDown size={13} className={open ? 'rotate-180' : ''} /></button>}
      </div>
      {open && <Changes changes={e.changes} />}
    </li>
  )
}
