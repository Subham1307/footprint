-- Footprint: personal archive schema
-- Run via Supabase SQL editor or: supabase db push

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Admin allowlist (must link auth.users after first signup)
-- ---------------------------------------------------------------------------
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users au where au.user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Site profile (single row + version history)
-- ---------------------------------------------------------------------------
create table public.site_profile (
  id uuid primary key default gen_random_uuid(),
  owner_name text not null default 'Subham Dey',
  wordmark text not null default 'SUBHAM.DEY',
  site_name text not null default 'My footprint',
  email text,
  tagline text,
  about_markdown text,
  availability_label text,
  timezone text not null default 'Asia/Kolkata',
  copyright_year smallint not null default 2026,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_profile_versions (
  id uuid primary key default gen_random_uuid(),
  owner_name text not null,
  wordmark text not null,
  site_name text not null,
  email text,
  tagline text,
  about_markdown text,
  availability_label text,
  timezone text not null,
  effective_from date not null,
  effective_to date,
  recorded_at timestamptz not null default now(),
  reason text
);

-- ---------------------------------------------------------------------------
-- Journal
-- ---------------------------------------------------------------------------
create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body_markdown text not null default '',
  category text not null check (category in ('thought', 'idea', 'observation', 'reflection')),
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  is_public boolean not null default true,
  event_date date not null,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.journal_entry_tags (
  journal_entry_id uuid not null references public.journal_entries (id) on delete cascade,
  tag text not null,
  primary key (journal_entry_id, tag)
);

create index idx_journal_event_date on public.journal_entries (event_date desc);
create index idx_journal_status_public on public.journal_entries (status, is_public);

-- ---------------------------------------------------------------------------
-- Media
-- ---------------------------------------------------------------------------
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  bucket text not null default 'footprint-media',
  filename text not null,
  mime_type text,
  size_bytes bigint,
  alt_text text,
  uploaded_at timestamptz not null default now(),
  uploaded_by uuid references auth.users (id)
);

create table public.journal_entry_media (
  journal_entry_id uuid not null references public.journal_entries (id) on delete cascade,
  media_id uuid not null references public.media_assets (id) on delete cascade,
  sort_order int not null default 0,
  primary key (journal_entry_id, media_id)
);

-- ---------------------------------------------------------------------------
-- Memories / timeline
-- ---------------------------------------------------------------------------
create table public.memories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date date not null,
  event_year int generated always as (extract(year from event_date)::int) stored,
  location text,
  category text not null check (category in ('milestone', 'trip', 'memory', 'shift')),
  is_public boolean not null default true,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_memories_event_date on public.memories (event_date desc);

create table public.memory_media (
  memory_id uuid not null references public.memories (id) on delete cascade,
  media_id uuid not null references public.media_assets (id) on delete cascade,
  sort_order int not null default 0,
  primary key (memory_id, media_id)
);

-- ---------------------------------------------------------------------------
-- Life periods ("Currently") — append-only periods, never overwrite history
-- ---------------------------------------------------------------------------
create table public.life_periods (
  id uuid primary key default gen_random_uuid(),
  label text,
  effective_from date not null,
  effective_to date,
  is_current boolean not null default false,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint life_periods_dates check (effective_to is null or effective_to >= effective_from)
);

create unique index one_current_life_period on public.life_periods (is_current) where is_current = true;

create table public.life_period_items (
  id uuid primary key default gen_random_uuid(),
  period_id uuid not null references public.life_periods (id) on delete cascade,
  item_type text not null check (
    item_type in (
      'learning',
      'building',
      'focus',
      'interests',
      'goals',
      'book',
      'movie',
      'show',
      'routine'
    )
  ),
  label text,
  content text not null,
  sort_order int not null default 0
);

create index idx_life_periods_from on public.life_periods (effective_from desc);

