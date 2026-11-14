import { useMemo, useRef, useState } from 'react';
import { Search, Eye, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import PageTitle from '../../components/admin/PageTitle';
import DataTable from '../../components/admin/DataTable';
import Drawer from '../../components/common/Drawer';
import ConfirmModal from '../../components/common/ConfirmModal';
import ErrorState from '../../components/common/ErrorState';
import { useAsync } from '../../hooks/useAsync';
import { useToast } from '../../context/ToastContext';
import { inquiriesApi } from '../../services/api';
import { INQUIRY_STATUSES, PROJECT_TYPES } from '../../data/misc';
import { fmtDate, timeAgo } from '../../utils/helpers';

function Detail({ item, onSave, onClose }) {
  const [status, setStatus] = useState(item.status); const [notes, setNotes] = useState(item.notes || ''); const [busy, setBusy] = useState(false);
  const go = async () => { setBusy(true); await onSave(item.id, { status, notes }); setBusy(false); };
  return (
    <div className="space-y-4 text-sm">
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-cream/70">
        <a href={`mailto:${item.email}`} className="flex items-center gap-1.5 hover:text-cream"><Mail size={14} />{item.email}</a>
        <a href={`tel:${item.phone}`} className="flex items-center gap-1.5 hover:text-cream"><Phone size={14} />{item.phone}</a>
        <span className="flex items-center gap-1.5"><MapPin size={14} />{item.location}</span>
      </div>
      <dl className="grid grid-cols-3 gap-3 a-card p-3 text-xs">
        <div><dt className="text-cream/40">Type</dt><dd>{item.projectType}</dd></div><div><dt className="text-cream/40">Budget</dt><dd>{item.budget || '—'}</dd></div><div><dt className="text-cream/40">Area</dt><dd>{item.area ? `${item.area} sq. ft.` : '—'}</dd></div>
      </dl>
      <div><p className="a-label">Message</p><p className="text-cream/85 whitespace-pre-wrap">{item.message}</p><p className="text-xs text-cream/40 mt-1">Received {fmtDate(item.createdAt)}</p></div>
      <div><label className="a-label" htmlFor="st">Status</label><select id="st" className="a-input" value={status} onChange={(e) => setStatus(e.target.value)}>{INQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
      <div><label className="a-label" htmlFor="nt">Internal notes</label><textarea id="nt" rows={3} className="a-input py-2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Only visible to your team" /></div>
      <div className="sticky bottom-0 -mx-5 -mb-5 mt-6 px-5 py-3 flex justify-end gap-2 bg-charcoal-800 border-t border-white/10"><button className="a-btn a-btn-ghost" onClick={onClose}>Close</button><button className="a-btn a-btn-primary" disabled={busy} onClick={go}>{busy ? 'Saving…' : 'Save changes'}</button></div>
    </div>
  );
}

export default function Inquiries() {
  const { data, loading, error, reload, setData } = useAsync(() => inquiriesApi.list(), []);
  const [q, setQ] = useState(''); const [type, setType] = useState('all'); const [status, setStatus] = useState('all');
  const [view, setView] = useState(null); const [del, setDel] = useState(null);
  const toast = useToast();
  const lastOpen = useRef(null); if (view) lastOpen.current = view; // keeps panel content while it slides out
  const rows = useMemo(() => [...(data || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).filter((i) =>
    (type === 'all' || i.projectType === type) && (status === 'all' || i.status === status) && `${i.name} ${i.email}`.toLowerCase().includes(q.toLowerCase())), [data, q, type, status]);

  const save = async (id, patch) => {
    try { const u = await inquiriesApi.update(id, patch); setData((d) => d.map((x) => (x.id === id ? { ...x, ...u } : x))); toast.success('Inquiry updated'); setView(null); }
    catch (e) { toast.error(e.message); }
  };
  const quickStatus = async (i, s) => { try { await inquiriesApi.update(i.id, { status: s }); setData((d) => d.map((x) => (x.id === i.id ? { ...x, status: s } : x))); toast.success(`Marked ${s}`); } catch (e) { toast.error(e.message); } };
  const remove = async () => { try { await inquiriesApi.remove(del.id); setData((d) => d.filter((x) => x.id !== del.id)); toast.success('Inquiry deleted'); } catch (e) { toast.error(e.message); } setDel(null); };

  const cols = [
    { key: 'name', header: 'Client', render: (i) => <div><p className="font-semibold">{i.name}</p><p className="text-xs text-cream/50">{i.email}</p></div> },
    { key: 'projectType', header: 'Project' }, { key: 'budget', header: 'Budget', render: (i) => i.budget || '—' },
    { key: 'createdAt', header: 'Received', render: (i) => <span className="text-cream/60 whitespace-nowrap">{timeAgo(i.createdAt)}</span> },
    { key: 'status', header: 'Status', render: (i) => <select aria-label={`Status for ${i.name}`} value={i.status} onChange={(e) => quickStatus(i, e.target.value)} className="a-input !min-h-[32px] !py-0 w-32 text-xs">{INQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}</select> },
    { key: 'a', header: <span className="sr-only">Actions</span>, className: 'text-right', render: (i) => <div className="flex justify-end">
      <button aria-label={`View inquiry from ${i.name}`} onClick={() => setView(i)} className="p-2 text-cream/60 hover:text-cream"><Eye size={16} /></button>
      <button aria-label={`Delete inquiry from ${i.name}`} onClick={() => setDel(i)} className="p-2 text-cream/60 hover:text-red-400"><Trash2 size={16} /></button></div> },
  ];
  return (
    <>
      <PageTitle title="Inquiries" text="Manage client enquiries and project requests." />
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]"><Search size={15} className="absolute left-3 top-3.5 text-cream/40" /><input className="a-input pl-9" placeholder="Search by name or email" aria-label="Search inquiries" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select className="a-input w-auto" aria-label="Filter by project type" value={type} onChange={(e) => setType(e.target.value)}><option value="all">All types</option>{PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        <select className="a-input w-auto" aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All statuses</option>{INQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      {error ? <ErrorState dark error={error} onRetry={reload} /> : <DataTable columns={cols} rows={rows} loading={loading} onRowClick={setView} />}
      <Drawer open={!!view} onClose={() => setView(null)} size="md" title={view ? `Inquiry from ${view.name}` : 'Inquiry'} subtitle={view ? fmtDate(view.createdAt) : ''}>{lastOpen.current && <Detail key={lastOpen.current.id} item={lastOpen.current} onSave={save} onClose={() => setView(null)} />}</Drawer>
      <ConfirmModal open={!!del} title="Delete inquiry?" message={`The inquiry from ${del?.name} will be permanently removed.`} onConfirm={remove} onClose={() => setDel(null)} />
    </>
  );
}
