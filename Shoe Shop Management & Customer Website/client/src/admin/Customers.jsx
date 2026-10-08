import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, qs } from '../lib/api.js';
import { useDebounced, useFetch, useToast } from '../lib/hooks.jsx';
import { Empty, ErrorBox, Modal, Spinner, fmtDate, useConfirm } from '../components/ui.jsx';

const STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'];
const LABEL = { PENDING: 'Pending', APPROVED: 'Approved', REJECTED: 'Rejected', SUSPENDED: 'Suspended' };
const Status = ({ s }) => <span className={`badge status-${s.toLowerCase()}`}>{LABEL[s]}</span>;

export default function Customers() {
  const [sp, setSp] = useSearchParams();
  const status = sp.get('status') || '';
  const [q, setQ] = useState('');
  const dq = useDebounced(q);
  const { data, error, loading, reload } = useFetch(`/api/admin/customers${qs({ status, q: dq })}`);
  const toast = useToast();
  const confirm = useConfirm();
  const [view, setView] = useState(null);

  async function setStatus(c, next) {
    const verb = { APPROVED: c.status === 'SUSPENDED' ? 'Reactivate' : 'Approve', REJECTED: 'Reject', SUSPENDED: 'Suspend' }[next];
    if (next !== 'APPROVED' && !(await confirm({ title: `${verb} customer?`, message: `${verb} ${c.shopName}? ${next === 'APPROVED' ? '' : 'They will lose access to wholesale prices immediately.'}`, confirmLabel: verb, danger: true }))) return;
    try { await api.patch(`/api/admin/customers/${c.id}/status`, { status: next }); toast.success(`${c.shopName}: ${LABEL[next].toLowerCase()}`); reload(); setView(null); } catch (e) { toast.error(e.message); }
  }
  async function remove(c) {
    if (!(await confirm({ title: 'Delete customer?', message: `Permanently delete ${c.shopName} and their login? This cannot be undone.`, confirmLabel: 'Delete', danger: true }))) return;
    try { await api.del(`/api/admin/customers/${c.id}`); toast.success('Customer deleted'); setView(null); reload(); } catch (e) { toast.error(e.message); }
  }
  const actions = (c) => (
    <>
      {c.status !== 'APPROVED' && <button className="btn sm primary" onClick={() => setStatus(c, 'APPROVED')}>{c.status === 'SUSPENDED' ? 'Reactivate' : 'Approve'}</button>}
      {c.status === 'PENDING' && <button className="btn sm danger-o" onClick={() => setStatus(c, 'REJECTED')}>Reject</button>}
      {c.status === 'APPROVED' && <button className="btn sm danger-o" onClick={() => setStatus(c, 'SUSPENDED')}>Suspend</button>}
    </>
  );

  return (
    <>
      <div className="page-head"><h1>Customers</h1></div>
      <div className="tabs-bar" role="tablist">
        {[['', 'All'], ...STATUSES.map((s) => [s, LABEL[s]])].map(([v, l]) => (
          <button key={v} role="tab" aria-selected={status === v} className={status === v ? 'active' : ''} onClick={() => { const n = new URLSearchParams(sp); v ? n.set('status', v) : n.delete('status'); setSp(n, { replace: true }); }}>
            {l}{data && v ? ` (${data.counts[v] || 0})` : ''}
          </button>
        ))}
      </div>
      <div className="toolbar"><input type="search" placeholder="Search shop, owner or mobile…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search customers" /></div>
      {loading ? <Spinner /> : error ? <ErrorBox error={error} onRetry={reload} /> : data.customers.length === 0 ? <Empty title="No customers found" /> : (
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Shop</th><th>Proprietor</th><th>Mobile</th><th>Registered</th><th>Status</th><th>Wholesale</th><th></th></tr></thead>
          <tbody>{data.customers.map((c) => (
            <tr key={c.id} className={c.status === 'PENDING' ? 'highlight' : ''}>
              <td><strong>{c.shopName}</strong></td><td>{c.ownerName}</td><td>{c.mobile}</td><td>{fmtDate(c.createdAt)}</td>
              <td><Status s={c.status} /></td><td>{c.wholesaleAccess ? 'Yes' : 'No'}</td>
              <td className="actions-cell">{actions(c)} <button className="btn sm" onClick={() => setView(c.id)}>Details</button></td>
            </tr>))}
          </tbody>
        </table></div>
      )}
      {view && <Detail id={view} onClose={() => setView(null)} actions={actions} onDelete={remove} />}
    </>
  );
}

function Detail({ id, onClose, actions, onDelete }) {
  const { data, loading, error } = useFetch(`/api/admin/customers/${id}`);
  return (
    <Modal title="Customer details" onClose={onClose}>
      {loading ? <Spinner /> : error ? <ErrorBox error={error} /> : (
        <>
          <dl className="kv">
            <div><dt>Shop name</dt><dd>{data.customer.shopName}</dd></div>
            <div><dt>Proprietor</dt><dd>{data.customer.ownerName}</dd></div>
            <div><dt>Mobile</dt><dd>{data.customer.mobile}</dd></div>
            <div><dt>Email</dt><dd>{data.customer.email || '—'}</dd></div>
            <div><dt>Address</dt><dd>{data.customer.address || '—'}</dd></div>
            <div><dt>Registered</dt><dd>{fmtDate(data.customer.createdAt)}</dd></div>
            <div><dt>Status</dt><dd><Status s={data.customer.status} /></dd></div>
            <div><dt>Wholesale access</dt><dd>{data.customer.wholesaleAccess ? 'Enabled' : 'Not enabled'}</dd></div>
          </dl>
          <h3>History</h3>
          <ul className="history">{data.history.map((h, i) => <li key={i}><Status s={h.status} /> <span className="small muted">{fmtDate(h.createdAt)}{h.admin ? ` by ${h.admin}` : ''}{h.note ? ` · ${h.note}` : ''}</span></li>)}</ul>
          <div className="actions">{actions(data.customer)} <button className="btn sm danger-o" onClick={() => onDelete(data.customer)}>Delete</button></div>
        </>
      )}
    </Modal>
  );
}
