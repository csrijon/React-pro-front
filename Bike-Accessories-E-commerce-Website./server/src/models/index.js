import mongoose from 'mongoose'

const { Schema } = mongoose

// Every model serialises `_id` as `id` and hides internals (matches what the React app expects)
mongoose.set('toJSON', {
  versionKey: false,
  transform(_doc, ret) {
    if (ret._id !== undefined) { // sub-documents declared with _id:false have none
      ret.id = String(ret._id)
      delete ret._id
    }
    return ret
  },
})
mongoose.set('strictQuery', true)

const opts = { timestamps: true }

// ---------------- User ----------------
const addressSchema = new Schema({
  label: { type: String, default: 'Home', trim: true, maxlength: 20 },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  phone: { type: String, required: true, trim: true },
  line1: { type: String, required: true, trim: true, maxlength: 200 },
  line2: { type: String, trim: true, maxlength: 200, default: '' },
  city: { type: String, required: true, trim: true, maxlength: 80 },
  state: { type: String, required: true, trim: true, maxlength: 80 },
  pincode: { type: String, required: true, match: /^[1-9]\d{5}$/ },
  isDefault: { type: Boolean, default: false },
})

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: '' },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
    isBlocked: { type: Boolean, default: false },
    dob: { type: String, default: '' },
    gender: { type: String, default: '' },
    bike: { type: String, default: '', maxlength: 80 },
    addresses: [addressSchema],
    cart: { type: Schema.Types.Mixed, default: () => ({ items: [], coupon: null }) },
    wishlist: { type: [String], default: [] },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    passwordChangedAt: { type: Date },
    lastLoginAt: { type: Date },
    // security
    tokenVersion: { type: Number, default: 0 }, // bump to invalidate every issued session token
    failedLogins: { type: Number, default: 0 },
    lockUntil: { type: Date },
    twoFactor: {
      enabled: { type: Boolean, default: false },
      secret: { type: String, select: false }, // AES-256-GCM encrypted TOTP seed
      pendingSecret: { type: String, select: false },
      lastCounter: { type: Number, default: 0, select: false }, // replay protection
      recoveryCodes: { type: [String], default: [], select: false }, // sha-256 hashes, single use
    },
  },
  opts,
)
userSchema.set('toJSON', {
  versionKey: false,
  transform(_d, ret) {
    ret.id = String(ret._id)
    ret.twoFactorEnabled = !!ret.twoFactor?.enabled
    for (const k of ['_id', 'password', 'passwordResetToken', 'passwordResetExpires', 'cart', 'wishlist', 'addresses', 'passwordChangedAt', 'tokenVersion', 'failedLogins', 'lockUntil', 'twoFactor']) delete ret[k]
    return ret
  },
})
export const User = mongoose.model('User', userSchema)

// ---------------- Catalogue ----------------
const categorySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    tagline: { type: String, default: '', maxlength: 120 },
    description: { type: String, default: '', maxlength: 500 },
    art: { type: String, default: 'helmet' }, // vector fallback artwork key used by the storefront
    color: { type: String, default: '#EF252B' },
    photo: { type: String, default: 'ducati' }, // built-in photo key
    image: { type: String, default: '' }, // custom banner URL (overrides photo)
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  opts,
)
export const Category = mongoose.model('Category', categorySchema)

const brandSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    country: { type: String, default: 'India' },
    founded: { type: Number },
    style: { type: String, enum: ['italic', 'bold', 'wide'], default: 'bold' },
    tagline: { type: String, default: '', maxlength: 160 },
    about: { type: String, default: '', maxlength: 600 },
    logo: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  opts,
)
export const Brand = mongoose.model('Brand', brandSchema)

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 140 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    brand: { type: String, required: true, index: true },
    brandName: { type: String, required: true },
    category: { type: String, required: true, index: true },
    categoryName: { type: String, required: true },
    subtitle: { type: String, default: '', maxlength: 160 },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    art: { type: String, default: 'helmet' },
    colors: { type: [{ _id: false, name: String, hex: String }], default: [] },
    sizes: { type: [String], default: [] },
    stock: { type: Number, default: 0, min: 0 },
    sold: { type: Number, default: 0 },
    bestseller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false }, // exposed to the storefront as `isNew`
    trending: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    features: { type: [String], default: [] },
    specs: { type: [{ _id: false, label: String, value: String }], default: [] },
    description: { type: String, default: '', maxlength: 5000 },
    images: { type: [String], default: [] },
  },
  opts,
)
// Compound indexes matching the storefront queries (equality fields first, then the sort). Measured with
// explain() on 5,000 products: the default listing went from scanning every active product + in-memory sort
// to reading 12 index entries. Public queries always filter isActive:true.
productSchema.index({ isActive: 1, sold: -1, reviewCount: -1, createdAt: -1 }) // "popular" (default sort)
productSchema.index({ isActive: 1, category: 1, sold: -1, reviewCount: -1, createdAt: -1 })
productSchema.index({ isActive: 1, brand: 1, sold: -1, reviewCount: -1, createdAt: -1 })
productSchema.index({ isActive: 1, price: 1 }) // price asc/desc + price-range filter
productSchema.index({ isActive: 1, createdAt: -1 }) // newest
productSchema.index({ isActive: 1, rating: -1, reviewCount: -1 }) // top rated
productSchema.index({ isActive: 1, bestseller: 1, rating: -1, reviewCount: -1 }) // home: best sellers
productSchema.index({ isActive: 1, trending: 1, sold: -1, reviewCount: -1, createdAt: -1 }) // home: trending
productSchema.index({ isActive: 1, newArrival: 1, createdAt: -1 }) // home: new arrivals
productSchema.index({ isActive: 1, stock: 1 }) // in-stock filter, low-stock alerts
productSchema.index({ sold: -1 }) // admin: top sellers
productSchema.index({ createdAt: -1 }) // admin list
productSchema.set('toJSON', {
  versionKey: false,
  transform(_d, ret) {
    ret.id = String(ret._id)
    delete ret._id
    ret.isNew = !!ret.newArrival
    delete ret.newArrival
    ret.image = ret.images?.[0] || undefined
    return ret
  },
})
export const Product = mongoose.model('Product', productSchema)

const reviewSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productSlug: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    author: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, default: '', maxlength: 100 },
    text: { type: String, required: true, maxlength: 2000 },
    verified: { type: Boolean, default: false },
  },
  opts,
)
reviewSchema.index({ product: 1, user: 1 }, { unique: true }) // one review per user per product (also serves product-only lookups)
reviewSchema.index({ productSlug: 1, createdAt: -1 }) // product page review list
reviewSchema.set('toJSON', {
  versionKey: false,
  transform(_d, ret) {
    ret.id = String(ret._id)
    ret.date = ret.createdAt
    for (const k of ['_id', 'user', 'product', 'updatedAt']) delete ret[k]
    return ret
  },
})
export const Review = mongoose.model('Review', reviewSchema)

// ---------------- Commerce ----------------
const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, maxlength: 30 },
    type: { type: String, enum: ['percent', 'flat', 'shipping'], required: true },
    value: { type: Number, default: 0, min: 0 },
    minOrder: { type: Number, default: 0, min: 0 },
    maxDiscount: { type: Number, default: 0, min: 0 },
    description: { type: String, default: '' },
    active: { type: Boolean, default: true },
    expiresAt: { type: Date },
    usageLimit: { type: Number, default: 0 }, // 0 = unlimited
    hidden: { type: Boolean, default: false }, // hidden coupons work but are not suggested at checkout
    usedCount: { type: Number, default: 0 },
  },
  opts,
)
export const Coupon = mongoose.model('Coupon', couponSchema)

const orderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    customer: { name: String, email: { type: String, lowercase: true }, phone: String },
    items: { type: [Schema.Types.Mixed], default: [] },
    shippingAddress: Schema.Types.Mixed,
    billingAddress: Schema.Types.Mixed,
    delivery: Schema.Types.Mixed,
    payment: {
      method: String,
      status: { type: String, default: 'Pending' },
      gateway: String,
      razorpayOrderId: String,
      razorpayPaymentId: String,
      paidAt: Date,
    },
    coupon: { type: String, default: null },
    totals: Schema.Types.Mixed,
    notes: { type: String, default: '', maxlength: 500 },
    status: {
      type: String,
      enum: ['Pending Payment', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    statusHistory: { type: [{ _id: false, status: String, at: Date, note: String }], default: [] },
    tracking: { courier: String, number: String, url: String },
    estimatedDelivery: Date,
    cancelledAt: Date,
  },
  opts,
)
orderSchema.index({ createdAt: -1 }) // admin list / dashboard
orderSchema.index({ user: 1, createdAt: -1 }) // "My orders"
orderSchema.index({ status: 1, createdAt: -1 }) // admin status filter, housekeeping job
orderSchema.index({ 'items.id': 1 }) // verified-purchase check + "has orders" delete guard
orderSchema.index({ 'payment.razorpayOrderId': 1 }, { sparse: true }) // payment webhook lookup
orderSchema.set('toJSON', {
  versionKey: false,
  transform(_d, ret) {
    ret.id = ret.orderId // public id used in URLs
    ret.dbId = String(ret._id)
    ret.user = ret.user?.name ? ret.user : ret.user ? String(ret.user) : null // populated user (admin) keeps its fields
    delete ret._id
    delete ret.orderId
    return ret
  },
})
export const Order = mongoose.model('Order', orderSchema)

// ---------------- Content ----------------
export const Blog = mongoose.model(
  'Blog',
  new Schema(
    {
      slug: { type: String, required: true, unique: true },
      title: { type: String, required: true, maxlength: 160 },
      excerpt: { type: String, default: '', maxlength: 300 },
      category: { type: String, default: 'General' },
      photo: { type: String, default: 'ducati' },
      image: { type: String, default: '' },
      author: { type: String, default: 'MotoGear Team' },
      date: { type: Date, default: Date.now },
      readTime: { type: Number, default: 5 },
      body: { type: [Schema.Types.Mixed], default: [] }, // [['h','Heading'], ['p','Paragraph']]
      published: { type: Boolean, default: true },
    },
    opts,
  ),
)

export const Faq = mongoose.model('Faq', new Schema({ q: { type: String, required: true }, a: { type: String, required: true }, order: { type: Number, default: 0 } }, opts))

export const Testimonial = mongoose.model(
  'Testimonial',
  new Schema(
    {
      name: { type: String, required: true }, city: String, bike: String,
      rating: { type: Number, min: 1, max: 5, default: 5 },
      text: { type: String, required: true },
      active: { type: Boolean, default: true },
    },
    opts,
  ),
)

export const Subscriber = mongoose.model('Subscriber', new Schema({ email: { type: String, required: true, unique: true, lowercase: true } }, opts))

export const Message = mongoose.model(
  'Message',
  new Schema(
    {
      name: { type: String, required: true, maxlength: 80 },
      email: { type: String, required: true, lowercase: true },
      subject: { type: String, default: 'General enquiry' },
      message: { type: String, required: true, maxlength: 3000 },
      ticket: String,
      status: { type: String, enum: ['new', 'resolved'], default: 'new' },
    },
    opts,
  ).index({ status: 1, createdAt: -1 }),
)

// Security & admin activity trail (kept for one year, then removed automatically)
const auditSchema = new Schema({
  at: { type: Date, default: Date.now, expires: 365 * 24 * 3600 },
  actor: { type: Schema.Types.ObjectId, ref: 'User' },
  actorEmail: String,
  ip: String,
  userAgent: String,
  action: { type: String, index: true }, // e.g. "PUT /api/admin/products/:id" or "auth.login_failed"
  target: String,
  status: Number,
})
export const AuditLog = mongoose.model('AuditLog', auditSchema)

export { mongoose }
