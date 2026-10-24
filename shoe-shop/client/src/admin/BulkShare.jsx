import { useState, useMemo } from 'react';
import { useFetch } from '../lib/hooks.jsx';
import { api } from '../lib/api.js';

export default function BulkShare() {
  const { data } = useFetch('/api/admin/products?limit=200');
  const products = data?.items || [];
  const eligible = useMemo(() => products.flatMap((p) => (p.images || []).map((url, i) => ({ url, name: p.name, pid: p.id, idx: i }))).filter((it) => /\.(jpe?g|png|webp|mp4)$/i.test(it.url)), []);
  const [sel, setSel] = useState(new Set());
  const toggle = (k) => { const s=new Set(sel); s.has(k)?s.delete(k):s.add(k); setSel(s); };
  const clear = () => setSel(new Set());
  const selected = eligible.filter((_,i)=>sel.has(i));
  const share = async () => {
    if (!selected.length) return;
    const files = await Promise.all(selected.map(async (it) => { try { const r=await fetch(it.url); return await r.blob(); } catch(e){ return null; } }));
    const valid = files.filter(Boolean);
    if (valid.length === 1 && navigator.canShare) { try { await navigator.share({ files: [new File(valid,["share"])] }); return; } catch(e){} }
    // fallback: download links
    selected.forEach((it) => { const a=document.createElement('a'); a.href=it.url; a.download=it.url.split('/').pop(); document.body.appendChild(a); a.click(); document.body.removeChild(a); });
  };
  return (
    <div className="container page">
      <h1>Bulk Share — Photos & MP4</h1>
      <div className="page-head"><span>Eligible items: {eligible.length}</span><button className="btn sm" onClick={clear}>Clear</button></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:12}}>
        {eligible.map((it,i)=>{
          const k=i; const isSel=sel.has(k); return (
            <button key={k} onClick={()=>toggle(k)} style={{border:isSel?'2px solid var(--accent)':'1px solid var(--border)',background:'var(--surface)',borderRadius:12,overflow:'hidden',textAlign:'left',padding:0}} aria-pressed={isSel}>
              <div style={{aspectRatio:'1',overflow:'hidden'}}>{it.url.endsWith('.mp4')?<video src={it.url} style={{width:'100%',height:'100%',objectFit:'cover'}} preload="metadata" muted/>:<img src={it.url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>}</div>
              <div style={{padding:8,fontSize:12}}><strong>{it.name}</strong><br/>SELECTED={isSel?'✓':''}</div>
            </button>
          );
        })}
      </div>
      <div className="page-head" style={{marginTop:16}}>
        <span>Selected: {selected.length}</span>
        <button className="btn primary" onClick={share} disabled={!selected.length}>Share / Download</button>
      </div>
      <p className="small muted">Only photos and MP4 videos are selectable. Multiple-file native share depends on browser/platform support; fallback downloads selected files.</p>
    </div>
  );
}
