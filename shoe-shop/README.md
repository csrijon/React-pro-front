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

See `.env.example`. The server refuses to start without `DATABASE_URL`, and in production without `JWT_SECRET`. Tables are created automatically on startup. Managed Postgres hosts that require TLS (Neon, Supabase, Render, Railway…) need `DATABASE_SSL=true`.

**Image storage.** Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and (optionally) `SUPABASE_BUCKET` (default `product-images`) in production. Uploads then go to Supabase Storage and the database stores public `https://…/storage/v1/object/public/…` URLs. Without those variables, production uploads are rejected rather than written to local disk, because managed hosts such as Render wipe it on deploy/restart (existing `/uploads/...` rows then 404). `ALLOW_LOCAL_UPLOADS=true` is only for self-hosting with a persistent `UPLOAD_DIR`. Repair legacy `/uploads/...` references with `npm --prefix server run repair-images -- --csv ../Book-1.csv` (report only) and add `--apply` to write. Run behind HTTPS (cookies are `Secure` in production).

The database user must be allowed to `CREATE EXTENSION citext` (it is used for case-insensitive usernames, SKUs and names); on most hosts run `CREATE EXTENSION citext;` once as the admin user if it is not.

## Deploy to Render (backend) and Vercel (frontend)

The client is a static Vite build; the API is the Express server. They live on two hosts.

### Render (backend - directory `shoe-shop/server`)

1. Create a **Web Service** from this repository with **Root Directory** set to `shoe-shop/server`.
2. Build command: `npm install` (or `npm ci`). Start command: `npm start` (the server listens on `$PORT`, 10000 by default on Render).
3. Environment variables (required in production):

   | Variable | Value / example |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `DATABASE_URL` | PostgreSQL connection string (Supabase pooler / Neon / Render Postgres / Railway) |
   | `DATABASE_SSL` | `true` (managed hosts require TLS) |
   | `JWT_SECRET` | long random string |
   | `ADMIN_USERNAME` | `admin` (or your own) |
   | `ADMIN_PASSWORD` | strong password for the first admin |
   | `SUPABASE_URL` | `https://<project-ref>.supabase.co` |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key (server-side only, never in the client) |
   | `SUPABASE_BUCKET` | `product-images` |

4. Deploy. On first boot the schema is created and the first admin is generated from `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
5. Open a **Render shell** in this service and migrate legacy uploads (safe: dry run first):

   ```bash
   npm run repair-images -- --csv ../Book-1.csv          # dry run: which /uploads rows can be fixed
   npm run repair-images -- --csv ../Book-1.csv --apply  # write resolved URLs into product_images.url
   ```

6. With those variables set, new admin uploads go to the `product-images` Supabase bucket and the API stores + returns the full `https://<ref>.supabase.co/storage/v1/object/public/product-images/<file>` URL, which the storefront displays immediately.

### Vercel (frontend - directory `shoe-shop/client`)

1. Import the same repository with **Root Directory** set to `shoe-shop/client`, framework preset **Vite**.
2. Build command: `npm run build`. Output directory: `dist`. Install command: `npm install`.
3. `client/vercel.json` already rewrites `/api/*` - the Render backend and everything else to `/index.html`, so no frontend env vars are needed (the API base is same-origin through those rewrites). Never put the Supabase service-role key in the client.

### Order of operations for the image fix

1. Set the backend env vars above on Render and redeploy - uploads now write to Supabase Storage.
2. Run the repair script on the Render host (or locally against the production database) to replace leftover `/uploads/...` URLs in `public.product_images.url` with resolvable Supabase/CSV URLs. Never delete products or image rows; the tool only rewrites URLs it can resolve.
3. Add a product with an image from the admin panel - the upload response and the saved `product_images.url` hold a full Supabase URL - and the storefront renders it.

## Tests (it is used for case-insensitive usernames, SKUs and names); on most hosts run `CREATE EXTENSION citext;` once as the admin user if it is not.

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
- Images are stored in Supabase Storage in production (see above), or local disk (`UPLOAD_DIR`) in development/self-hosting. JPG/PNG/WebP only, 5 MB max, content-sniffed.
