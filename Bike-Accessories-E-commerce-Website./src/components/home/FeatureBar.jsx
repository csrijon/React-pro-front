import { Truck, RotateCcw, ShieldCheck, BadgeCheck } from 'lucide-react'

const items = [
  { icon: Truck, title: 'Free Shipping', text: 'Above ₹999' },
  { icon: RotateCcw, title: 'Easy Returns', text: '7 Days' },
  { icon: ShieldCheck, title: 'Secure Payment', text: '100% Safe' },
  { icon: BadgeCheck, title: 'Genuine Products', text: 'Top Brands Only' },
]

export default function FeatureBar() {
  return (
    <div className="border-y border-line bg-ink-800/60">
      <div className="container-x grid grid-cols-2 gap-x-4 gap-y-5 py-6 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-2.5 sm:gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand/40 text-brand sm:h-12 sm:w-12"><Icon size={20} /></span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold leading-tight sm:text-sm">{title}</p>
              <p className="mt-0.5 text-xs text-muted">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
