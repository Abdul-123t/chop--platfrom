# CHOP

CHOP is a React/Vite pre-launch website.

## Backend API, admin and newsletters

Signups, notification emails, the admin dashboard data and newsletters are
served by the separate **chop-API** backend (Next.js). All UI stays in this
project:

- `/` is the waitlist website. When `VITE_API_URL` is set, the form posts to
  `${VITE_API_URL}/api/waitlist`; otherwise it falls back to the local
  `/api/waitlist` function described below.
- `/admin` (configurable with `VITE_ADMIN_PATH`) is the admin dashboard: sign in
  with the backend's `ADMIN_PASSWORD`, browse and export the waitlist, select
  people, and compose, preview, test and send newsletters.
- `/unsubscribe?token=...` is the page linked from every email.

Set `VITE_API_URL` (the backend URL, no trailing slash) and optionally
`VITE_ADMIN_PATH` in `.env.local` and in Vercel. If you change the admin path,
update the rewrites in `vercel.json` to match. The backend must list this
site's origin in its `ALLOWED_ORIGINS`.

## Local waitlist function

The original waitlist function in this repository works without the backend. Waitlist submissions are accepted by the
same-origin `/api/waitlist` serverless function and saved through the official
Google Sheets API. Google credentials are read only by the server; never add them
to `src/config.ts`, a `VITE_*` variable, or any other browser bundle.

## Google Sheets setup

1. In Google Cloud Console, create or select a project and enable the **Google
   Sheets API**.
2. Create a service account and a JSON key. Keep the downloaded key private.
3. Create a private spreadsheet named **CHOP — PRE-LAUNCH DATABASE**.
4. Copy the spreadsheet ID from its URL (the text between `/d/` and `/edit`).
5. Share the spreadsheet with the service account's `client_email` and grant
   Editor access. Do not make the spreadsheet public.
6. Copy `.env.example` to `.env.local` for local work. Set:
   - `GOOGLE_SPREADSHEET_ID` to the spreadsheet ID.
   - `GOOGLE_SERVICE_ACCOUNT_JSON` to the complete service-account JSON on one
     line. Keep the private key's escaped `\n` characters intact.
7. In Vercel, add both variables to the project's Development, Preview, and
   Production environments, then redeploy. Do not prefix either variable with
   `VITE_`.

The API creates the `Customer Waitlist` and `Vendor Applications` tabs with
their expected headers when they are missing. Existing non-empty headers are
checked and are never overwritten if they do not match.

## Development and checks

Install dependencies with `npm install`. To exercise the API locally, install
the Vercel CLI and run `vercel dev`; it loads `.env.local` and serves the Vercel
function at `/api/waitlist`. `npm run dev` alone serves only the Vite website.

Run `npm test` for API validation and customer/vendor row-mapping tests,
`npm run lint` for TypeScript checking, and `npm run build` for the production
frontend build.

No sample registrations are inserted by setup or tests. A successful response
is returned only after the Sheets API append call succeeds (or when an existing
registration is detected as a duplicate). If credentials, permissions, or the
spreadsheet ID are not configured, submissions fail and the form keeps the
entered values for retry.

## Sheet columns

Customer entries include a generated registration ID, server timestamp, first
name, text-preserved WhatsApp number, email, launch location, selected food
categories, contact consent and timestamp, and registration status.

Vendor entries include a generated application ID, server timestamp, business
and contact details, category and operating details, fulfillment selections,
social link, comments, consent, application status, admin notes, and review
date. Fields not supplied by an applicant (including admin notes and review
date) are left blank rather than fabricated. Registration IDs and timestamps
are generated on the server. Spreadsheet writes use the Sheets API `RAW` mode,
and formula-like user text is escaped before it is stored.

The API validates payloads, limits request size, rejects honeypot submissions,
applies a per-instance IP rate limit, and checks for an existing WhatsApp
number in the relevant tab before appending. The duplicate check is
best-effort under simultaneous requests across separate serverless instances;
the Sheets API does not provide a conditional append/unique constraint.
