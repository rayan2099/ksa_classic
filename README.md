<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/36e65ff6-0075-4537-8ab6-43508a2c43db

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Supabase Backend

The complete production database setup is in:

- `supabase/schema.sql` - tables, constraints, indexes, triggers, RLS, sessions, and Storage.
- `supabase/seed.sql` - optional demo inventory and inquiry.
- `supabase/SETUP.md` - dashboard, Auth, and Vercel configuration steps.

Run `schema.sql` first, create the initial Supabase Auth user, promote that profile
to `super_admin`, and then configure `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and
`SUPABASE_SERVICE_ROLE_KEY` on the server.
