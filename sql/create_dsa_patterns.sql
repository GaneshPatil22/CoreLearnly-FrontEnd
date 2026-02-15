-- DSA Patterns table (mirrors blog_posts structure)
create table if not exists dsa_patterns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text not null default '',
  category text not null,
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  when_to_use text not null default '',
  template_code text not null default '',
  template_language text not null default 'javascript',
  time_complexity text not null default '',
  space_complexity text not null default '',
  example_problems text[] not null default '{}',
  content jsonb not null default '{"type":"doc","content":[{"type":"paragraph"}]}',
  cover_image_url text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  access_level text not null default 'free' check (access_level in ('free', 'preview', 'full')),
  display_order int not null default 0,
  read_time_minutes int not null default 1,
  author_name text not null default 'Ganesh Patil',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS policies
alter table dsa_patterns enable row level security;

-- Public can read published patterns
create policy "Public can read published patterns"
  on dsa_patterns for select
  using (status = 'published');

-- Admin full access (matched by email)
create policy "Admin full access to patterns"
  on dsa_patterns for all
  using (
    auth.jwt() ->> 'email' = 'ganesh@corelearnly.com'
  );
