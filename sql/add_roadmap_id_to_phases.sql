-- Step 1: Insert a default roadmap for existing data
insert into roadmaps (title, slug, description, icon_name, gradient_from, gradient_to, difficulty_level, estimated_duration, status, display_order, is_featured)
values (
  'DSA Interview Prep',
  'dsa-interview-prep',
  'Follow a structured path from fundamentals to advanced DSA patterns. Each phase builds on the previous one.',
  'rocket',
  '#6366f1',
  '#8b5cf6',
  'mixed',
  '3-6 months',
  'published',
  1,
  true
);

-- Step 2: Add roadmap_id column (nullable first)
alter table roadmap_phases add column roadmap_id uuid;

-- Step 3: Backfill existing phases with the default roadmap
update roadmap_phases
set roadmap_id = (select id from roadmaps where slug = 'dsa-interview-prep' limit 1);

-- Step 4: Make roadmap_id NOT NULL + add foreign key
alter table roadmap_phases
  alter column roadmap_id set not null,
  add constraint fk_roadmap_phases_roadmap
    foreign key (roadmap_id) references roadmaps(id) on delete cascade;

-- Step 5: Drop the old global unique constraint on slug
alter table roadmap_phases drop constraint if exists roadmap_phases_slug_key;

-- Step 6: Add composite unique constraint (roadmap_id, slug)
alter table roadmap_phases add constraint roadmap_phases_roadmap_slug_unique unique (roadmap_id, slug);

-- Step 7: Update the total_patterns count for the default roadmap
update roadmaps
set total_patterns = (
  select coalesce(sum(array_length(rn.pattern_ids, 1)), 0)
  from roadmap_nodes rn
  join roadmap_phases rp on rn.phase_id = rp.id
  where rp.roadmap_id = roadmaps.id
)
where slug = 'dsa-interview-prep';
