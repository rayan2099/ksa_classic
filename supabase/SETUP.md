# Supabase Backend Setup

1. Create a Supabase project.
2. Open **SQL Editor**, paste `schema.sql`, and run it.
3. Optionally run `seed.sql` to add demo inventory.
4. Open **Authentication > Users** and create the first admin user with a strong password.
5. Promote that user in SQL Editor:

```sql
update public.profiles
set role = 'super_admin',
    full_name = 'KSA Classic Admin'
where email = 'YOUR_ADMIN_EMAIL';
```

6. Copy these values from **Project Settings > API** into local `.env` and Vercel:

```env
SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
SUPABASE_ANON_KEY="YOUR_PUBLISHABLE_OR_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
APP_URL="https://www.ksaclassics.online"
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code or commit it to Git.

## What The Schema Includes

- `profiles`: administrator identity and roles linked to Supabase Auth.
- `cars`: inventory, image galleries, status, pricing, and specifications.
- `messages`: public buyer inquiries.
- `message_replies`: persistent threaded admin replies.
- `admin_sessions`: hashed, expiring server session tokens.
- `vehicle-images`: public-read Supabase Storage bucket for normalized uploads.
- Indexes, constraints, timestamps, foreign-key cascades, triggers, and RLS.

The Express server performs private operations with the service-role key. Direct
browser database access is limited to reading showroom inventory.

## Resend Email

If `schema.sql` was installed before email support, run `002_resend_email.sql`
once in the Supabase SQL Editor.

1. Create a Resend account and add your sending domain.
2. Add the DNS records Resend provides and wait until the domain is verified.
3. Create a Resend API key with sending access.
4. Add these values to local `.env` and Vercel:

```env
RESEND_API_KEY="re_YOUR_KEY"
RESEND_FROM_EMAIL="KSA Classics <info@ksaclassics.online>"
SHOWROOM_EMAIL="info@ksaclassics.online"
```

`RESEND_FROM_EMAIL` must use a domain verified in Resend. `SHOWROOM_EMAIL` is
used as the reply-to address. Buyer inquiries are always saved before the
confirmation email is attempted, and admin replies remain logged if delivery
fails.
