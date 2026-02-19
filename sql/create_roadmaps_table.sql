-- Roadmaps parent table (supports multiple independent roadmaps)
create table if not exists roadmaps (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text not null default '',
  cover_image_url text,
  icon_name text not null default 'map',
  gradient_from text not null default '#6366f1',
  gradient_to text not null default '#8b5cf6',
  difficulty_level text not null default 'mixed' check (difficulty_level in ('beginner', 'intermediate', 'advanced', 'mixed')),
  estimated_duration text not null default '',
  total_patterns int not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  display_order int not null default 0,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table roadmaps enable row level security;

create policy "Public can read published roadmaps"
  on roadmaps for select
  using (status = 'published');

create policy "Admin full access to roadmaps"
  on roadmaps for all
  using (
    auth.jwt() ->> 'email' = 'ganesh@corelearnly.com'
  );
