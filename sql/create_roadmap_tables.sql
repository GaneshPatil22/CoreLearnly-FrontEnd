-- Roadmap Phases table
create table if not exists roadmap_phases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text not null default '',
  phase_level text not null default 'beginner' check (phase_level in ('beginner', 'intermediate', 'advanced')),
  display_order int not null default 0,
  icon_name text not null default 'book',
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table roadmap_phases enable row level security;

create policy "Public can read published phases"
  on roadmap_phases for select
  using (status = 'published');

create policy "Admin full access to phases"
  on roadmap_phases for all
  using (
    auth.jwt() ->> 'email' = 'ganesh@corelearnly.com'
  );

-- Roadmap Nodes table
create table if not exists roadmap_nodes (
  id uuid primary key default gen_random_uuid(),
  phase_id uuid not null references roadmap_phases(id) on delete cascade,
  title text not null,
  slug text unique not null,
  description text not null default '',
  display_order int not null default 0,
  pattern_ids uuid[] not null default '{}',
  access_level text not null default 'free' check (access_level in ('free', 'preview', 'full')),
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table roadmap_nodes enable row level security;

create policy "Public can read published nodes"
  on roadmap_nodes for select
  using (status = 'published');

create policy "Admin full access to nodes"
  on roadmap_nodes for all
  using (
    auth.jwt() ->> 'email' = 'ganesh@corelearnly.com'
  );
