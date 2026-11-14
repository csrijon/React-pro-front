import { useState } from 'react';
import Modal from './Modal';

export default function ConfirmModal({ open, title = 'Delete item?', message, confirmLabel = 'Delete', onConfirm, onClose }) {
  const [busy, setBusy] = useState(false);
  const go = async () => { setBusy(true); try { await onConfirm(); } finally { setBusy(false); } };
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-cream/70">{message || 'This action cannot be undone.'}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button className="a-btn a-btn-ghost" onClick={onClose} disabled={busy}>Cancel</button>
        <button className="a-btn a-btn-danger" onClick={go} disabled={busy}>{busy ? 'Working…' : confirmLabel}</button>
      </div>
    </Modal>
  );
}
