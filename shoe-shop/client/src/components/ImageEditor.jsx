import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from './ui.jsx';

// Lightweight, dependency-free image editor. It crops via a fixed frame that the image is
// dragged/zoomed underneath, and supports rotate, flip and basic brightness/contrast.
// The visible canvas is exported directly, so what the admin sees is exactly what is saved.

const ASPECTS = [
  { key: '1:1', label: 'Square', ratio: 1 },
  { key: '4:5', label: 'Portrait', ratio: 4 / 5 },
  { key: '4:3', label: 'Landscape', ratio: 4 / 3 },
  { key: 'free', label: 'Original', ratio: null },
];

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export default function ImageEditor({ src, onCancel, onSave }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const dragRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [aspect, setAspect] = useState('1:1');

  const outSize = useCallback(() => {
    const img = imgRef.current;
    const a = ASPECTS.find((x) => x.key === aspect);
    const long = 900;
    if (!img || a.ratio == null) {
      const iw = img?.naturalWidth || 1, ih = img?.naturalHeight || 1;
      return iw >= ih ? { w: long, h: Math.round((long * ih) / iw) } : { w: Math.round((long * iw) / ih), h: long };
    }
    return a.ratio >= 1 ? { w: long, h: Math.round(long / a.ratio) } : { w: Math.round(long * a.ratio), h: long };
  }, [aspect]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current, img = imgRef.current;
    if (!canvas || !img || !img.naturalWidth) return;
    const { w, h } = outSize();
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    ctx.translate(w / 2, h / 2);
    const rot = ((rotation % 360) + 360) % 360;
    const rw = rot % 180 === 0 ? img.naturalWidth : img.naturalHeight;
    const rh = rot % 180 === 0 ? img.naturalHeight : img.naturalWidth;
    const scale = Math.max(w / rw, h / rh) * zoom;
    ctx.scale(scale, scale);
    if (flipH) ctx.scale(-1, 1);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.translate(offset.x, offset.y);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    ctx.restore();
  }, [outSize, brightness, contrast, rotation, flipH, zoom, offset]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { imgRef.current = img; setReady(true); };
    img.onerror = () => setReady(false);
    img.src = src;
  }, [src]);

  useEffect(() => { if (ready) draw(); }, [ready, draw]);

  const onPointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture?.(e.pointerId);
    const rect = canvas.getBoundingClientRect();
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: offset.x, oy: offset.y, scale: canvas.width / rect.width };
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const d = dragRef.current;
    setOffset({ x: d.ox + (e.clientX - d.startX) * d.scale, y: d.oy + (e.clientY - d.startY) * d.scale });
  };
  const onPointerUp = () => { dragRef.current = null; };

  const reset = () => { setRotation(0); setFlipH(false); setZoom(1); setOffset({ x: 0, y: 0 }); setBrightness(100); setContrast(100); };

  async function save() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setBusy(true);
    try {
      const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', 0.9));
      if (!blob) throw new Error('Could not process the image');
      await onSave(blob);
    } finally { setBusy(false); }
  }

  const size = outSize();
  return (
    <Modal title="Edit image" onClose={onCancel} wide>
      <div className="img-editor">
        <div className="img-editor-stage">
          <canvas
            ref={canvasRef}
            style={{ aspectRatio: `${size.w} / ${size.h}`, touchAction: 'none' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          />
          {!ready && <p className="muted small">Loading image…</p>}
          <p className="small muted">Drag the photo to reposition it inside the frame.</p>
        </div>
        <div className="img-editor-controls">
          <div className="field">
            <span className="label">Crop shape</span>
            <div className="chips">
              {ASPECTS.map((a) => (
                <button type="button" key={a.key} className={`chip ${aspect === a.key ? 'on' : ''}`} onClick={() => setAspect(a.key)}>{a.label}</button>
              ))}
            </div>
          </div>
          <div className="editor-actions">
            <button type="button" className="btn sm" onClick={() => setRotation((r) => r + 90)}>Rotate ⟳</button>
            <button type="button" className="btn sm" onClick={() => setRotation((r) => r - 90)}>Rotate ⟲</button>
            <button type="button" className={`btn sm ${flipH ? 'primary' : ''}`} onClick={() => setFlipH((f) => !f)}>Flip</button>
            <button type="button" className="btn sm" onClick={reset}>Reset</button>
          </div>
          <label className="field"><span className="label">Zoom</span>
            <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
          </label>
          <label className="field"><span className="label">Brightness</span>
            <input type="range" min="50" max="150" step="1" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} />
          </label>
          <label className="field"><span className="label">Contrast</span>
            <input type="range" min="50" max="150" step="1" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} />
          </label>
        </div>
      </div>
      <div className="actions">
        <button type="button" className="btn" onClick={onCancel} disabled={busy}>Cancel</button>
        <button type="button" className="btn primary" onClick={save} disabled={busy || !ready}>{busy ? 'Saving…' : 'Apply & save'}</button>
      </div>
    </Modal>
  );
}
