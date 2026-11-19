# Supabase setup for Footprint

## 1. Environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Optional (lets scripts apply SQL from your machine — **database password**, not the API secret):

```env
SUPABASE_DB_URL=postgresql://postgres.[ref]:[YOUR-DB-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```

The public site falls back to `src/data/*` files when these are missing. The **admin portal requires** valid credentials.

## 2. Database

With **Supabase MCP** connected in Cursor, the agent can run `apply_migration` for you (same SQL as the file below).

Apply the migration either in the Supabase **SQL editor** (paste the full file) or locally:

```bash
npm run db:migrate   # needs SUPABASE_DB_URL in .env.local
npm run db:seed
```

File: `supabase/migrations/20260319000000_initial_footprint_schema.sql`

## 3. Storage

The migration creates the `footprint-media` bucket and policies. Confirm it appears under **Storage**.

## 4. Auth admin access

1. Enable Email auth in Supabase Authentication.
2. Sign up via `/admin/login`.
3. Copy your user UUID from **Authentication → Users**.
4. Grant admin (after signup):

```bash
npm run db:grant-admin
```

Or manually in SQL:

```sql
insert into public.admin_users (user_id, email)
values ('YOUR-USER-UUID', 'you@example.com');
```

## 5. Seed sample content (optional)

With credentials set, run:

```bash
npx tsx scripts/seed-from-static.ts
```

## 6. Deploying (Vercel)

1. Push the repo and import it in Vercel (Node 22+; set by `engines` in `package.json`).
2. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `NEXT_PUBLIC_SITE_URL` (your final domain, no trailing slash).
3. Supabase → **Authentication → URL Configuration**: set **Site URL** to your domain and add it to redirect URLs.
4. Supabase → **Authentication → Providers → Email**: turn **off** "Allow new users to sign up" (the login page is sign-in only) and enable **leaked password protection**.
5. Deploy, then sign in at `/admin/login` and add content. Public pages refresh within 15 minutes, or immediately after admin saves.

## 7. Backups

- Use Supabase scheduled backups (Pro) or `pg_dump` against your project.
- Use **Admin → Export** for JSON/CSV downloads of your archive.

## 8. Schema overview

| Table | Purpose |
|-------|---------|
| `journal_entries` | Brain dump; `event_date` vs `recorded_at` |
| `memories` | Timeline milestones |
| `life_periods` / `life_period_items` | Historical "Currently" snapshots |
| `places` / `place_visits` | Travel |
| `collection_items` | Digital shelf |
| `interests` / `interest_highlights` | Interest pages |
| `goals` / `goal_status_events` | Goals with status history |
| `digital_world_items` | Devices & tools |
| `site_profile` | About & site meta |

Row Level Security enforces **public read only for `is_public` content** and **full access for `admin_users`**.

## Admin features

- **Interests**: full CRUD at `/admin/interests`
- **Photos**: attach multiple images to journal entries, memories, and places
- **Journal body**: rich text (TipTap) or Markdown in the editor