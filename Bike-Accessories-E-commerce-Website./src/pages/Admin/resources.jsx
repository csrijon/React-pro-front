import { Ban, CheckCircle2, Download, ShieldCheck, ShieldOff, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import ResourcePage from './ResourcePage'
import { Badge } from './ui'
import ProductImage from '../../components/products/ProductImage'
import Rating from '../../components/common/Rating'
import { useCatalog } from '../../context/CatalogContext'
import adminService from '../../services/adminService'
import { PHOTO_KEYS } from '../../utils/images'
import { formatDate, formatPrice } from '../../utils/format'

const ART = ['helmet', 'jacket', 'vest', 'gloves', 'boots', 'cover', 'topbox', 'bottles', 'camera', 'led', 'mount', 'exhaust', 'filter', 'sprocket', 'lock', 'guard']
const yesNo = (v, y = 'Active', n = 'Hidden') => <Badge tone={v ? 'green' : 'grey'}>{v ? y : n}</Badge>
const clip = (s, n = 60) => (String(s).length > n ? `${String(s).slice(0, n)}…` : s)

/* ---------------- Products ---------------- */
export function ProductsPage() {
  const { categories, brands } = useCatalog()
  const config = {
    title: 'Products', text: 'Manage your catalogue, pricing, stock and photos.', resource: 'products', noun: 'product', searchPlaceholder: 'Search name, brand or category...',
    filters: [
      { key: 'category', label: 'All categories', options: categories.map((c) => ({ value: c.slug, label: c.name })) },
      { key: 'brand', label: 'All brands', options: brands.map((b) => ({ value: b.slug, label: b.name })) },
      { key: 'isActive', label: 'Any status', options: [{ value: 'true', label: 'Active' }, { value: 'false', label: 'Hidden' }] },
    ],
    columns: [
      { label: 'Product', render: (p) => (
        <div className="flex items-center gap-3"><div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-line"><ProductImage product={p} /></div>
          <div className="min-w-0"><p className="max-w-[240px] truncate font-semibold">{p.name}</p><p className="text-xs text-muted">{p.brandName} · {p.categoryName}</p></div></div>) },
      { label: 'Price', render: (p) => <><b>{formatPrice(p.price)}</b><span className="ml-1.5 text-xs text-muted line-through">{formatPrice(p.mrp)}</span></> },
      { label: 'Stock', render: (p) => <Badge tone={p.stock === 0 ? 'red' : p.stock <= 5 ? 'amber' : 'green'}>{p.stock === 0 ? 'Out of stock' : `${p.stock} in stock`}</Badge> },
      { label: 'Sold', key: 'sold' },
      { label: 'Rating', render: (p) => (p.reviewCount ? <Rating value={p.rating} count={p.reviewCount} /> : <span className="text-xs text-muted">No reviews</span>) },
      { label: 'Status', render: (p) => <div className="flex flex-wrap gap-1">{yesNo(p.isActive)}{p.bestseller && <Badge tone="amber">Bestseller</Badge>}{p.isNew && <Badge tone="blue">New</Badge>}{p.trending && <Badge tone="violet">Trending</Badge>}</div> },
    ],
    fields: [
      { name: 'name', label: 'Product name', required: true, wide: true },
      { name: 'brand', label: 'Brand', type: 'select', required: true, options: [{ value: '', label: 'Select brand' }, ...brands.map((b) => ({ value: b.slug, label: b.name }))] },
      { name: 'category', label: 'Category', type: 'select', required: true, options: [{ value: '', label: 'Select category' }, ...categories.map((c) => ({ value: c.slug, label: c.name }))] },
      { name: 'price', label: 'Selling price (₹)', type: 'number', required: true },
      { name: 'mrp', label: 'MRP (₹)', type: 'number', required: true, hint: 'Must be equal to or higher than the selling price' },
      { name: 'stock', label: 'Stock quantity', type: 'number', step: 1, default: 0 },
      { name: 'subtitle', label: 'Short tagline', placeholder: 'ISI Certified | Dual Visor' },
      { name: 'images', label: 'Photos', type: 'images' },
      { name: 'art', label: 'Fallback artwork (used when there is no photo)', type: 'select', options: ART, default: 'helmet' },
      { name: 'description', label: 'Description', type: 'textarea', wide: true, rows: 5 },
      { name: 'features', label: 'Key features (one per line)', type: 'lines', wide: true, rows: 4 },
      { name: 'specs', label: 'Specifications (one per line as "Label: Value")', type: 'pairs', wide: true, rows: 4, placeholder: 'Material: ABS\nWeight: 1,350 g' },
      { name: 'sizes', label: 'Sizes (comma separated, leave empty if none)', type: 'csv', placeholder: 'S, M, L, XL' },
      { name: 'colors', label: 'Colours (one per line as "Name #hex")', type: 'colors', rows: 3, placeholder: 'Racing Red #EF252B\nMatte Black #3A3F47', default: [{ name: 'Matte Black', hex: '#3a3f47' }] },
      { name: 'isActive', label: 'Visible in store', type: 'checkbox', default: true },
      { name: 'bestseller', label: 'Bestseller badge', type: 'checkbox' },
      { name: 'isNew', label: 'New arrival', type: 'checkbox' },
      { name: 'trending', label: 'Trending', type: 'checkbox' },
    ],
  }
  return <ResourcePage config={config} />
}

/* ---------------- Categories & brands ---------------- */
export const CategoriesPage = () => (
  <ResourcePage config={{
    title: 'Categories', text: 'Categories appear in the menu, filters and the home page.', resource: 'categories', noun: 'category',
    columns: [
      { label: 'Name', render: (c) => <><b>{c.name}</b><p className="text-xs text-muted">/category/{c.slug}</p></> },
      { label: 'Tagline', render: (c) => clip(c.tagline || '–', 50), className: 'hidden md:table-cell' },
      { label: 'Order', key: 'sortOrder' },
      { label: 'Status', render: (c) => yesNo(c.isActive) },
    ],
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'tagline', label: 'Tagline' },
      { name: 'description', label: 'Description', type: 'textarea', wide: true, rows: 3 },
      { name: 'art', label: 'Artwork', type: 'select', options: ART, default: 'helmet' },
      { name: 'photo', label: 'Built-in banner photo', type: 'select', options: PHOTO_KEYS, default: 'ducati' },
      { name: 'image', label: 'Custom banner image URL (optional)', wide: true, placeholder: 'https://...' },
      { name: 'sortOrder', label: 'Sort order', type: 'number', step: 1, default: 0 },
      { name: 'isActive', label: 'Visible in store', type: 'checkbox', default: true },
    ],
  }} />
)

