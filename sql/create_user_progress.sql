-- User Pattern Progress table
create table if not exists user_pattern_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pattern_id uuid not null references dsa_patterns(id) on delete cascade,
  is_completed boolean not null default false,
  completed_at timestamptz,
  unique(user_id, pattern_id)
);

alter table user_pattern_progress enable row level security;

-- Users can read their own progress
create policy "Users can read own progress"
  on user_pattern_progress for select
  using (auth.uid() = user_id);

-- Users can insert their own progress
create policy "Users can insert own progress"
  on user_pattern_progress for insert
  with check (auth.uid() = user_id);

-- Users can update their own progress
create policy "Users can update own progress"
  on user_pattern_progress for update
  using (auth.uid() = user_id);

-- Users can delete their own progress
create policy "Users can delete own progress"
  on user_pattern_progress for delete
  using (auth.uid() = user_id);
