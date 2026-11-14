import { useEffect, useState } from 'react';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';

/** columns: [{ key, header, render?(row), className? }]  — scrolls horizontally on small screens. */
export default function DataTable({ columns, rows, loading, pageSize = 8, empty, rowKey = 'id', onRowClick }) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  useEffect(() => { if (page > pages) setPage(pages); }, [pages, page]);
  useEffect(() => { setPage(1); }, [rows.length]);
  const slice = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="a-card overflow-hidden">
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead><tr className="text-left text-xs text-cream/50 border-b border-white/[0.06]">
            {columns.map((c) => <th key={c.key} scope="col" className={`px-4 py-3 font-semibold ${c.className || ''}`}>{c.header}</th>)}
          </tr></thead>
          <tbody>
            {loading && Array.from({ length: 5 }, (_, i) => <tr key={i} className="border-b border-white/[0.04]">{columns.map((c) => <td key={c.key} className="px-4 py-4"><div className="h-4 rounded bg-white/5 animate-pulse" /></td>)}</tr>)}
            {!loading && slice.map((r) => (
              <tr key={r[rowKey]} onClick={onRowClick ? () => onRowClick(r) : undefined} className={`border-b border-white/[0.04] hover:bg-white/[0.02] ${onRowClick ? 'cursor-pointer' : ''}`}>
                {columns.map((c) => <td key={c.key} className={`px-4 py-3 text-cream/85 ${c.className || ''}`}>{c.render ? c.render(r) : r[c.key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!loading && rows.length === 0 && (empty || <EmptyState dark title="No results" text="Try changing your search or filters." />)}
      {!loading && rows.length > pageSize && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-white/[0.06] text-xs text-cream/50">
          <span>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, rows.length)} of {rows.length}</span>
          <Pagination dark page={page} pages={pages} onChange={setPage} />
        </div>
      )}
    </div>
  );
}