export const BrandsPage = () => (
  <ResourcePage config={{
    title: 'Brands', text: 'Brands power the brand pages and the brand filter.', resource: 'brands', noun: 'brand',
    columns: [
      { label: 'Brand', render: (b) => <><b>{b.name}</b><p className="text-xs text-muted">/brands/{b.slug}</p></> },
      { label: 'Country', key: 'country', className: 'hidden md:table-cell' },
      { label: 'Founded', key: 'founded', className: 'hidden md:table-cell' },
      { label: 'Status', render: (b) => yesNo(b.isActive) },
    ],
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'country', label: 'Country', default: 'India' },
      { name: 'founded', label: 'Founded (year)', type: 'number', step: 1 },
      { name: 'style', label: 'Logo style', type: 'select', options: ['bold', 'italic', 'wide'], default: 'bold' },
      { name: 'tagline', label: 'Tagline', wide: true },
      { name: 'about', label: 'About', type: 'textarea', wide: true, rows: 3 },
      { name: 'isActive', label: 'Visible in store', type: 'checkbox', default: true },
    ],
  }} />
)

/* ---------------- Marketing & content ---------------- */
export const CouponsPage = () => (
  <ResourcePage config={{
    title: 'Coupons', text: 'Create discount codes. Hidden coupons work but are not suggested at checkout.', resource: 'coupons', noun: 'coupon', searchPlaceholder: 'Search code...',
    columns: [
      { label: 'Code', render: (c) => <span className="font-mono font-bold tracking-wider">{c.code}</span> },
      { label: 'Discount', render: (c) => (c.type === 'percent' ? `${c.value}%${c.maxDiscount ? ` (max ${formatPrice(c.maxDiscount)})` : ''}` : c.type === 'flat' ? formatPrice(c.value) : 'Free shipping') },
      { label: 'Min order', render: (c) => (c.minOrder ? formatPrice(c.minOrder) : '–') },
      { label: 'Used', render: (c) => `${c.usedCount}${c.usageLimit ? ` / ${c.usageLimit}` : ''}` },
      { label: 'Expires', render: (c) => (c.expiresAt ? formatDate(c.expiresAt) : 'Never'), className: 'hidden md:table-cell' },
      { label: 'Status', render: (c) => (c.expiresAt && new Date(c.expiresAt) < new Date() ? <Badge tone="red">Expired</Badge> : <div className="flex gap-1">{yesNo(c.active, 'Active', 'Off')}{c.hidden && <Badge>Hidden</Badge>}</div>) },
    ],
    fields: [
      { name: 'code', label: 'Code', required: true, placeholder: 'FESTIVE20' },
      { name: 'type', label: 'Type', type: 'select', options: [{ value: 'percent', label: 'Percentage off' }, { value: 'flat', label: 'Flat amount off' }, { value: 'shipping', label: 'Free shipping' }], default: 'percent' },
      { name: 'value', label: 'Value (% or ₹)', type: 'number', default: 10 },
      { name: 'minOrder', label: 'Minimum order (₹)', type: 'number', default: 0 },
      { name: 'maxDiscount', label: 'Max discount for % coupons (₹, 0 = none)', type: 'number', default: 0 },
      { name: 'usageLimit', label: 'Total usage limit (0 = unlimited)', type: 'number', step: 1, default: 0 },
      { name: 'expiresAt', label: 'Expiry date (optional)', type: 'date' },
      { name: 'description', label: 'Description shown to customers', wide: true },
      { name: 'active', label: 'Active', type: 'checkbox', default: true },
      { name: 'hidden', label: 'Hidden (do not suggest)', type: 'checkbox' },
    ],
  }} />
)

