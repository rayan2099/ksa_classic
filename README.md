# KSA Classics

Public classic-car showroom and private administration CRM built with React,
Express, Supabase, and Resend.

## Local Development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and fill in the required values.
3. Run `npm run dev`.

## Production Setup

1. Run `supabase/schema.sql` in the Supabase SQL Editor.
2. If the schema was installed before email support, also run
   `supabase/002_resend_email.sql`.
3. Create the first administrator in Supabase Auth and promote the matching
   profile to `super_admin` using `supabase/SETUP.md`.
4. Verify the sending domain in Resend.
5. Add all values from `.env.example` to the Vercel project for Production and
   Preview.
6. Push the repository. Vercel uses `vercel.json` to build the frontend, expose
   the Express API as serverless functions, and support direct admin routes.

Before launch, confirm these URLs return successfully:

- `https://www.ksaclassics.online/`
- `https://www.ksaclassics.online/admin/login`
- `https://www.ksaclassics.online/api/db-status`
- `https://www.ksaclassics.online/api/cars`
- `https://www.ksaclassics.online/robots.txt`
- `https://www.ksaclassics.online/sitemap.xml`

Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code or commit any `.env`
file.
