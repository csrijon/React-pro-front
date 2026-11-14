# Domus Studio — Interior Design Portfolio & Admin CMS 

React + Vite + Tailwind + Framer Motion. Public website, admin CMS and a Node/Express backend.

## Run it

```bash
npm install
npm run dev:all   # API on :4000 + website on :5173 (Vite proxies /api and /uploads)
```

Requires a running MongoDB (local, Docker or Atlas) — set `MONGODB_URI` in `.env`. Default: `mongodb://127.0.0.1:27017/domus_studio`.

Admin: `/admin`. Credentials come from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` (git-ignored; copy `.env.example`).
They are applied only when the database is first seeded; afterwards change the password in Admin → Settings.
To re-apply `.env` values, drop the `domus_studio` database and restart the server.

Production: `JWT_SECRET=<long random> npm start` builds the site and serves it with the API on one port (default 4000).

## Backend (`server/`)
Express + Mongoose (MongoDB) + JWT + bcrypt + multer. Models are in `server/models.js` (Project, Service, Designer, Inquiry, Media, User,
plus `Doc` for the pages/settings documents, `Visit` for daily visitor counts and `Activity` for the dashboard feed).
On first start the database is seeded with starter content, once (tracked by a `meta` document), so deleting content never brings the samples back.
If an old `server/data/db.json` from the previous file-based backend exists, it is imported instead. Uploaded images and videos are stored in `server/uploads/` (git-ignored).

| Area | Endpoints |
| --- | --- |
| Auth | `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/change-password` |
| Projects / Services / Designers | `GET` list and `GET /:idOrSlug` are public (drafts hidden from visitors); `POST`, `PUT /:id`, `DELETE /:id` need the admin token |
| Inquiries | `POST` is public (validated, rate-limited); everything else is admin only |
| Media | `GET`, `DELETE /:id`, `POST` (multipart field `file`): images up to 10 MB, videos (MP4/WebM/MOV) up to 300 MB, streamed with range requests |
| Site content | `GET/PUT /api/pages` (hero, stats, testimonials, philosophy, gallery, about, contact, SEO), `GET/PUT /api/settings` (logo, contact, social, SEO defaults, admin profile) |
| Analytics | `POST /api/track`, `POST /api/projects/:id/view`, `GET /api/dashboard` (admin) |

## What the admin can edit
Everything visitors see is managed from the admin panel:
- **Admin → Pages:** all headings, labels, button text, images, statistics, testimonials, showreel, philosophy, process, SEO for Home, About, Contact, the Projects/Services/Designers page headers, plus a **Site-wide** tab for the menu (rename/hide items and the menu button), footer text, project categories and the inquiry form's project types and budget ranges.
- **Admin → Settings:** logo, browser-tab icon, colours and fonts (public site only), contact details, social links, default SEO.
- **Projects / Services / Designers / Media / Inquiries:** full management (projects include videos and before/after photos).
- The last-loaded content is cached in the visitor's browser so repeat visits show it instantly (no flash of default text or colours).

## Frontend modes
- `VITE_API_URL=/api` (default in `.env`) uses the real backend.
- Leave `VITE_API_URL` empty (or `VITE_USE_MOCK=true`) to run the frontend alone on browser-storage mock data.
- Endpoints are centralised in `src/services/api/client.js`; per-resource modules are in `src/services/api/`.

## Performance
Measure with the **production build**, not the Vite dev server (dev serves hundreds of unbundled files and scores far lower):
`npm start`, then run Lighthouse on `http://localhost:4000`.
What the production server does for speed: gzip compression, one-year immutable caching for hashed assets, the site content inlined into the HTML
(no extra request before first paint), and a preload of the homepage hero image. Images from Unsplash are served at responsive sizes (`srcset`).
Uploaded images are served as uploaded (the admin uploader already shrinks photos to 2400 px); for further savings put a CDN or image resizer in front of `/uploads`.