export const BlogsAdminPage = () => (
  <ResourcePage config={{
    title: 'Blog posts', text: 'Write riding guides and news.', resource: 'blogs', noun: 'post',
    columns: [
      { label: 'Title', render: (b) => <><b className="block max-w-[320px] truncate">{b.title}</b><span className="text-xs text-muted">{b.category} · {b.readTime} min read</span></> },
      { label: 'Author', key: 'author', className: 'hidden md:table-cell' },
      { label: 'Date', render: (b) => formatDate(b.date), className: 'hidden md:table-cell' },
      { label: 'Status', render: (b) => yesNo(b.published, 'Published', 'Draft') },
    ],
    fields: [
      { name: 'title', label: 'Title', required: true, wide: true },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 2, wide: true },
      { name: 'category', label: 'Category', default: 'General' },
      { name: 'author', label: 'Author', default: 'MotoGear Team' },
      { name: 'date', label: 'Publish date', type: 'date' },
      { name: 'readTime', label: 'Read time (minutes)', type: 'number', step: 1, default: 5 },
      { name: 'photo', label: 'Built-in cover photo', type: 'select', options: PHOTO_KEYS, default: 'ducati' },
      { name: 'image', label: 'Custom cover image URL (optional)', placeholder: 'https://...' },
      { name: 'body', label: 'Article (use "## Heading" for headings; separate paragraphs with a blank line)', type: 'article', wide: true },
      { name: 'published', label: 'Published', type: 'checkbox', default: true },
    ],
  }} />
)

export const FaqsPage = () => (
  <ResourcePage config={{
    title: 'FAQs', text: 'Shown on the Help centre page.', resource: 'faqs', noun: 'FAQ', canEdit: true,
    columns: [{ label: 'Question', render: (f) => <b>{clip(f.q, 90)}</b> }, { label: 'Answer', render: (f) => <span className="text-muted">{clip(f.a, 80)}</span>, className: 'hidden md:table-cell' }, { label: 'Order', key: 'order' }],
    fields: [{ name: 'q', label: 'Question', required: true, wide: true }, { name: 'a', label: 'Answer', type: 'textarea', required: true, wide: true }, { name: 'order', label: 'Sort order', type: 'number', step: 1, default: 0 }],
  }} />
)

export const TestimonialsPage = () => (
  <ResourcePage config={{
    title: 'Testimonials', text: 'Customer quotes shown on the home page.', resource: 'testimonials', noun: 'testimonial',
    columns: [{ label: 'Customer', render: (t) => <><b>{t.name}</b><p className="text-xs text-muted">{t.bike} · {t.city}</p></> }, { label: 'Rating', render: (t) => <Rating value={t.rating} /> }, { label: 'Quote', render: (t) => <span className="text-muted">{clip(t.text, 70)}</span>, className: 'hidden md:table-cell' }, { label: 'Status', render: (t) => yesNo(t.active, 'Shown', 'Hidden') }],
    fields: [{ name: 'name', label: 'Name', required: true }, { name: 'city', label: 'City' }, { name: 'bike', label: 'Bike' }, { name: 'rating', label: 'Rating (1-5)', type: 'number', step: 1, default: 5 }, { name: 'text', label: 'Quote', type: 'textarea', required: true, wide: true }, { name: 'active', label: 'Show on site', type: 'checkbox', default: true }],
  }} />
)

