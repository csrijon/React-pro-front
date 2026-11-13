# EstateHub

Premium real estate frontend built with React + Vite, Tailwind CSS, Framer Motion, React Hook Form, Recharts and Sonner.

```bash
npm install
npm run dev      # development
npm run build    # production build
```

## Connecting your backend
Copy `.env.example` to `.env` and set `VITE_API_URL`. With it empty, every service in `src/services/` uses mock data
(persisted in localStorage so admin edits survive reloads). With it set, the same service functions call REST endpoints
such as `GET /properties`, `POST /inquiries`, `POST /auth/login`. Adjust paths in `src/services/*Service.js` to match your API.

## Notes
- Demo admin access: log in with any email starting `admin@`. This is a UI simulation only; real authentication and role checks must be implemented by your backend.
- Wishlist is stored in localStorage (`estatehub:wishlist`).
