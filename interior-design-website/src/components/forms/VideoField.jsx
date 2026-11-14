import { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { mediaApi } from '../../services/api';

/** Controlled field: paste a YouTube/Vimeo/MP4 link or upload a video file (stored in the media library). */
export default function VideoField({ value, onChange, error }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const pick = async (file) => {
    if (!file) return;
    setMsg(''); setBusy(true);
    try { const m = await mediaApi.upload(file); onChange(m.url); }
    catch (e) { setMsg(e.message); }
    setBusy(false);
  };
  return (
    <div>
      <div className="flex gap-2">
        <input className="a-input" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="Paste a YouTube, Vimeo or .mp4 link — or upload" aria-label="Video link" />
        <button type="button" className="a-btn a-btn-ghost shrink-0" disabled={busy} onClick={() => input.current.click()}>
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}{busy ? 'Uploading…' : 'Upload'}
        </button>
        <input ref={input} hidden type="file" accept="video/mp4,video/webm,video/quicktime,video/x-m4v" onChange={(e) => { pick(e.target.files[0]); e.target.value = ''; }} />
      </div>
      {(msg || error) && <p role="alert" className="a-err">{msg || error}</p>}
    </div>
  );
}
