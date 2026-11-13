# Security

What protects MotoGear, how to keep it that way, and what is still your responsibility. Every control below is covered by an automated test (`cd server && npm test`, 28 tests) unless marked *(config)*.

## Roles and access control
- Two roles: `user` and `admin`. **Registration can only create a `user`** (the role field is ignored even if sent). The first admin is created from the server with `npm run seed:admin`; after that, admins promote others in *Admin > Customers*.
- Every `/api/admin/*` route requires a valid session **and** the admin role on the server; the React route guard is only a convenience.
- **Ordering requires a signed-in account.** Visitors can browse, search and fill a cart, but the order, payment, order-lookup and cancel APIs all return 401 without a valid login (enforced on the server, not just hidden in the UI). A customer can only read or cancel their own orders; one customer cannot see or cancel another's. Admins cannot change or suspend their own account.
- Admin write operations accept only a whitelist of fields (no mass-assignment of `role`, `rating`, `slug`, …).

## Authentication
- Passwords: bcrypt cost 12, min 8 chars with letters + numbers, common breached passwords rejected, never returned by the API.
- **Account lockout:** 5 wrong passwords or codes lock the account for 15 minutes (on top of per-IP rate limits).
- **Two-factor authentication (TOTP):** works with Google Authenticator, Authy, 1Password, etc. Seeds are AES-256-GCM encrypted at rest, codes are single-use (replay-protected), 8 one-time recovery codes are stored hashed. **Mandatory for admins in production** (`REQUIRE_ADMIN_2FA`, default on): an admin with 2FA off can sign in but is forced to enrol before any admin data is served.
- **Sessions:** JWT pinned to HS256 with issuer and audience checks (rejects `alg:none`, 2FA challenge tokens and expired/tampered tokens). Admin sessions last 8 h, customer sessions 7 d. Changing a password, resetting it, suspending a user or pressing **Sign out everywhere** immediately invalidates all other sessions. A revoked session signs the browser out automatically.
- Password reset: random token stored hashed, 1 hour expiry, identical response whether or not the email exists, ends all sessions when used.

## Money and orders
- The server recomputes every price, coupon and shipping charge; client-sent totals are ignored. Stock is reserved atomically.
- Razorpay payments are accepted only after HMAC signature verification; the webhook is signature-checked **and** its captured amount must equal the order total. Online payment details/secret keys never reach the browser (only the public key id).
- Order IDs are 70-bit random values and orders are visible only to their owner (or an admin).

## Input and output
- All request bodies are validated with zod; `$`-operators and dotted keys are stripped from body, params **and nested query strings**; admin filters are compared as plain strings.
- Uploads: JPG/PNG/WebP only, 5 MB, verified by file signature (not just the claimed type), random file names, served with `nosniff` and `Content-Security-Policy: sandbox`.
- Tracking links entered by admins must be `http(s)://` and are re-checked in the browser before being rendered (blocks `javascript:` links).
- React escapes all rendered data; there is no `dangerouslySetInnerHTML`. Email templates escape user content.

## Transport and infrastructure
- API refuses to start in production with a weak/missing `JWT_SECRET` or non-HTTPS public URLs.
- Helmet headers, CORS allow-list, request size limits, rate limits (global, auth, orders, reviews, admin).
- nginx: strict Content-Security-Policy, HSTS, `nosniff`, framing and cross-origin isolation headers, version hidden, runs as **non-root**, read-only filesystem, all Linux capabilities dropped, no-new-privileges. API container is non-root, read-only, capability-free. MongoDB is not published to the host.
- **Audit log** (*Admin > Audit log*): every admin change and security event (sign-in, failures, lockouts, 2FA, password resets, role changes) with who/what/IP; request bodies are never stored. Kept 1 year.
- Email bodies containing reset links are never written to logs outside local development.

## What you still must do (no code can do this for you)
1. Serve the site over **HTTPS** (see DEPLOYMENT.md) and set `TRUST_PROXY` correctly.
2. Use long unique secrets (`JWT_SECRET`), a strong admin password, and keep your recovery codes offline.
3. Keep MongoDB private, enable backups, and keep Node/Docker images updated (`npm audit`, rebuild images regularly).
4. Configure SMTP so password-reset emails work (without it, resets are impossible by design).
5. Before real payments: test Razorpay in test mode with your own keys.
6. Review access periodically (*Admin > Customers*) and watch the audit log for repeated failures.

## Known residual risks (honest list)
- The session token lives in `localStorage` (standard SPA trade-off). The strict CSP and lack of third-party scripts reduce XSS exposure; moving to httpOnly cookies would also require CSRF protection.
- No software is "100% secure". This project has had automated and manual review only; for a high-value store commission an independent penetration test and consider a WAF/CDN (e.g. Cloudflare) in front.
- Uploaded images are not re-encoded; if you accept uploads from untrusted staff, add image re-processing (e.g. `sharp`) or use a storage service with scanning.

## Reporting a vulnerability
Email the address in your support contact (set one up, e.g. security@your-domain.com) rather than opening a public issue.
