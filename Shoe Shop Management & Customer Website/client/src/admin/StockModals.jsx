import { useState } from 'react';
import { api } from '../lib/api.js';
import { useFetch, useToast } from '../lib/hooks.jsx';
import { Field, Modal } from '../components/ui.jsx';

const title = (r) => `${r.product} · ${r.color} · size ${r.size}`;

export function ReceiveModal({ row, onClose, onDone }) {
  const toast = useToast();
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const n = parseInt(quantity, 10);

  async function submit(e) {
    e.preventDefault(); setErr(null);
    if (!/^\d+$/.test(quantity) || n < 1) return setErr('Enter how many pairs you received (1 or more)');
    setBusy(true);
    try {
      const r = await api.post('/api/admin/stock/receive', { productId: row.productId, colorId: row.colorId, sizeId: row.sizeId, quantity: n, note });
      toast.success(`Received ${n} pairs. Stock is now ${r.quantity}.`); onDone(); onClose();
    } catch (ex) { setErr(ex.message); } finally { setBusy(false); }
  }
  return (
    <Modal title="Receive stock" onClose={onClose}>
      <p><strong>{title(row)}</strong><br /><span className="muted small">Current stock: {row.quantity} pairs</span></p>
      <form onSubmit={submit} noValidate>
        <Field label="Pairs received" required><input type="number" min="1" step="1" inputMode="numeric" value={quantity} onChange={(e) => setQuantity(e.target.value)} autoFocus /></Field>
        <Field label="Supplier / invoice no. (optional)"><input value={note} maxLength={200} onChange={(e) => setNote(e.target.value)} /></Field>
        {Number.isFinite(n) && n > 0 && <p className="small">New stock will be <strong>{row.quantity + n}</strong> pairs.</p>}
        {err && <div className="alert error" role="alert">{err}</div>}
        <div className="actions"><button type="button" className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy}>{busy ? 'Saving…' : 'Receive stock'}</button></div>
      </form>
    </Modal>
  );
}

export function AdjustModal({ row, onClose, onDone }) {
  const toast = useToast();
  const { data } = useFetch('/api/admin/stock/reasons');
  const [reason, setReason] = useState('Sold');
  const [mode, setMode] = useState('DECREASE');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const reasons = data?.reasons || [];
  const cur = reasons.find((r) => r.name === reason);
  const n = /^\d+$/.test(quantity) ? parseInt(quantity, 10) : null;
  const next = n == null ? null : mode === 'SET' ? n : mode === 'INCREASE' ? row.quantity + n : row.quantity - n;

  function pickReason(name) {
    setReason(name);
    const r = reasons.find((x) => x.name === name);
    if (r?.mode) setMode(r.mode);
  }
  async function submit(e) {
    e.preventDefault(); setErr(null);
    if (n == null) return setErr('Enter a whole number (0 or more)');
    if (next < 0) return setErr(`You cannot remove ${n} — only ${row.quantity} in stock`);
    if (next === row.quantity) return setErr('That would not change the stock');
    if (cur?.noteRequired && !note.trim()) return setErr(`Add a note explaining “${reason}”`);
    setBusy(true);
    try {
      await api.post('/api/admin/stock/adjust', { productId: row.productId, colorId: row.colorId, sizeId: row.sizeId, mode, quantity: n, reason, note });
      toast.success(`Stock updated: ${row.quantity} → ${next}`); onDone(); onClose();
    } catch (ex) { setErr(ex.message); } finally { setBusy(false); }
  }
  const locked = cur?.mode;
  return (
    <Modal title="Adjust stock" onClose={onClose}>
      <p><strong>{title(row)}</strong><br /><span className="muted small">Current stock: {row.quantity} pairs</span></p>
      <form onSubmit={submit} noValidate>
        <Field label="Reason" required>
          <select value={reason} onChange={(e) => pickReason(e.target.value)}>{reasons.map((r) => <option key={r.name}>{r.name}</option>)}</select>
        </Field>
        <div className="seg" role="radiogroup" aria-label="Adjustment type">
          {[['DECREASE', 'Remove'], ['INCREASE', 'Add'], ['SET', 'Set count to']].map(([v, l]) => (
            <button key={v} type="button" role="radio" aria-checked={mode === v} className={mode === v ? 'on' : ''} disabled={!!locked && locked !== v} onClick={() => setMode(v)}>{l}</button>
          ))}
        </div>
        <Field label={mode === 'SET' ? 'New pair count' : 'Pairs'} required><input type="number" min="0" step="1" inputMode="numeric" value={quantity} onChange={(e) => setQuantity(e.target.value)} autoFocus /></Field>
        <Field label={`Note${cur?.noteRequired ? '' : ' (optional)'}`} required={cur?.noteRequired}><input value={note} maxLength={200} onChange={(e) => setNote(e.target.value)} /></Field>
        {next != null && <p className="small">Stock will change <strong>{row.quantity} → {next}</strong> ({next - row.quantity > 0 ? '+' : ''}{next - row.quantity}).</p>}
        {err && <div className="alert error" role="alert">{err}</div>}
        <div className="actions"><button type="button" className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy}>{busy ? 'Saving…' : 'Save adjustment'}</button></div>
      </form>
    </Modal>
  );
}
