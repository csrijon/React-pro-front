# Deploying MotoGear to production

Two supported paths. Both need: a domain, HTTPS, and MongoDB.

## Pre-launch checklist
- [ ] `JWT_SECRET` is a random 48+ byte string (the API refuses to start in production otherwise)
- [ ] MongoDB has authentication on and is **not** reachable from the internet
- [ ] HTTPS is enabled for the public site (Let's Encrypt via Caddy, Cloudflare, or your host)
- [ ] Admin account created with a strong, unique password (`npm run seed:admin`), and you changed any dev password. On first sign-in the admin is **forced to set up two-factor authentication** (keep the recovery codes offline)
- [ ] Read [SECURITY.md](SECURITY.md) and the "what you still must do" list
- [ ] `SITE_URL` / `CLIENT_URL` / `PUBLIC_URL` use your real `https://` domain (the API refuses to start in production with non-HTTPS URLs; `localhost` is the only exception, for local testing)
- [ ] SMTP configured (password-reset and order emails are *not sent* without it)
- [ ] Razorpay **live** keys + webhook set up (or leave empty for COD only)
- [ ] Backups scheduled for MongoDB and the uploads volume
- [ ] Replace seed products/photos/blog/FAQ content with your own in `/admin`
- [ ] Update the policy text (`server/src/seed/data/content.js` -> `policies`) and contact details (`src/utils/constants.js`) with your real legal/business information
- [ ] Run `cd server && npm test` against a test database

---

## Path A - Docker Compose on one server (recommended)

Works on any Linux VPS with Docker.

```bash
cp deploy.env.example deploy.env     # fill in every value (see comments inside)
docker compose --env-file deploy.env up -d --build
# create the first admin + load starter data (run once):
docker compose --env-file deploy.env exec -e ADMIN_EMAIL=you@shop.com -e ADMIN_PASSWORD='Str0ng-Passw0rd' api node src/seed/createAdmin.js
docker compose --env-file deploy.env exec api node src/seed/seed.js
```

The stack: `mongo` (private) <- `api` (private) <- `web` (nginx on `WEB_PORT`, serves the site, proxies `/api` and `/uploads`). Because the browser only talks to one origin there is no CORS to configure.

**HTTPS:** put a TLS proxy in front of the `web` container. Easiest is Caddy on the same host:

```
# /etc/caddy/Caddyfile
www.your-domain.com {
    reverse_proxy localhost:8080      # set WEB_PORT=8080 in deploy.env
}
```
Then set `TRUST_PROXY=2` in `deploy.env` (Caddy -> nginx -> API) and `SITE_URL=https://www.your-domain.com`.

The `web` container runs as a non-root user on port 8080 inside the container (`WEB_PORT` is the host port). Containers are read-only with all capabilities dropped; if you add files the app must write, mount a volume for them.

**Updates:** `git pull && docker compose --env-file deploy.env up -d --build`.
**Logs:** `docker compose logs -f api`. **Health:** `GET /health` on the API, `GET /healthz` on nginx.

**Backups**
```bash
docker compose exec mongo mongodump -u "$MONGO_USER" -p "$MONGO_PASSWORD" --authenticationDatabase admin --db motogear --archive | gzip > motogear-$(date +%F).gz
docker run --rm -v bike-accessories-e-commerce-website_uploads:/u -v $PWD:/b alpine tar czf /b/uploads-$(date +%F).tgz -C /u .
```
(adjust the volume name to `docker volume ls`.)

---

## Path B - Managed hosting (frontend and API separate)

**API** (Render / Railway / Fly / any Node host, or `server/Dockerfile`)
- Root directory: `server`, start command `npm start`, Node 20
- Env vars: everything in `server/.env.example`. Use MongoDB Atlas for `MONGODB_URI`.
- `CLIENT_URL=https://www.your-domain.com` (the storefront origin; comma-separate extras)
- `PUBLIC_URL=https://api.your-domain.com`, `TRUST_PROXY=1`
- Attach a persistent disk at `server/uploads` (or move uploads to object storage - see README limitations)

**Storefront** (Vercel / Netlify / Cloudflare Pages / S3+CDN)
- Build: `npm run build`, output `dist/`
- Build-time env: `VITE_API_URL=https://api.your-domain.com/api`, `VITE_USE_MOCK=false`
- SPA rewrite so refreshes work: Netlify/Cloudflare use `public/_redirects` (included); on Vercel add `vercel.json` with `{"rewrites":[{"source":"/(.*)","destination":"/index.html"}]}`
- If you don't use the bundled nginx you should add equivalent security headers (see `deploy/security-headers.conf`, including the CSP: allow your API origin in `connect-src`/`img-src`).

---

## Razorpay setup
1. Create keys in the Razorpay dashboard (start with **Test mode**) and set `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`.
2. Add a webhook: URL `https://your-domain.com/api/webhooks/razorpay`, events `payment.captured` and `order.paid`, and set the same secret as `RAZORPAY_WEBHOOK_SECRET`.
3. Place a test order with a Razorpay test card/UPI, confirm the order turns **Processing / Paid**.
4. Switch to Live keys.

Without keys the storefront automatically hides online methods and offers Cash on Delivery only.

## Email setup
Any SMTP provider works (SES, SendGrid, Brevo, Gmail app password...). Set `SMTP_HOST/PORT/USER/PASS` and `MAIL_FROM` (use an address on a domain you've authenticated with SPF/DKIM). Set `ADMIN_NOTIFY_EMAIL` to receive new-order and contact-form alerts.

## Upgrading an existing database (performance indexes)
After deploying this version run once: `docker compose exec api npm run db:sync-indexes` (or `cd server && npm run db:sync-indexes`). It builds the new compound indexes and removes superseded ones. See PERFORMANCE_AUDIT.md.

## Operations notes
- The API validates its environment at start-up and exits with a clear message if something is missing or insecure.
- Graceful shutdown (SIGTERM) finishes in-flight requests; Docker healthchecks are built in.
- Rate limits: 300 requests/min/IP overall, 20 attempts/15 min on login/register, 10 on password reset. Set `TRUST_PROXY` correctly or they will see your proxy's IP instead of the customer's.
- A background job cancels unpaid online orders after 30 minutes and returns their stock.
- Indexes are created automatically on first start.
