import { useMemo, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import PageTitle from '../../components/admin/PageTitle';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmModal from '../../components/common/ConfirmModal';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { useAsync } from '../../hooks/useAsync';
import { useToast } from '../../context/ToastContext';
import { projectsApi, pagesApi } from '../../services/api';
import { CATEGORIES } from '../../data/projects';

export default function AdminProjects() {
  const { data, loading, error, reload, setData } = useAsync(() => projectsApi.list(), []);
  const { data: pages } = useAsync(() => pagesApi.get(), []);
  const [q, setQ] = useState(''); const [cat, setCat] = useState('all'); const [status, setStatus] = useState('all');
  const [del, setDel] = useState(null);
  const toast = useToast(); const navigate = useNavigate();
  const refresh = async () => setData(await projectsApi.list()); // silent reload used by the editor drawer

  const rows = useMemo(() => (data || []).filter((p) =>
    (cat === 'all' || p.category === cat) && (status === 'all' || p.status === status) &&
    `${p.title} ${p.location}`.toLowerCase().includes(q.toLowerCase())), [data, q, cat, status]);

  const toggle = async (p) => {
    try { const u = await projectsApi.togglePublish(p); setData((d) => d.map((x) => (x.id === p.id ? { ...x, ...u } : x))); toast.success(u.status === 'published' ? 'Published' : 'Moved to drafts'); }
    catch (e) { toast.error(e.message); }
  };
  const remove = async () => {
    try { await projectsApi.remove(del.id); setData((d) => d.filter((x) => x.id !== del.id)); toast.success('Project deleted'); } catch (e) { toast.error(e.message); }
    setDel(null);
  };

  const cols = [
    { key: 'title', header: 'Project', render: (p) => (
      <div className="flex items-center gap-3"><img src={p.cover} alt="" className="h-10 w-14 rounded object-cover bg-charcoal-800" loading="lazy" /><div className="min-w-0"><p className="font-semibold truncate">{p.title}</p>{p.featured && <p className="text-[11px] text-sage">Featured</p>}</div></div>) },
    { key: 'category', header: 'Category' }, { key: 'location', header: 'Location' },
    { key: 'status', header: 'Status', render: (p) => <StatusBadge status={p.status} /> },
    { key: 'actions', header: <span className="sr-only">Actions</span>, className: 'text-right', render: (p) => (
      <div className="flex justify-end gap-0.5" onClick={(e) => e.stopPropagation()}>
        <a href={`/projects/${p.slug}`} target="_blank" rel="noreferrer" title="View" aria-label={`View ${p.title}`} className="p-2 text-cream/60 hover:text-cream"><ExternalLink size={16} /></a>
        <button title={p.status === 'published' ? 'Unpublish' : 'Publish'} aria-label={p.status === 'published' ? `Unpublish ${p.title}` : `Publish ${p.title}`} onClick={() => toggle(p)} className="p-2 text-cream/60 hover:text-cream">{p.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}</button>
        <Link to={`/admin/projects/${p.id}/edit`} title="Edit" aria-label={`Edit ${p.title}`} className="p-2 text-cream/60 hover:text-cream"><Pencil size={16} /></Link>
        <button title="Delete" aria-label={`Delete ${p.title}`} onClick={() => setDel(p)} className="p-2 text-cream/60 hover:text-red-400"><Trash2 size={16} /></button>
      </div>) },
  ];

  return (
    <>
      <PageTitle title="Projects" text="Manage and organise your design projects."><Link to="/admin/projects/new" className="a-btn a-btn-primary"><Plus size={16} />Add project</Link></PageTitle>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]"><Search size={15} className="absolute left-3 top-3.5 text-cream/40" /><input className="a-input pl-9" placeholder="Search projects" aria-label="Search projects" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select className="a-input w-auto" aria-label="Filter by category" value={cat} onChange={(e) => setCat(e.target.value)}><option value="all">All categories</option>{[...new Set([...(pages?.site?.categories || CATEGORIES), ...(data || []).map((p) => p.category)].filter(Boolean))].map((c) => <option key={c}>{c}</option>)}</select>
        <select className="a-input w-auto" aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option></select>
      </div>
      {error ? <ErrorState dark error={error} onRetry={reload} /> : (
        <DataTable columns={cols} rows={rows} loading={loading} onRowClick={(p) => navigate(`/admin/projects/${p.id}/edit`)}
          empty={<EmptyState dark title="No projects found" text="Adjust your filters or add a new project." action={<Link to="/admin/projects/new" className="a-btn a-btn-primary">Add project</Link>} />} />
      )}
      <Outlet context={{ refresh }} />
      <ConfirmModal open={!!del} title="Delete project?" message={`“${del?.title}” will be permanently removed from the website. This cannot be undone.`} onConfirm={remove} onClose={() => setDel(null)} />
    </>
  );
}
