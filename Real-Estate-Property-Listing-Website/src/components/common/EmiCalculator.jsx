import { useMemo, useState } from 'react'
import { formatBudget, formatMoney } from '../../utils/format'

export function emi(principal, ratePct, years) {
  const r = ratePct / 12 / 100, n = years * 12
  if (!principal || !n) return 0
  return r === 0 ? principal / n : (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1)
}

const Slider = ({ label, value, onChange, min, max, step, fmt }) => (
  <div>
    <div className="flex items-center justify-between text-sm"><label className="font-medium">{label}</label><span className="font-semibold text-primary">{fmt(value)}</span></div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="mt-2 w-full accent-accent" aria-label={label} />
  </div>
)

export default function EmiCalculator({ price = 8000000, compact = false }) {
  const [amount, setAmount] = useState(Math.round(price * 0.8 / 100000) * 100000 || 5000000)
  const [rate, setRate] = useState(8.5)
  const [years, setYears] = useState(20)
  const { monthly, total, interest } = useMemo(() => { const m = emi(amount, rate, years); return { monthly: m, total: m * years * 12, interest: m * years * 12 - amount } }, [amount, rate, years])
  const pct = total ? Math.round((amount / total) * 100) : 100
  return (
    <div className={compact ? 'space-y-4' : 'grid gap-8 md:grid-cols-2'}>
      <div className="space-y-5">
        <Slider label="Loan amount" value={amount} onChange={setAmount} min={500000} max={Math.max(100000000, amount)} step={100000} fmt={formatBudget} />
        <Slider label="Interest rate" value={rate} onChange={setRate} min={5} max={16} step={0.1} fmt={(v) => `${v.toFixed(1)}%`} />
        <Slider label="Tenure" value={years} onChange={setYears} min={1} max={30} step={1} fmt={(v) => `${v} yrs`} />
      </div>
      <div className="rounded-2xl bg-primary p-5 text-white">
        <p className="text-sm text-white/70">Monthly EMI</p>
        <p className="font-heading text-3xl font-semibold" aria-live="polite">{formatMoney(monthly)}</p>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/20" aria-hidden><div className="h-full bg-accent-light" style={{ width: `${pct}%` }} /></div>
        <dl className="mt-3 space-y-1.5 text-sm">
          <div className="flex justify-between"><dt className="text-white/70">Principal</dt><dd>{formatBudget(amount)}</dd></div>
          <div className="flex justify-between"><dt className="text-white/70">Total interest</dt><dd>{formatBudget(Math.round(interest))}</dd></div>
          <div className="flex justify-between border-t border-white/20 pt-1.5 font-semibold"><dt>Total payable</dt><dd>{formatBudget(Math.round(total))}</dd></div>
        </dl>
        <p className="mt-3 text-xs text-white/60">Estimate only. Actual rates depend on your lender.</p>
      </div>
    </div>
  )
}
