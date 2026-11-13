# MotoGear - Bike Accessories E-commerce (Full Stack)

A complete online store for motorcycle gear:

| Part | Tech | Where |
| --- | --- | --- |
| **Storefront** | React 19, Vite, Tailwind, Framer Motion, React Router | `src/` |
| **Admin panel** | same React app, route `/admin` (admin role only) | `src/pages/Admin/` |
| **REST API** | Node 20, Express, MongoDB (Mongoose), JWT | `server/` |
| **Payments** | Razorpay (verified server-side) + Cash on Delivery | `server/src/routes/shop.js` |
| **Deployment** | Docker, nginx, docker-compose | `Dockerfile`, `server/Dockerfile`, `docker-compose.yml` |

See **[PERFORMANCE_AUDIT.md](PERFORMANCE_AUDIT.md)** for measured speed results, **[SECURITY.md](SECURITY.md)** for every protection in place, **[DEPLOYMENT.md](DEPLOYMENT.md)** to go live and **[server/README.md](server/README.md)** for the API.

---

## Run it locally

You need Node 20+ and MongoDB (local install, Docker, or a free Atlas cluster).

```bash
# 1. API
cd server
cp .env.example .env          # set MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npm run seed                  # loads categories, brands, 52 products, blog posts, FAQs, coupons
npm run seed:admin            # creates your admin account from ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev                   # http://localhost:5000  (health: /health)

# 2. Storefront + admin (new terminal, project root)
npm install
cp .env.example .env          # VITE_API_URL=http://localhost:5000/api, VITE_USE_MOCK=false
npm run dev                   # http://localhost:5173
```

Sign in with your admin account at `/login`; you land in the admin panel at `/admin`.

> Want the storefront without a backend? Set `VITE_USE_MOCK=true`. Everything except the admin panel works against built-in sample data (demo login `demo@motogear.in` / `Demo@1234`).

### Scripts
| Root | |
| --- | --- |
| `npm run dev` / `build` / `preview` / `lint` | Vite dev server, production build, preview, lint |

| `server/` | |
| --- | --- |
| `npm run dev` / `start` | API with reload / production start |
| `npm run seed` | Seed the catalogue (`-- --reset` wipes catalogue collections, never users/orders) |
| `npm run seed:admin` | Create or promote the admin from env vars |
| `npm test` | 28 integration + security tests against a real MongoDB (`MONGODB_URI=mongodb://127.0.0.1:27017 npm test`) |

---

## Admin panel (`/admin`)

| Area | What you can do |
| --- | --- |
| **Dashboard** | Revenue, orders, customers, 30-day sales chart, orders by status, top sellers, low-stock alerts, unread messages |
| **Orders** | Search/filter by status, payment, date; open an order to move it through *Processing -> Packed -> Shipped -> Out for Delivery -> Delivered*, add courier + tracking, cancel (stock is returned), mark refunds, print. Customers are emailed on shipped/delivered/cancelled |
| **Security** | Two-factor auth setup (mandatory for admins in production), sign out everywhere, and a searchable **audit log** of every admin change and sign-in event |
| **Customers** | Search, see order count and lifetime spend, suspend/reactivate, grant or remove admin |
| **Coupons** | Percent / flat / free-shipping codes with minimum order, max discount, usage limit, expiry, hidden codes |
| **Products** | Add/edit/hide/delete with photo upload, price + MRP, stock, sizes, colours, specs, features, bestseller/new/trending flags |
| **Categories / Brands** | Create and edit; they update the storefront menu, filters and pages automatically. Deleting is blocked while products use them |
| **Reviews** | Moderate customer reviews (ratings recalculate) |
| **Blog posts, FAQs, Testimonials** | Manage site content without touching code |
| **Messages / Subscribers** | Contact-form inbox with resolve + reply, newsletter list with CSV export |

---

## How it fits together

- **Login to order.** Everyone can browse and add to cart; checkout and every order endpoint require an account (guests are sent to sign in/register and returned to checkout with their cart intact).
- **One source of truth for money.** The browser only sends product ids, quantities, size and coupon code. The server loads real prices, validates stock, applies the coupon, calculates shipping/total, then reserves stock atomically. A tampered price in the request is ignored (covered by a test).
- **Online payments** (Razorpay): the server creates the Razorpay order, the browser opens Razorpay Checkout, and the result is accepted **only** after the server verifies the HMAC signature. A signed webhook is a safety net if the shopper closes the tab. Unpaid online orders release their stock after 30 minutes. Without Razorpay keys, only Cash on Delivery is offered.
- **Auth:** bcrypt + pinned-algorithm JWTs, account lockout, TOTP two-factor with recovery codes (required for admins in production), session revocation, hashed expiring reset tokens.
- **Security:** Helmet, CORS allow-list, layered rate limits, zod validation, NoSQL-operator stripping (body, params and nested query), whitelisted admin fields, signature-checked uploads, audit log, hardened non-root containers with a strict CSP. Details and residual risks in [SECURITY.md](SECURITY.md).

### Project structure
```
src/                         storefront + admin (React)
  pages/Admin/               dashboard, orders, generic CRUD (resources.jsx + ResourcePage.jsx)
  services/                  api.js + one file per domain (+ mock adapter for offline demos)
  context/                   Auth, Cart, Wishlist, Catalog
server/src/
  app.js, server.js          Express app, bootstrap + graceful shutdown + housekeeping job
  config/                    env validation (fails fast in production), db
  models/index.js            Mongoose schemas
  routes/                    auth, catalog, content, shop (cart/orders/payments), users, admin
  middleware/                auth, validation, sanitising, uploads, error handling
  utils/                     pricing, razorpay, mailer, helpers
  seed/                      starter data + admin creation
  test/                      integration tests
```

## Known limitations (honest list)
- Product photos in the seed catalogue are vector illustrations; upload real photos in **Admin > Products**.
- Uploaded images are stored on the API server's disk (a Docker volume in compose). For multiple API servers or a PaaS with ephemeral disks, switch uploads to S3/Cloudinary.
- The JWT is kept in `localStorage` (standard SPA trade-off). The strict CSP reduces XSS risk; moving to httpOnly cookies would need CSRF protection.
- Payments were tested with a mocked Razorpay API and real signature maths; do a test-mode payment with your own Razorpay keys before launch.