/* ---------------- Inbox ---------------- */
export const MessagesPage = () => (
  <ResourcePage config={{
    title: 'Messages', text: 'Enquiries sent from the contact form.', resource: 'messages', noun: 'message', canCreate: false, canEdit: false,
    filters: [{ key: 'status', label: 'All messages', options: [{ value: 'new', label: 'New' }, { value: 'resolved', label: 'Resolved' }] }],
    columns: [
      { label: 'From', render: (m) => <><b>{m.name}</b><p className="text-xs text-muted">{m.email}</p></> },
      { label: 'Subject', render: (m) => <><span>{m.subject}</span><p className="max-w-[260px] truncate text-xs text-muted">{m.message}</p></> },
      { label: 'Ticket', render: (m) => <span className="font-mono text-xs">{m.ticket}</span>, className: 'hidden md:table-cell' },
      { label: 'Received', render: (m) => formatDate(m.createdAt), className: 'hidden md:table-cell' },
      { label: 'Status', render: (m) => <Badge tone={m.status === 'new' ? 'amber' : 'green'}>{m.status === 'new' ? 'New' : 'Resolved'}</Badge> },
    ],
    detail: (m) => (
      <div className="space-y-4 text-sm">
        <div className="grid gap-3 sm:grid-cols-2"><div><p className="text-xs text-muted">From</p><p className="font-semibold">{m.name}</p><a href={`mailto:${m.email}?subject=Re: ${m.subject} [${m.ticket}]`} className="text-brand-light hover:underline">{m.email}</a></div><div><p className="text-xs text-muted">Ticket</p><p className="font-mono">{m.ticket}</p><p className="text-xs text-muted">{formatDate(m.createdAt)}</p></div></div>
        <div><p className="text-xs text-muted">Subject</p><p className="font-semibold">{m.subject}</p></div>
        <p className="whitespace-pre-wrap rounded-xl border border-line bg-ink p-4 leading-relaxed">{m.message}</p>
        <a href={`mailto:${m.email}?subject=Re: ${m.subject} [${m.ticket}]`} className="btn-primary w-full">Reply by email</a>
      </div>
    ),
    rowActions: (m, reload) => (
      <button title={m.status === 'new' ? 'Mark resolved' : 'Reopen'} aria-label={m.status === 'new' ? 'Mark resolved' : 'Reopen'}
        onClick={async () => { try { await adminService.update('messages', m.id, { status: m.status === 'new' ? 'resolved' : 'new' }); reload() } catch (e) { toast.error(e.message) } }}
        className="rounded-lg p-2 text-muted hover:bg-ink-600 hover:text-emerald-400">{m.status === 'new' ? <CheckCircle2 size={16} /> : <RotateCcw size={16} />}</button>
    ),
  }} />
)

export const SubscribersPage = () => (
  <ResourcePage config={{
    title: 'Subscribers', text: 'People who joined the newsletter.', resource: 'subscribers', noun: 'subscriber', canCreate: false, canEdit: false, searchPlaceholder: 'Search email...',
    columns: [{ label: 'Email', key: 'email' }, { label: 'Subscribed', render: (s) => formatDate(s.createdAt) }],
    headerActions: () => (
      <button className="btn-ghost" onClick={async () => {
        try {
          const blob = await adminService.exportSubscribers()
          const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'subscribers.csv' })
          a.click(); URL.revokeObjectURL(a.href)
        } catch (e) { toast.error(e.message) }
      }}><Download size={16} /> Export CSV</button>
    ),
  }} />
)

export const ReviewsPage = () => (
  <ResourcePage config={{
    title: 'Reviews', text: 'Moderate customer reviews. Deleting a review recalculates the product rating.', resource: 'reviews', noun: 'review', canCreate: false, canEdit: false, searchPlaceholder: 'Search author, product or text...',
    filters: [{ key: 'rating', label: 'Any rating', options: [5, 4, 3, 2, 1].map((n) => ({ value: n, label: `${n} stars` })) }],
    columns: [
      { label: 'Product', render: (r) => <span className="font-mono text-xs">{r.productSlug}</span> },
      { label: 'Author', render: (r) => <>{r.author}{r.verified && <Badge tone="green"> Verified</Badge>}</> },
      { label: 'Rating', render: (r) => <Rating value={r.rating} /> },
      { label: 'Review', render: (r) => <span className="text-muted">{clip(r.text, 70)}</span>, className: 'hidden md:table-cell' },
      { label: 'Date', render: (r) => formatDate(r.date), className: 'hidden md:table-cell' },
    ],
    detail: (r) => <div className="space-y-3 text-sm"><Rating value={r.rating} /><p className="font-semibold">{r.title}</p><p className="leading-relaxed text-muted">{r.text}</p><p className="text-xs text-muted">{r.author} · {formatDate(r.date)} · {r.productSlug}</p></div>,
  }} />
)