-- ---------------------------------------------------------------------------
-- Places
-- ---------------------------------------------------------------------------
create table public.places (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  name text not null,
  region text,
  country text,
  description text,
  mood text,
  gradient_class text,
  place_status text not null check (place_status in ('visited', 'wishlist')),
  is_public boolean not null default true,
  first_visited_date date,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.place_visits (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places (id) on delete cascade,
  visited_from date,
  visited_to date,
  notes text,
  recorded_at timestamptz not null default now()
);

create table public.place_media (
  place_id uuid not null references public.places (id) on delete cascade,
  media_id uuid not null references public.media_assets (id) on delete cascade,
  sort_order int not null default 0,
  primary key (place_id, media_id)
);

-- ---------------------------------------------------------------------------
-- Digital collection
-- ---------------------------------------------------------------------------
create table public.collection_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  item_type text not null check (
    item_type in (
      'website',
      'tool',
      'book',
      'article',
      'music',
      'movie',
      'show',
      'software',
      'gadget',
      'discovery'
    )
  ),
  external_url text,
  personal_rating smallint check (personal_rating between 1 and 5),
  notes text,
  is_public boolean not null default true,
  event_date date,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.collection_item_tags (
  collection_item_id uuid not null references public.collection_items (id) on delete cascade,
  tag text not null,
  primary key (collection_item_id, tag)
);

-- ---------------------------------------------------------------------------
-- Interests
-- ---------------------------------------------------------------------------
create table public.interests (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  tagline text,
  description text,
  icon text not null default 'sparkles',
  gradient_class text,
  accent_color text,
  is_public boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.interest_highlights (
  id uuid primary key default gen_random_uuid(),
  interest_id uuid not null references public.interests (id) on delete cascade,
  content text not null,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- Goals
-- ---------------------------------------------------------------------------
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  goal_type text not null default 'personal' check (goal_type in ('personal', 'professional')),
  status text not null default 'active' check (
    status in ('active', 'completed', 'paused', 'abandoned')
  ),
  target_date date,
  started_on date,
  completed_on date,
  is_public boolean not null default false,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.goal_status_events (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals (id) on delete cascade,
  from_status text,
  to_status text not null,
  note text,
  changed_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Digital world
-- ---------------------------------------------------------------------------
create table public.digital_world_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  detail text,
  category text not null check (category in ('device', 'os', 'software', 'devtool')),
  is_public boolean not null default true,
  valid_from date,
  valid_to date,
  sort_order int not null default 0,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.admin_users enable row level security;
alter table public.site_profile enable row level security;
alter table public.site_profile_versions enable row level security;
alter table public.journal_entries enable row level security;
alter table public.journal_entry_tags enable row level security;
alter table public.media_assets enable row level security;
alter table public.journal_entry_media enable row level security;
alter table public.memories enable row level security;
alter table public.memory_media enable row level security;
alter table public.life_periods enable row level security;
alter table public.life_period_items enable row level security;
alter table public.places enable row level security;
alter table public.place_visits enable row level security;
alter table public.place_media enable row level security;
alter table public.collection_items enable row level security;
alter table public.collection_item_tags enable row level security;
alter table public.interests enable row level security;
alter table public.interest_highlights enable row level security;
alter table public.goals enable row level security;
alter table public.goal_status_events enable row level security;
alter table public.digital_world_items enable row level security;

-- admin_users: only admins can read list
create policy "admins read admin_users" on public.admin_users for select to authenticated using (public.is_admin());

-- Public read policies
create policy "public read site_profile" on public.site_profile for select using (is_public = true);
create policy "admin all site_profile" on public.site_profile for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read profile versions" on public.site_profile_versions for select using (true);
create policy "admin all profile versions" on public.site_profile_versions for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read published journal" on public.journal_entries for select using (
  is_public = true and status = 'published'
);
create policy "admin all journal" on public.journal_entries for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "journal tags public via entry" on public.journal_entry_tags for select using (
  exists (
    select 1 from public.journal_entries je
    where je.id = journal_entry_id
      and ((je.is_public = true and je.status = 'published') or public.is_admin())
  )
);
create policy "admin all journal tags" on public.journal_entry_tags for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "media public when linked public" on public.media_assets for select using (
  public.is_admin()
  or exists (
    select 1 from public.journal_entry_media jem
    join public.journal_entries je on je.id = jem.journal_entry_id
    where jem.media_id = media_assets.id and je.is_public = true and je.status = 'published'
  )
  or exists (
    select 1 from public.memory_media mm
    join public.memories m on m.id = mm.memory_id
    where mm.media_id = media_assets.id and m.is_public = true
  )
  or exists (
    select 1 from public.place_media pm
    join public.places p on p.id = pm.place_id
    where pm.media_id = media_assets.id and p.is_public = true
  )
);
create policy "admin all media" on public.media_assets for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "journal media join" on public.journal_entry_media for select using (public.is_admin() or exists (
  select 1 from public.journal_entries je where je.id = journal_entry_id and je.is_public = true and je.status = 'published'
));
create policy "admin journal media" on public.journal_entry_media for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read memories" on public.memories for select using (is_public = true);
create policy "admin all memories" on public.memories for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "memory media select" on public.memory_media for select using (public.is_admin() or exists (
  select 1 from public.memories m where m.id = memory_id and m.is_public = true
));
create policy "admin memory media" on public.memory_media for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read life periods" on public.life_periods for select using (true);
create policy "admin all life periods" on public.life_periods for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read life items" on public.life_period_items for select using (true);
create policy "admin all life items" on public.life_period_items for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read places" on public.places for select using (is_public = true);
create policy "admin all places" on public.places for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "place visits public" on public.place_visits for select using (
  exists (select 1 from public.places p where p.id = place_id and p.is_public = true) or public.is_admin()
);
create policy "admin place visits" on public.place_visits for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "place media select" on public.place_media for select using (public.is_admin() or exists (
  select 1 from public.places p where p.id = place_id and p.is_public = true
));
create policy "admin place media" on public.place_media for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read collections" on public.collection_items for select using (is_public = true);
create policy "admin all collections" on public.collection_items for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "collection tags public" on public.collection_item_tags for select using (
  exists (select 1 from public.collection_items ci where ci.id = collection_item_id and ci.is_public = true)
  or public.is_admin()
);
create policy "admin collection tags" on public.collection_item_tags for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read interests" on public.interests for select using (is_public = true);
create policy "admin all interests" on public.interests for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "highlights public" on public.interest_highlights for select using (
  exists (select 1 from public.interests i where i.id = interest_id and i.is_public = true) or public.is_admin()
);
create policy "admin highlights" on public.interest_highlights for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read goals" on public.goals for select using (is_public = true);
create policy "admin all goals" on public.goals for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "goal events admin" on public.goal_status_events for select using (
  public.is_admin() or exists (select 1 from public.goals g where g.id = goal_id and g.is_public = true)
);
create policy "admin goal events write" on public.goal_status_events for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read digital world" on public.digital_world_items for select using (is_public = true);
create policy "admin all digital world" on public.digital_world_items for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Storage bucket (run in dashboard or storage API)
insert into storage.buckets (id, name, public)
values ('footprint-media', 'footprint-media', true)
on conflict (id) do nothing;

create policy "public read footprint media files"
on storage.objects for select
using (bucket_id = 'footprint-media');

create policy "admin upload footprint media"
on storage.objects for insert to authenticated
with check (bucket_id = 'footprint-media' and public.is_admin());

create policy "admin update footprint media"
on storage.objects for update to authenticated
using (bucket_id = 'footprint-media' and public.is_admin());

create policy "admin delete footprint media"
on storage.objects for delete to authenticated
using (bucket_id = 'footprint-media' and public.is_admin());

-- API roles (PostgREST / service role seeding)
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on all tables in schema public to postgres, service_role;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;
grant all on all sequences in schema public to postgres, service_role;
grant usage, select on all sequences in schema public to authenticated, anon;
grant execute on all functions in schema public to postgres, anon, authenticated, service_role;