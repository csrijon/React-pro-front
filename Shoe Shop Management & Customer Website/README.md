# Shoe Shop – Wholesale Management & Customer Website

Customer storefront + admin portal for a wholesale footwear business.

**Stack:** React 19 + Vite + React Router (client) · Node/Express 5 + PostgreSQL via `pg` (server) · bcrypt password hashing · JWT in an httpOnly cookie · zod validation.

## Quick start (development)

You need a PostgreSQL database (any version 12+). Copy `.env.example` to `server/.env` and set `DATABASE_URL`, for example `postgres://user:password@localhost:5432/shoeshop` (create the empty database first: `createdb shoeshop`).

```bash
npm run install:all
ADMIN_PASSWORD='pick-a-password' npm run dev:server   # API on :4000 (creates tables, admin user and demo catalogue on first run)
npm run dev:client                                     # storefront on http://localhost:5173 (proxies /api to :4000)
```

If `ADMIN_PASSWORD` is not set in development, a random admin password is generated and printed **once** in the server log.
Admin sign-in: `http://localhost:5173/admin/login` (username `admin` unless `ADMIN_USERNAME` is set).

## Production

```bash
npm run install:all && npm run build
NODE_ENV=production JWT_SECRET=... ADMIN_PASSWORD=... npm start   # serves API + built client on :4000
```

See `.env.example`. The server refuses to start without `DATABASE_URL`, and in production without `JWT_SECRET`. Tables are created automatically on startup. Managed Postgres hosts that require TLS (Neon, Supabase, Render, Railway…) need `DATABASE_SSL=true`. Put `server/uploads` (or `UPLOAD_DIR`) on persistent storage and back up both it and the database. Run behind HTTPS (cookies are `Secure` in production).

The database user must be allowed to `CREATE EXTENSION citext` (it is used for case-insensitive usernames, SKUs and names); on most hosts run `CREATE EXTENSION citext;` once as the admin user if it is not.

## Tests

`npm test` runs the API integration suite (wholesale authorization, auth, filters, inventory maths, validation) against PostgreSQL. It uses `TEST_DATABASE_URL` (falling back to `DATABASE_URL`) and creates and drops its own temporary schema, so existing data is never touched.

## URLs

Customer: `/`, `/products`, `/products/mens`, `/products/mens/sports-shoes`, `/category/mens`, `/product/<slug>`, `/brands`, `/categories`, `/account`, `/login`, `/register`
Admin: `/admin`, `/admin/products`, `/admin/products/new`, `/admin/products/:id`, `/admin/categories`, `/admin/brands`, `/admin/customers`, `/admin/inventory`, `/admin/featured`, `/admin/settings`, `/admin/profile`

Filters (`brand`, `size`, `color`, `minMrp`, `maxMrp`, `availability`, `featured`, `sort`, `q`, `page`) live in the query string, so refresh and shared links keep their state.

## Design notes

**Wholesale price protection.** `canSeeWholesale(req)` in `server/src/auth.js` is the single gate. Wholesale columns are only *selected and serialised* when it returns true (admin, or a customer whose status is `APPROVED` and wholesale is enabled in Settings). Anonymous, PENDING, REJECTED and SUSPENDED users never receive the field in any endpoint (list, detail, related, home). The user is re-read from the database on each request, so suspending a customer takes effect immediately. Sorting/filtering by price uses MRP only, so it cannot be used to infer wholesale prices.

**Inventory.** `inventory(product_id, color_id, size_id, quantity)` is the only place stock lives, with composite foreign keys to `product_colors` / `product_sizes`. Colour, product and category totals are always computed with SQL aggregates; nothing is typed in. Low/out-of-stock status uses the *Low stock threshold* setting (`qty = 0` → Out, `qty <= threshold` → Low). A product is "Low" when its total is at or below the threshold.

**Schema** (created by `server/src/db.js`): users, customers, customer_approvals (audit log), brands, categories (per gender), subcategories, products, product_images, colors, sizes, product_colors, product_sizes, inventory, settings.

**Categories are per gender** (e.g. Men › Sandals and Women › Sandals are separate rows), which is what makes `/products/mens/sandals` unambiguous. A product's gender is derived from its category.

## Scope notes

- Ordering is not enabled (the brief says "if ordering is enabled"), so there is no Orders section.
- Per-size MRP overrides are supported; product-level MRP is the default. Listings show a price range when sizes differ.
- Prices are stored as double-precision numbers and timestamps as `timestamptz` (sent to the browser as UTC `YYYY-MM-DD HH:MM:SS`).
- Images are stored on local disk (`UPLOAD_DIR`). JPG/PNG/WebP only, 5 MB max, content-sniffed.
