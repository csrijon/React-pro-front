import { useMemo, useRef, useState } from 'react';
import { Search, Upload, Trash2, Copy, Eye } from 'lucide-react';
import PageTitle from '../../components/admin/PageTitle';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAsync } from '../../hooks/useAsync';
import { useToast } from '../../context/ToastContext';
import { mediaApi } from '../../services/api';
import { fmtSize } from '../../utils/helpers';
import { isVideoFile } from '../../utils/video';

export default function Media() {
  const { data, loading, error, reload, setData } = useAsync(() => mediaApi.list(), []);
  const [q, setQ] = useState(''); const [type, setType] = useState('all');
  const [preview, setPreview] = useState(null); const [del, setDel] = useState(null); const [busy, setBusy] = useState(false);
  const input = useRef(null); const toast = useToast();
  const rows = useMemo(() => (data || []).filter((m) => (type === 'all' || m.type === type) && m.name.toLowerCase().includes(q.toLowerCase())), [data, q, type]);

  const upload = async (files) => {
    setBusy(true);
    try {
      for (const f of [...files].filter((x) => x.type.startsWith('image/') || x.type.startsWith('video/'))) {
        const m = await mediaApi.upload(f);
        setData((d) => [m, ...d]);
      }
      toast.success('Upload complete');
    } catch (e) { toast.error(e.message); }
    setBusy(false);
  };
  const copy = async (m) => { try { await navigator.clipboard.writeText(m.url.startsWith('/') ? `${location.origin}${m.url}` : m.url); toast.success('URL copied'); } catch { toast.error('Could not copy. Select and copy the URL manually.'); } };
  const remove = async () => { try { await mediaApi.remove(del.id); setData((d) => d.filter((x) => x.id !== del.id)); toast.success('File deleted'); } catch (e) { toast.error(e.message); } setDel(null); };
  const types = [...new Set((data || []).map((m) => m.type))];

  return (
    <>
      <PageTitle title="Media library" text="Upload and manage images and videos used across the website.">
        <button className="a-btn a-btn-primary" disabled={busy} onClick={() => input.current.click()}><Upload size={16} />{busy ? 'Uploading…' : 'Upload files'}</button>
        <input ref={input} hidden type="file" accept="image/*,video/mp4,video/webm,video/quicktime" multiple onChange={(e) => { upload(e.target.files); e.target.value = ''; }} />
      </PageTitle>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]"><Search size={15} className="absolute left-3 top-3.5 text-cream/40" /><input className="a-input pl-9" placeholder="Search media" aria-label="Search media" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select className="a-input w-auto" aria-label="Filter by file type" value={type} onChange={(e) => setType(e.target.value)}><option value="all">All file types</option>{types.map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}</select>
      </div>
      {loading ? <LoadingSpinner dark /> : error ? <ErrorState dark error={error} onRetry={reload} /> : rows.length === 0 ? <EmptyState dark title="No media found" text="Upload files or clear your search." /> : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {rows.map((m) => (
            <li key={m.id} className="a-card overflow-hidden group">
              <button className="block w-full aspect-square bg-charcoal-800" onClick={() => setPreview(m)} aria-label={`Preview ${m.name}`}>{isVideoFile(m.url) ? <video src={m.url} muted preload="metadata" className="h-full w-full object-cover" /> : <img src={m.url} alt={m.name} loading="lazy" className="h-full w-full object-cover" />}</button>
              <div className="p-2.5"><p className="text-xs font-semibold truncate" title={m.name}>{m.name}</p><p className="text-[11px] text-cream/40">{m.type.toUpperCase()} · {fmtSize(m.size)}</p>
                <div className="flex gap-0.5 mt-1 -ml-1.5">
                  <button aria-label="Preview" onClick={() => setPreview(m)} className="p-1.5 text-cream/60 hover:text-cream"><Eye size={15} /></button>
                  <button aria-label="Copy URL" onClick={() => copy(m)} className="p-1.5 text-cream/60 hover:text-cream"><Copy size={15} /></button>
                  <button aria-label="Delete" onClick={() => setDel(m)} className="p-1.5 text-cream/60 hover:text-red-400"><Trash2 size={15} /></button></div></div>
            </li>
          ))}
        </ul>
      )}
      <Modal wide open={!!preview} onClose={() => setPreview(null)} title={preview?.name || ''}>{preview && (isVideoFile(preview.url) ? <video src={preview.url} controls autoPlay className="w-full max-h-[70vh]" /> : <img src={preview.url} alt={preview.name} className="w-full max-h-[70vh] object-contain" />)}</Modal>
      <ConfirmModal open={!!del} title="Delete file?" message={`${del?.name} will be removed from the library. Pages using it may show a broken image.`} onConfirm={remove} onClose={() => setDel(null)} />
    </>
  );
}