/* ---------------- Security trail ---------------- */
export const AuditPage = () => (
  <ResourcePage config={{
    title: 'Audit log', text: 'Every admin change and security event (sign-ins, lockouts, 2FA, password resets). Kept for one year.', resource: 'audit', noun: 'entry', canCreate: false, canEdit: false, canDelete: false, searchPlaceholder: 'Search action, email, target or IP...',
    columns: [
      { label: 'When', render: (a) => new Date(a.at).toLocaleString('en-IN') },
      { label: 'Who', render: (a) => a.actorEmail || '–' },
      { label: 'Action', render: (a) => <span className={`font-mono text-xs ${/failed|locked/.test(a.action) ? 'text-brand-light' : ''}`}>{a.action}</span> },
      { label: 'Target', render: (a) => <span className="font-mono text-xs text-muted">{clip(a.target || '–', 28)}</span>, className: 'hidden lg:table-cell' },
      { label: 'Result', key: 'status' },
      { label: 'IP', render: (a) => <span className="font-mono text-xs text-muted">{a.ip}</span>, className: 'hidden md:table-cell' },
    ],
  }} />
)

/* ---------------- Customers ---------------- */
export const CustomersPage = () => (
  <ResourcePage config={{
    title: 'Customers', text: 'View customers, suspend accounts or grant admin access.', resource: 'users', noun: 'customer', canCreate: false, canEdit: false, canDelete: false, searchPlaceholder: 'Search name, email or phone...',
    filters: [{ key: 'role', label: 'All roles', options: [{ value: 'user', label: 'Customers' }, { value: 'admin', label: 'Admins' }] }, { key: 'blocked', label: 'Any status', options: [{ value: 'true', label: 'Suspended' }] }],
    columns: [
      { label: 'Customer', render: (u) => <div className="flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-solid text-sm font-bold">{u.name[0]}</span><div className="min-w-0"><b className="block truncate">{u.name}</b><span className="block truncate text-xs text-muted">{u.email}</span></div></div> },
      { label: 'Phone', key: 'phone', className: 'hidden md:table-cell' },
      { label: 'Orders', key: 'orders' },
      { label: 'Spent', render: (u) => formatPrice(u.spent) },
      { label: 'Joined', render: (u) => formatDate(u.createdAt), className: 'hidden lg:table-cell' },
      { label: 'Status', render: (u) => <div className="flex gap-1">{u.role === 'admin' && <Badge tone="violet">Admin</Badge>}{u.isBlocked ? <Badge tone="red">Suspended</Badge> : <Badge tone="green">Active</Badge>}</div> },
    ],
    rowActions: (u, reload) => {
      const act = async (data, msg) => { try { await adminService.update('users', u.id, data); toast.success(msg); reload() } catch (e) { toast.error(e.message) } }
      return (
        <>
          <button title={u.isBlocked ? 'Reactivate' : 'Suspend'} aria-label={u.isBlocked ? 'Reactivate account' : 'Suspend account'} onClick={() => act({ isBlocked: !u.isBlocked }, u.isBlocked ? 'Account reactivated' : 'Account suspended')} className="rounded-lg p-2 text-muted hover:bg-ink-600 hover:text-white"><Ban size={16} /></button>
          <button title={u.role === 'admin' ? 'Remove admin' : 'Make admin'} aria-label={u.role === 'admin' ? 'Remove admin access' : 'Grant admin access'} onClick={() => window.confirm(u.role === 'admin' ? `Remove admin access from ${u.name}?` : `Give ${u.name} full admin access?`) && act({ role: u.role === 'admin' ? 'user' : 'admin' }, 'Role updated')} className="rounded-lg p-2 text-muted hover:bg-ink-600 hover:text-white">{u.role === 'admin' ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}</button>
        </>
      )
    },
  }} />
)
