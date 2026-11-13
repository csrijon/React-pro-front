import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { PageSkeleton } from '../../components/common/Skeletons'
import { Check, Lock, Mail, Phone, User, Landmark, Smartphone, CreditCard, Banknote, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import FormField from '../../components/forms/FormField'
import AddressFields, { validateAddress } from '../../components/forms/AddressFields'
import LoadingButton from '../../components/forms/LoadingButton'
import CouponBox from '../../components/cart/CouponBox'
import OrderSummary from '../../components/cart/OrderSummary'
import ItemThumb from '../../components/common/ItemThumb'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import useForm from '../../hooks/useForm'
import useFetch from '../../hooks/useFetch'
import usePageTitle from '../../hooks/usePageTitle'
import orderService from '../../services/orderService'
import userService from '../../services/userService'
import contentService from '../../services/contentService'
import { payWithRazorpay } from '../../utils/razorpay'
import { rules } from '../../utils/validators'
import { DELIVERY_OPTIONS, calcTotals } from '../../utils/pricing'
import { PAYMENT_METHODS } from '../../utils/constants'
import { formatPrice } from '../../utils/format'

const PAY_ICONS = { upi: Smartphone, card: CreditCard, netbanking: Landmark, cod: Banknote }

const Section = ({ n, title, children }) => (
  <section className="rounded-2xl border border-line bg-ink-800 p-5 sm:p-6">
    <h2 className="mb-5 flex items-center gap-3 text-lg font-bold"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-solid text-sm">{n}</span>{title}</h2>
    {children}
  </section>
)

const validate = (v) => ({
  name: rules.required('Full name')(v.name),
  email: rules.email(v.email),
  phone: rules.phone(v.phone),
  ...validateAddress(v),
  ...(v.sameBilling ? {} : validateAddress(v, 'b_')),
})

export default function Checkout() {
  usePageTitle('Checkout')
  const { items, totals, coupon, delivery, setDelivery, clear } = useCart()
  const { user, isAuthenticated, booting } = useAuth()
  const navigate = useNavigate()
  const placed = useRef(false)
  const [payment, setPayment] = useState('upi')
  const form = useForm(
    { name: user?.name || '', email: user?.email || '', phone: user?.phone || '', line1: '', line2: '', city: '', state: '', pincode: '', sameBilling: true, b_line1: '', b_line2: '', b_city: '', b_state: '', b_pincode: '', notes: '' },
    validate,
  )
  const { data: saved } = useFetch(() => userService.addresses(), [], { enabled: isAuthenticated })
  const { data: cfg } = useFetch(() => contentService.config(), [])
  // online methods are offered only when the backend has payments configured
  const methods = cfg?.paymentsEnabled === false ? PAYMENT_METHODS.filter((m) => m.id === 'cod') : PAYMENT_METHODS
  const method = methods.some((m) => m.id === payment) ? payment : methods[0].id

  // prefill from the user's default saved address once
  const prefilled = useRef(false)
  useEffect(() => {
    if (prefilled.current || !saved?.length) return
    prefilled.current = true
    const a = saved.find((x) => x.isDefault) || saved[0]
    form.setValues((v) => ({ ...v, name: v.name || a.name, phone: v.phone || a.phone, line1: a.line1, line2: a.line2 || '', city: a.city, state: a.state, pincode: a.pincode }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved])

  // ordering needs an account: send guests to sign in and bring them straight back here
  if (booting) return <PageSkeleton />
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: '/checkout', reason: 'checkout' }} />
  if (!items.length && !placed.current) return <Navigate to="/cart" replace />

  const applySaved = (a) => form.setValues((v) => ({ ...v, name: a.name || v.name, phone: a.phone || v.phone, line1: a.line1, line2: a.line2 || '', city: a.city, state: a.state, pincode: a.pincode }))

  const place = form.submit(async (v) => {
    const shipping = { name: v.name, phone: v.phone, line1: v.line1, line2: v.line2, city: v.city, state: v.state, pincode: v.pincode }
    const order = await orderService.create({
      customer: { name: v.name, email: v.email, phone: v.phone },
      items: items.map(({ key, ...i }) => i),
      shippingAddress: shipping,
      billingAddress: v.sameBilling ? shipping : { name: v.name, phone: v.phone, line1: v.b_line1, line2: v.b_line2, city: v.b_city, state: v.b_state, pincode: v.b_pincode },
      delivery: DELIVERY_OPTIONS.find((d) => d.id === delivery),
      payment: { method }, // the backend creates the payment and returns checkout details for online methods
      coupon: coupon?.code || null,
      totals: calcTotals(items, coupon, delivery),
      notes: v.notes,
    })
    placed.current = true
    clear() // the order exists (stock is reserved), so the cart is done either way
    if (order.payment?.checkout) {
      try {
        const proof = await payWithRazorpay(order)
        await orderService.verifyPayment(order.id, proof)
        toast.success('Payment received. Order confirmed!')
      } catch (e) {
        toast.error(`${e.message} You can retry from the order page.`, { duration: 6000 })
      }
    } else toast.success('Order placed successfully!')
    navigate(`/order-success?order=${order.id}`, { replace: true })
  })

  return (
    <div className="container-x py-8 sm:py-10">
      <Breadcrumbs className="mb-4" items={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Checkout</h1>
        <span className="flex items-center gap-2 text-sm text-emerald-400"><Lock size={15} /> Secure checkout</span>
      </div>


      <form onSubmit={place} noValidate className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_400px]">
        <div className="min-w-0 space-y-6">
          <Section n={1} title="Customer information">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField className="sm:col-span-2" label="Full name" required icon={User} autoComplete="name" error={form.errors.name} {...form.field('name')} />
              <FormField label="Email" required type="email" icon={Mail} autoComplete="email" error={form.errors.email} {...form.field('email')} />
              <FormField label="Mobile number" required type="tel" icon={Phone} autoComplete="tel" placeholder="10-digit mobile" error={form.errors.phone} {...form.field('phone')} />
            </div>
          </Section>

          <Section n={2} title="Shipping address">
            {saved?.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {saved.map((a) => <button type="button" key={a.id} onClick={() => applySaved(a)} className="chip transition hover:border-brand hover:text-white">{a.label || 'Saved'}: {a.line1.slice(0, 22)}…</button>)}
              </div>
            )}
            <AddressFields form={form} />
          </Section>

          <Section n={3} title="Billing address">
            <label className="flex cursor-pointer items-center gap-3 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-[#EF252B]" {...(({ value, ...r }) => ({ ...r, checked: !!value }))(form.field('sameBilling'))} />
              Billing address is the same as shipping address
            </label>
            {!form.values.sameBilling && <div className="mt-5"><AddressFields form={form} prefix="b_" /></div>}
          </Section>

          <Section n={4} title="Delivery options">
            <div className="space-y-3" role="radiogroup" aria-label="Delivery options">
              {DELIVERY_OPTIONS.map((d) => {
                const t = calcTotals(items, coupon, d.id)
                const active = delivery === d.id
                return (
                  <label key={d.id} className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${active ? 'border-brand bg-brand-soft' : 'border-line hover:border-white/40'}`}>
                    <input type="radio" name="delivery" checked={active} onChange={() => setDelivery(d.id)} className="h-4 w-4 accent-[#EF252B]" />
                    <span className="min-w-0 flex-1"><b className="block text-sm">{d.label}</b><span className="text-xs text-muted">{d.eta} · {d.note}</span></span>
                    <b className="text-sm">{t.shipping === 0 ? 'FREE' : formatPrice(t.shipping)}</b>
                  </label>
                )
              })}
            </div>
          </Section>

          <Section n={5} title="Payment method">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
              {methods.map((m) => {
                const Icon = PAY_ICONS[m.id]
                const active = method === m.id
                return (
                  <label key={m.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${active ? 'border-brand bg-brand-soft' : 'border-line hover:border-white/40'}`}>
                    <input type="radio" name="payment" checked={active} onChange={() => setPayment(m.id)} className="sr-only" />
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-brand-solid' : 'bg-ink-600'}`}><Icon size={20} /></span>
                    <span className="min-w-0 flex-1"><b className="block text-sm">{m.label}</b><span className="block truncate text-xs text-muted">{m.desc}</span></span>
                    {active && <Check size={18} className="text-brand" />}
                  </label>
                )
              })}
            </div>
            <p className="mt-4 flex items-start gap-2 text-xs text-muted"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-400" />{method === 'cod' ? 'Pay in cash or UPI when your order is delivered.' : 'You will complete the payment in a secure Razorpay window. We never see or store your card details.'}</p>
            <FormField className="mt-5" as="textarea" rows={2} label="Order notes (optional)" placeholder="Delivery instructions, gift message..." {...form.field('notes')} />
          </Section>
        </div>

        <aside className="min-w-0 space-y-5 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-line bg-ink-800 p-5">
            <h2 className="mb-4 text-lg font-bold">Your items</h2>
            <ul className="max-h-64 space-y-3 overflow-y-auto pr-1">
              {items.map((i) => (
                <li key={i.key} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-line"><ItemThumb item={i} /><span className="absolute -right-0 -top-0 flex h-5 min-w-5 items-center justify-center rounded-bl-lg bg-brand-solid text-[10px] font-bold">{i.qty}</span></div>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{i.name}</p><p className="truncate text-xs text-muted">{[i.colorName, i.size && `Size ${i.size}`].filter(Boolean).join(' · ')}</p></div>
                  <span className="text-sm font-semibold">{formatPrice(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-ink-800 p-5"><CouponBox /></div>
          <div className="rounded-2xl border border-line bg-ink-800 p-5">
            <OrderSummary totals={totals} coupon={coupon} title="">
              {form.formError && <p role="alert" className="mt-4 rounded-lg border border-brand/40 bg-brand-soft p-3 text-sm text-brand-light">{form.formError}</p>}
              {Object.keys(form.errors).length > 0 && <p role="alert" className="mt-4 text-xs text-brand-light">Please fix the highlighted fields above.</p>}
              <LoadingButton type="submit" loading={form.submitting} loadingText="Placing order..." className="btn-primary mt-5 w-full py-3.5 text-base">
                <Lock size={16} /> Place Order · {formatPrice(totals.total)}
              </LoadingButton>
              <p className="mt-3 text-center text-xs text-muted">By placing your order you agree to our <Link to="/terms" className="underline hover:text-white">Terms</Link> and <Link to="/privacy-policy" className="underline hover:text-white">Privacy Policy</Link>.</p>
            </OrderSummary>
          </div>
        </aside>
      </form>
    </div>
  )
}
