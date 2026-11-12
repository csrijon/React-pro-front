# MotoGear - Premium Bike Accessories (Frontend)

A complete, responsive, dark-themed e-commerce frontend for motorcycle gear, built with **React 19 + Vite**, Tailwind CSS, Framer Motion, React Router, Axios, Lucide icons and React Hot Toast.

The backend is **not** included. The app talks to a clean service layer which, for now, is answered by a built-in **mock API adapter** (local data). Point it at your real API by changing one environment variable.

---

## Quick start

```bash
npm install
cp .env.example .env     # optional - defaults already work
npm run dev              # http://localhost:5173
```

| Script            | What it does                         |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite dev server            |
| `npm run build`   | Production build into `dist/`        |
| `npm run preview` | Serve the production build locally   |
| `npm run lint`    | Lint with oxlint                     |

Deep links and page refreshes work in dev/preview. For static hosting, `public/_redirects` (Netlify/Cloudflare) is included; for Vercel/Nginx add an equivalent "all routes -> index.html" rewrite.

### Demo data (mock mode)
- **Demo account:** `demo@motogear.in` / `Demo@1234` (also shown on the login page)
- **Coupons:** `MOTO10` (10% off above ₹1,000), `RIDE500` (₹500 off above ₹5,000), `FREESHIP` (free standard shipping)
- Shipping: free above ₹999, otherwise ₹79. Express ₹149, Next-day ₹299.
- Accounts, orders, addresses, cart and wishlist are stored in your browser's `localStorage` (clear it to reset).
- "Forgot password" shows a demo link to the reset page, since no email is sent.

---

## Environment variables

| Variable        | Default                      | Purpose                                                       |
| --------------- | ---------------------------- | ------------------------------------------------------------- |
| `VITE_API_URL`  | `http://localhost:5000/api`  | Base URL of your backend                                      |
| `VITE_USE_MOCK` | `true`                       | `true` = local mock adapter, `false` = real HTTP to `VITE_API_URL` |

---

## Switching to your real backend

1. Set `VITE_USE_MOCK=false` and `VITE_API_URL=https://your-api/api` in `.env`.
2. Implement the endpoints below (or adapt the one-liner calls in `src/services/*`). UI components never call `axios` directly, so nothing else changes.
3. Auth: `AuthContext` stores the token returned by `/auth/login|register` and `src/services/api.js` sends it as `Authorization: Bearer <token>`.
4. Errors: any non-2xx response should return `{ "message": "Human readable text" }`; it is surfaced in forms and toasts.

### Endpoint contract

| Service           | Method & path                                   | Request / response                                                        |
| ----------------- | ----------------------------------------------- | ------------------------------------------------------------------------- |
| productService    | `GET /products`                                 | query `q, category, brand, minPrice, maxPrice, rating, inStock, sort, page, limit, tag` -> `{items,total,page,pages}` |
|                   | `GET /products/facets`                          | `{categories:{slug:n}, brands:{slug:n}, maxPrice}`                        |
|                   | `GET /products/by-ids?ids=a,b`                  | `Product[]`                                                               |
|                   | `GET /products/:slug`, `/reviews`, `/related`   | `Product`, `Review[]`, `Product[]`                                        |
|                   | `POST /products/:slug/reviews`                  | `{rating,title,text}` (auth)                                              |
| categoryService   | `GET /categories`, `GET /categories/:slug`      | `Category` (+ product `count`)                                            |
| authService       | `POST /auth/register`, `/auth/login`            | -> `{token,user}`                                                         |
|                   | `GET /auth/me`                                  | `{user}`                                                                  |
|                   | `POST /auth/forgot-password`, `/auth/reset-password` | `{email}` / `{token,password}`                                      |
| userService       | `PUT /users/profile`, `PUT /users/password`     | profile / password change                                                 |
|                   | `GET/POST /users/addresses`, `PUT/DELETE /users/addresses/:id` | `Address`                                                  |
| cartService       | `GET/PUT /cart`, `POST /cart/coupon`, `GET /coupons` | `{items,coupon}`; coupon validation returns the coupon object        |
| wishlistService   | `GET/PUT /wishlist`                             | `string[]` of product ids                                                 |
| orderService      | `POST /orders`, `GET /orders`, `GET /orders/:id`| Order object (items, addresses, delivery, payment, totals)                |
| contentService    | `GET /blogs`, `/blogs/:slug`, `/brands`, `/brands/:slug`, `/content/{testimonials,faqs,team,policies/:slug}`, `POST /newsletter`, `POST /contact` | content |

The mock implementation of every route lives in `src/services/mock/mockAdapter.js`: it is the executable reference for response shapes. Product shape: see `src/data/products.js`.

**Payments are intentionally not implemented.** Checkout only records the chosen method; `orderService.create` posts `payment: { method, status }` for your backend to turn into a real payment intent.

---

## Project structure

```
src/
  assets/            static assets
  components/
    common/          Logo, Rating, SmartImage, ProductArt, Modal, Pagination, States, Skeletons...
    layout/          Header, Footer, SearchOverlay, MainLayout
    products/        ProductCard, ProductGrid, Catalog (filters/sort/pagination), FilterSidebar
    cart/            CartItem, CouponBox, OrderSummary
    forms/           FormField, AddressFields, LoadingButton, NewsletterForm
    home/            Hero, CategoryShowcase, PromoBanners, Testimonials...
  pages/             Home, Shop, Category, ProductDetails, Cart, Checkout, Authentication,
                     Account, About, Contact, Blog, Brands, Policies, NotFound
  context/           AuthContext, CartContext, WishlistContext
  hooks/             useFetch, useForm, useDebounce, useRecentlyViewed, useClickOutside, usePageTitle
  services/          api.js (axios) + one file per domain + mock/mockAdapter.js
  data/              mock catalogue, categories, brands, blogs, content
  utils/             pricing, validators, formatters, storage, constants, images
  routes/            AppRoutes (lazy-loaded), ProtectedRoute
```

### Notable design decisions
- **URL-driven catalogue:** all Shop/Category/Brand filters, sorting, search and pagination live in the query string, so views are shareable and survive refresh.
- **One pricing function** (`utils/pricing.js#calcTotals`) powers cart, checkout and order summaries, so numbers always agree.
- **Loading / error / empty states** are handled by `useFetch`, `ProductGrid`, `States` and `Skeletons`.
- **Accessibility:** semantic landmarks, skip link, labelled controls, keyboard-friendly dropdowns/dialogs, `aria-live` regions, visible focus rings.

---

## Imagery
- Hero, banners, blog and About photography load from the Unsplash CDN (`src/utils/images.js`). If an image fails, `SmartImage` shows a branded fallback instead of a broken icon.
- Product images are crisp **vector renders** (`components/common/ProductArt.jsx`) keyed by `product.art` + colour, so the catalogue always looks right with no network cost. When your backend provides real photos, add `image` (single) or `images` (array, used by the gallery) to a product and they take over automatically.
- Brand logos are typographic marks (`BrandMark`). Replace with official assets when you have licences.
- Payment badges in the footer are typographic placeholders, not official logos.

## Browser/responsive coverage
Layouts were exercised at 320, 375, 425, 768, 1024, 1440 and 1920 px with no horizontal overflow on any route.
