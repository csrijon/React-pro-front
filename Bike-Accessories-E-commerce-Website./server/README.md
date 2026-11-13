# MotoGear API

Express + MongoDB REST API for the MotoGear storefront and admin panel. All routes are under `/api`; uploaded images are served from `/uploads`.

```bash
cp .env.example .env && npm install
npm run seed && npm run seed:admin
npm run dev            # http://localhost:5000
npm test               # needs MongoDB:  MONGODB_URI=mongodb://127.0.0.1:27017 npm test
```

Configuration is validated at start-up (`src/config/env.js`); see `.env.example` for every variable.

## Conventions
- Errors: `{ "message": "Readable text", "errors": { "field": "problem" } }` with a suitable status (400/401/403/404/409/422/429/5xx).
- Lists: `{ items, total, page, pages }` with `?page&limit`.
- Auth: `Authorization: Bearer <jwt>`. Roles: `user`, `admin`.
- Documents are returned with `id` (never `_id`). Orders use the public order id (`MG...`) as `id`.

## Public endpoints
| Method | Path | Notes |
| --- | --- | --- |
| GET | `/health` | liveness + DB status |
| GET | `/config` | `{paymentsEnabled, razorpayKeyId, shipping rules}` |
| GET | `/products` | `q category brand minPrice maxPrice rating inStock tag sort page limit` |
| GET | `/products/facets`, `/products/by-ids?ids=`, `/products/:slug`, `/:slug/related`, `/:slug/reviews` | |
| POST | `/products/:slug/reviews` | auth; one per user; "verified" if they bought it |
| GET | `/categories`, `/categories/:slug`, `/brands`, `/brands/:slug` | with product counts |
| GET | `/blogs`, `/blogs/:slug`, `/content/faqs`, `/content/testimonials`, `/content/team`, `/content/policies/:slug` | |
| POST | `/newsletter`, `/contact` | rate limited |
| GET | `/coupons` | public (non-hidden) active coupons |
| POST | `/cart/coupon` | `{code, subtotal}` -> validates and returns the coupon |
| POST | `/auth/register`, `/auth/login`, `/auth/forgot-password`, `/auth/reset-password` | rate limited; login returns `{requires2fa, challenge}` for 2FA accounts |
| POST | `/auth/2fa/login`, `/auth/2fa/setup`, `/auth/2fa/enable`, `/auth/2fa/disable`, `/auth/logout-all` | two-factor + session management |
| GET | `/auth/me` | |
| PUT | `/users/profile`, `/users/password` | auth |
| GET/POST/PUT/DELETE | `/users/addresses[/:id]` | auth |
| GET/PUT | `/cart`, `/wishlist` | auth; synced copy of the browser state |
| POST | `/orders` | **auth required**. Body: customer, items `[{id, qty, size, colorName}]`, addresses, `delivery.id`, `payment.method`, `coupon`. Prices and totals are **always recomputed on the server** |
| GET | `/orders`, `/orders/:id` | own orders only (admins can open any) |
| POST | `/orders/:id/cancel` | owner, while Processing / Pending Payment |
| POST | `/orders/:id/verify-payment` | Razorpay `{razorpay_order_id, razorpay_payment_id, razorpay_signature}` |
| POST | `/webhooks/razorpay` | signed webhook (raw body) |

## Admin endpoints (`/api/admin`, role `admin`)
Generic CRUD (`GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`, with `?q=&page=&limit=` and per-resource filters) for:
`products`, `categories`, `brands`, `coupons`, `blogs`, `faqs`, `testimonials`; read/update/delete for `messages`, `subscribers`; read/delete for `reviews`.

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/stats` | dashboard numbers, 30-day series, top products, low stock |
| GET | `/orders`, `/orders/:id` | filters `status payment q from to` |
| PATCH | `/orders/:id` | `{status, note, tracking:{courier,number,url}, paymentStatus}`. Status only moves forward; cancelling returns stock |
| GET/PUT | `/users`, `/users/:id` | `{role, isBlocked}`; you cannot change yourself |
| POST | `/upload` | multipart `images[]` (JPG/PNG/WebP, 5 MB, signature-checked) -> `{urls}` |
| GET | `/subscribers-export/csv` | |
| GET | `/audit` | security + admin activity trail |

Only whitelisted fields are accepted on every write, product slugs are generated (unique) and never change on edit, and categories/brands/products that are in use cannot be deleted.

## Data model (MongoDB)
`users`, `products`, `categories`, `brands`, `reviews` (unique per user+product), `orders` (immutable item/price snapshot + status history), `coupons`, `blogs`, `faqs`, `testimonials`, `subscribers`, `messages`.
