import { propertyStatuses } from '../../data/misc'
import { useSite } from '../../context/SiteContext'
import { budgetUnit, currencySymbol } from '../../utils/format'

const Group = ({ title, children }) => <fieldset className="border-t border-line pt-4 first:border-0 first:pt-0"><legend className="mb-2.5 text-sm font-semibold">{title}</legend>{children}</fieldset>

export default function FilterPanel({ f, set, locations, onReset }) {
  const { site } = useSite()
  const propertyTypes = site.options.propertyTypes, furnishingOptions = site.options.furnishing
  const rent = f.purpose === 'Rent'
  const bu = budgetUnit()
  const unit = rent ? 1 : bu.size
  const toDisp = (v) => (v === '' || v == null ? '' : Math.round(Number(v) / unit * 100) / 100)
  const fromDisp = (v) => (v === '' ? '' : String(Math.round(Number(v) * unit)))
  const pill = (active) => `rounded-lg border px-3.5 py-2 text-sm font-medium transition ${active ? 'border-primary bg-primary text-white' : 'border-line bg-white hover:border-primary'}`
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Filters</h2><button onClick={onReset} className="text-sm font-medium text-accent hover:underline">Reset</button></div>
      <Group title="Purpose">
        <div className="flex gap-2">{['', 'Buy', 'Rent'].map((p) => <button key={p} type="button" className={pill(f.purpose === p)} onClick={() => set({ purpose: p, min: '', max: '' })}>{p || 'All'}</button>)}</div>
      </Group>
      <Group title="Property type">
        <div className="space-y-2">{propertyTypes.map((t) => (
          <label key={t} className="flex cursor-pointer items-center gap-2.5 text-sm"><input type="checkbox" className="h-4 w-4 rounded accent-accent" checked={f.type.split(',').includes(t)}
            onChange={(e) => { const cur = f.type.split(',').filter(Boolean); set({ type: (e.target.checked ? [...cur, t] : cur.filter((x) => x !== t)).join(',') }) }} />{t}</label>
        ))}</div>
      </Group>
      <Group title={`Budget (${rent ? `${currencySymbol()} / month` : `${currencySymbol()} ${bu.label}`})`}>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" min="0" className="input" placeholder="Min" aria-label="Minimum budget" value={toDisp(f.min)} onChange={(e) => set({ min: fromDisp(e.target.value) })} />
          <input type="number" min="0" className="input" placeholder="Max" aria-label="Maximum budget" value={toDisp(f.max)} onChange={(e) => set({ max: fromDisp(e.target.value) })} />
        </div>
      </Group>
      <Group title="Bedrooms"><div className="flex flex-wrap gap-2">{['', '1', '2', '3', '4', '5'].map((b) => <button key={b} type="button" className={pill(f.beds === b)} onClick={() => set({ beds: b })}>{b ? (b === '5' ? '5+' : b) : 'Any'}</button>)}</div></Group>
      <Group title="Bathrooms"><div className="flex flex-wrap gap-2">{['', '1', '2', '3', '4'].map((b) => <button key={b} type="button" className={pill(f.baths === b)} onClick={() => set({ baths: b })}>{b ? (b === '4' ? '4+' : b) : 'Any'}</button>)}</div></Group>
      <Group title="Location">
        <select className="input" value={f.location} onChange={(e) => set({ location: e.target.value })} aria-label="Location">
          <option value="">All locations</option>{locations.map((l) => <option key={l}>{l}</option>)}
        </select>
      </Group>
      <Group title="Furnishing"><select className="input" value={f.furnishing} onChange={(e) => set({ furnishing: e.target.value })} aria-label="Furnishing"><option value="">Any</option>{furnishingOptions.map((o) => <option key={o}>{o}</option>)}</select></Group>
      <Group title="Property status"><select className="input" value={f.status} onChange={(e) => set({ status: e.target.value })} aria-label="Property status"><option value="">Any</option>{propertyStatuses.map((o) => <option key={o}>{o}</option>)}</select></Group>
      <Group title="Area (sq ft)">
        <div className="grid grid-cols-2 gap-2">
          <input type="number" min="0" className="input" placeholder="Min" aria-label="Minimum area" value={f.amin} onChange={(e) => set({ amin: e.target.value })} />
          <input type="number" min="0" className="input" placeholder="Max" aria-label="Maximum area" value={f.amax} onChange={(e) => set({ amax: e.target.value })} />
        </div>
      </Group>
    </div>
  )
}
