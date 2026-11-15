# CHOP

CHOP is a React/Vite pre-launch website.

## Backend API, admin and newsletters

Signups, notification emails, the admin dashboard data and newsletters are
served by the separate **chop-API** backend (Next.js, PostgreSQL). All UI stays
in this project:

- `/` is the waitlist website. The form posts to `${VITE_API_URL}/api/waitlist`.
- `/admin` (configurable with `VITE_ADMIN_PATH`) is the admin dashboard. Admins
  sign in with the email and password created by the backend's seed script, then:
  - browse, search, filter and export everyone on the waitlist
  - open an entry to see all of its details, change its status (for example
    approve or reject a vendor), add notes, or delete it
  - select people and compose, preview, test and send newsletters
- `/unsubscribe?token=...` is the page linked from every email.

## Environment

Copy `.env.example` to `.env.local` and set:

- `VITE_API_URL`: the backend URL, no trailing slash.
- `VITE_ADMIN_PATH`: optional, defaults to `/admin`. If you change it, update the
  rewrites in `vercel.json` to match.

Add the same variables in Vercel. The backend must list this site's origin in
its `ALLOWED_ORIGINS`.

## Development and checks

- `npm run dev` serves the site at http://localhost:3000 (run the backend too).
- `npm run lint` runs TypeScript checking.
- `npm run build` creates the production build.
