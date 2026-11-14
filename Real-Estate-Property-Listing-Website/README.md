# EstateHub

Real estate listing platform. **Frontend:** React + Vite + Tailwind + Framer Motion. **Backend:** Node + Express + MongoDB (Mongoose) in `server/`.

## Run it

```bash
# 1. MongoDB must be running (default mongodb://127.0.0.1:27017)
# 2. API
cd server
cp .env.example .env        # then set JWT_SECRET to a long random value
npm install
npm run seed                # WIPES the estatehub collections and loads demo data
npm run dev                 # http://localhost:5000

# 3. Frontend (new terminal, project root)
npm install
npm run dev                 # http://localhost:5173
```

Seeded admin login: `admin@estatehub.com` / `Admin@12345` (set `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `server/.env` before seeding, and change the password after first login).

The frontend reads `VITE_API_URL` (see `.env.example`). Leave it empty to run on built-in mock data with no backend.

## Features
**Visitors:** home search, property listing with working filters / sort / grid-list / pagination, property details (gallery, lightbox, floor plan, map, EMI estimate, similar properties), projects, about, contact, wishlist, property comparison (up to 3), EMI calculator, recently viewed, map view of all listings with price markers, video tour, print brochure, blog / guides, FAQ, list-your-property (login required, admin-approved, with photo upload).

**Accounts:** register, log in, forgot / reset password, profile, change password, wishlist synced to the account, saved searches, my enquiries and visits.

**Admin (`/admin`, roles `admin` and `editor`):** dashboard with analytics, property and project management with image upload (adding or editing a property or article opens a panel from the right), a Team section with custom roles (shown on the About page), enquiries, appointments (double-booking blocked), customer review moderation (approved reviews appear on the About page), owner submissions (review, correct, then approve to publish under your company name, or reject with a reason), customers, team users and roles (admin only), site settings (the owner can change the logo, company name, brand colours, home hero text and photo, headline numbers, About page text and photo, contact details, working hours, footer text, social links and default search description; header menu and footer links; home page section order, titles, "why choose us" cards and call-to-action box; sign-in / sign-up / list-property page text; fonts and favicon; currency and number format; property types, furnishing options, amenities and visit time slots — the website updates immediately). Floor plans and room sizes, project configuration rows, and team / testimonial photos are edited in their own admin forms, an activity log (who did what and when, with before/after values; admin only, CSV export, 12-month retention via `ACTIVITY_RETENTION_DAYS`), per-property change history, blog, and FAQ / testimonial editors.

**API:** JWT auth with bcrypt, role-based access, input validation (zod), field whitelisting, rate limits, helmet, CORS allow-list, image-type and size checks on uploads, reset tokens stored hashed, password reset and notification emails (printed to the server console unless `SMTP_*` is set).

## Notes
- Uploaded images are stored in `server/uploads/` (use object storage such as S3 in production).
- Set `CLIENT_URL` in `server/.env` to your deployed frontend origin(s).
- Map markers use approximate locality coordinates from the seed data; enter exact latitude / longitude per property in the admin form.
- Not included: online payments, live chat, and multi-language support.

- There is a single contact: the company. Every property shows your company name, phone and WhatsApp (from Admin → Settings) instead of an individual agent.
