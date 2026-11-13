/**
 * Loads the starter catalogue (categories, brands, products, blog posts, FAQs, testimonials, coupons).
 *   npm run seed            -> only seeds collections that are empty (safe to re-run)
 *   npm run seed -- --reset -> wipes catalogue collections first (NEVER touches users or orders)
 * Seed products start with 0 reviews/ratings - real ratings come from customer reviews.
 */
import { pathToFileURL } from 'node:url'
import { config } from '../config/env.js'
import { connectDB, disconnectDB } from '../config/db.js'
import { Category, Brand, Product, Blog, Faq, Testimonial, Coupon } from '../models/index.js'
import { categories } from './data/categories.js'
import { brands } from './data/brands.js'
import { products } from './data/products.js'
import { blogs } from './data/blogs.js'
import { faqs, testimonials, coupons } from './data/content.js'

export async function seedCatalog({ reset = false } = {}) {
  if (reset) await Promise.all([Category, Brand, Product, Blog, Faq, Testimonial, Coupon].map((M) => M.deleteMany({})))
  const out = {}
  const run = async (name, Model, docs) => {
    if (await Model.estimatedDocumentCount()) return (out[name] = 'skipped (not empty)')
    await Model.insertMany(docs)
    out[name] = docs.length
  }
  await run('categories', Category, categories.map((c, i) => ({ slug: c.slug, name: c.name, tagline: c.tagline, description: c.description, art: c.art, color: c.color, photo: c.photo, sortOrder: i })))
  await run('brands', Brand, brands.map(({ slug, name, country, founded, style, tagline, about }) => ({ slug, name, country, founded, style, tagline, about })))
  await run('products', Product, products.map((p) => ({
    name: p.name, slug: p.slug, brand: p.brand, brandName: p.brandName, category: p.category, categoryName: p.categoryName,
    subtitle: p.subtitle, price: p.price, mrp: p.mrp, rating: 0, reviewCount: 0, art: p.art, colors: p.colors, sizes: p.sizes,
    stock: p.stock || 0, bestseller: p.bestseller, newArrival: p.isNew, trending: p.trending, features: p.features, specs: p.specs, description: p.description,
  })))
  await run('blogs', Blog, blogs.map((b) => ({ slug: b.slug, title: b.title, excerpt: b.excerpt, category: b.category, photo: b.photo, author: b.author, date: new Date(b.date), readTime: b.readTime, body: b.body })))
  await run('faqs', Faq, faqs.map((f, i) => ({ ...f, order: i })))
  await run('testimonials', Testimonial, testimonials.map(({ name, city, rating, bike, text }) => ({ name, city, rating, bike, text })))
  await run('coupons', Coupon, coupons)
  return out
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await connectDB()
  console.log(`Seeding ${config.mongoUri.replace(/\/\/.*@/, '//***@')} ...`)
  console.log(await seedCatalog({ reset: process.argv.includes('--reset') }))
  await disconnectDB()
}
