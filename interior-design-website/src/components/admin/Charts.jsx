// Dependency-free SVG charts tuned for the dark admin theme.
const COLORS = ['#A7B49B', '#D8C8B4', '#4f8a6b', '#c9a227', '#8a6bb0'];

export function AreaChart({ data, height = 180 }) {
  const w = 600; const pad = 24;
  const max = Math.max(...data.map((d) => d.value), 1) * 1.1;
  const pts = data.map((d, i) => [pad + (i * (w - pad * 2)) / Math.max(data.length - 1, 1), height - pad - (d.value / max) * (height - pad * 2)]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
  const area = `${line} L${pts.at(-1)[0]},${height - pad} L${pts[0][0]},${height - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" role="img" aria-label="Line chart">
      <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#A7B49B" stopOpacity=".35" /><stop offset="1" stopColor="#A7B49B" stopOpacity="0" /></linearGradient></defs>
      {[0, 0.5, 1].map((t) => <line key={t} x1={pad} x2={w - pad} y1={pad + t * (height - pad * 2)} y2={pad + t * (height - pad * 2)} stroke="#fff" strokeOpacity=".07" />)}
      <path d={area} fill="url(#ag)" /><path d={line} fill="none" stroke="#A7B49B" strokeWidth="2.5" strokeLinejoin="round" />
      {pts.map((p, i) => <g key={i}><circle cx={p[0]} cy={p[1]} r="4" fill="#173D2E" stroke="#A7B49B" strokeWidth="2"><title>{`${data[i].label}: ${data[i].value}`}</title></circle>
        <text x={p[0]} y={height - 6} textAnchor="middle" fontSize="12" fill="#F5F0E7" fillOpacity=".5">{data[i].label}</text></g>)}
    </svg>
  );
}

export function BarList({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <ul className="space-y-3">
      {data.map((d, i) => (
        <li key={d.label}>
          <div className="flex justify-between text-xs text-cream/70 mb-1"><span className="truncate pr-2">{d.label}</span><span className="tabular-nums">{d.value.toLocaleString()}</span></div>
          <div className="h-2 rounded bg-white/5"><div className="h-2 rounded" style={{ width: `${(d.value / max) * 100}%`, background: COLORS[i % COLORS.length], transition: 'width .8s' }} /></div>
        </li>
      ))}
    </ul>
  );
}

export function Donut({ data, size = 150 }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = 52; const c = 2 * Math.PI * r; let acc = 0;
  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox="0 0 140 140" width={size} height={size} role="img" aria-label="Donut chart" className="-rotate-90 shrink-0">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#fff" strokeOpacity=".06" strokeWidth="18" />
        {data.map((d, i) => { const len = (d.value / total) * c; const el = <circle key={d.label} cx="70" cy="70" r={r} fill="none" stroke={COLORS[i % COLORS.length]} strokeWidth="18" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-acc}><title>{`${d.label}: ${d.value}`}</title></circle>; acc += len; return el; })}
      </svg>
      <ul className="space-y-1.5 text-xs text-cream/70">
        {data.map((d, i) => <li key={d.label} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />{d.label}<span className="text-cream/40">{Math.round((d.value / total) * 100)}%</span></li>)}
      </ul>
    </div>
  );
}
