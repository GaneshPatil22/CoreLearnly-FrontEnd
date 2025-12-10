# CoreLearnly Database Schema Reference

> Quick reference for all tables, columns, and relationships
> Use this when building queries, views, or Edge Functions

---

## Tables Overview

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `curriculum_versions` | Content versioning | `version`, `is_active` |
| `course_modules` | Beginner/Advanced/AI grouping | `type`, `curriculum_version_id` |
| `topics` | Subject areas (Arrays, Trees) | `module_id`, `display_order` |
| `lessons` | Individual learning units | `topic_id`, `resources` |
| `assignments` | LeetCode/HR problems | `lesson_id`, `url`, `platform` |
| `batches` | Student groups | `max_seats`, `max_free_seats`, `current_session_id` |
| `sessions` | Live class occurrences | `batch_id`, `session_type`, `zoom_link_encrypted` |
| `session_lessons` | Session-Lesson mapping | `session_id`, `lesson_id` |
| `enrollments` | User-Batch link | `user_id`, `batch_id`, `is_free`, `status` |
| `attendance` | Session join tracking | `enrollment_id`, `session_id`, `device_info` |
| `lesson_progress` | User completion tracking | `user_id`, `lesson_id`, `is_completed` |
| `session_feedback` | Ratings per session | `session_id`, `user_id`, `rating` |
| `audit_logs` | Security audit trail | `action`, `resource_type`, `metadata` |

---

## Detailed Schema

### 1. curriculum_versions

```
┌─────────────────────────────────────────────────────────────┐
│ curriculum_versions                                         │
├─────────────────┬──────────────┬────────────────────────────┤
│ Column          │ Type         │ Notes                      │
├─────────────────┼──────────────┼────────────────────────────┤
│ id              │ UUID (PK)    │ gen_random_uuid()          │
│ version         │ TEXT         │ UNIQUE, e.g., 'v1.0'       │
│ description     │ TEXT         │                            │
│ published_at    │ TIMESTAMPTZ  │                            │
│ is_active       │ BOOLEAN      │ DEFAULT false              │
│ created_at      │ TIMESTAMPTZ  │ DEFAULT now()              │
│ updated_at      │ TIMESTAMPTZ  │ DEFAULT now()              │
└─────────────────┴──────────────┴────────────────────────────┘
```

### 2. course_modules

```
┌─────────────────────────────────────────────────────────────┐
│ course_modules                                              │
├─────────────────────────┬──────────────┬────────────────────┤
│ Column                  │ Type         │ Notes              │
├─────────────────────────┼──────────────┼────────────────────┤
│ id                      │ UUID (PK)    │                    │
│ curriculum_version_id   │ UUID (FK)    │ → curriculum_versions │
│ name                    │ TEXT         │                    │
│ description             │ TEXT         │                    │
│ type                    │ TEXT         │ 'beginner'/'advanced'/'ai' │
│ duration_months         │ INTEGER      │ DEFAULT 2          │
│ display_order           │ INTEGER      │ DEFAULT 0          │
│ created_at              │ TIMESTAMPTZ  │                    │
│ updated_at              │ TIMESTAMPTZ  │                    │
├─────────────────────────┴──────────────┴────────────────────┤
│ UNIQUE: (curriculum_version_id, type)                       │
└─────────────────────────────────────────────────────────────┘
```

### 3. topics

```
┌─────────────────────────────────────────────────────────────┐
│ topics                                                      │
├─────────────────┬──────────────┬────────────────────────────┤
│ Column          │ Type         │ Notes                      │
├─────────────────┼──────────────┼────────────────────────────┤
│ id              │ UUID (PK)    │                            │
│ module_id       │ UUID (FK)    │ → course_modules           │
│ name            │ TEXT         │                            │
│ description     │ TEXT         │                            │
│ icon            │ TEXT         │ Icon identifier for UI     │
│ display_order   │ INTEGER      │ DEFAULT 0                  │
│ created_at      │ TIMESTAMPTZ  │                            │
│ updated_at      │ TIMESTAMPTZ  │                            │
├─────────────────┴──────────────┴────────────────────────────┤
│ UNIQUE: (module_id, display_order)                          │
└─────────────────────────────────────────────────────────────┘
```

### 4. lessons

```
┌─────────────────────────────────────────────────────────────┐
│ lessons                                                     │
├─────────────────┬──────────────┬────────────────────────────┤
│ Column          │ Type         │ Notes                      │
├─────────────────┼──────────────┼────────────────────────────┤
│ id              │ UUID (PK)    │                            │
│ topic_id        │ UUID (FK)    │ → topics                   │
│ title           │ TEXT         │                            │
│ description     │ TEXT         │                            │
│ duration_minutes│ INTEGER      │ DEFAULT 120                │
│ display_order   │ INTEGER      │ DEFAULT 0                  │
│ resources       │ JSONB        │ {"notes":"", "problems":""} │
│ is_active       │ BOOLEAN      │ DEFAULT true               │
│ created_at      │ TIMESTAMPTZ  │                            │
│ updated_at      │ TIMESTAMPTZ  │                            │
├─────────────────┴──────────────┴────────────────────────────┤
│ UNIQUE: (topic_id, display_order)                           │
└─────────────────────────────────────────────────────────────┘
```

### 5. assignments

```
┌─────────────────────────────────────────────────────────────┐
│ assignments                                                 │
├─────────────────┬──────────────┬────────────────────────────┤
│ Column          │ Type         │ Notes                      │
├─────────────────┼──────────────┼────────────────────────────┤
│ id              │ UUID (PK)    │                            │
│ lesson_id       │ UUID (FK)    │ → lessons                  │
│ title           │ TEXT         │                            │
│ description     │ TEXT         │                            │
│ url             │ TEXT         │ External URL               │
│ platform        │ TEXT         │ 'leetcode'/'hackerrank'/etc │
│ difficulty      │ TEXT         │ 'easy'/'medium'/'hard'     │
│ display_order   │ INTEGER      │ DEFAULT 0                  │
│ created_at      │ TIMESTAMPTZ  │                            │
├─────────────────┴──────────────┴────────────────────────────┤
│ UNIQUE: (lesson_id, display_order)                          │
└─────────────────────────────────────────────────────────────┘
```

### 6. batches

```
┌─────────────────────────────────────────────────────────────┐
│ batches                                                     │
├─────────────────────────┬──────────────┬────────────────────┤
│ Column                  │ Type         │ Notes              │
├─────────────────────────┼──────────────┼────────────────────┤
│ id                      │ UUID (PK)    │                    │
│ name                    │ TEXT         │ UNIQUE             │
│ description             │ TEXT         │                    │
│ curriculum_version_id   │ UUID (FK)    │ → curriculum_versions │
│ start_date              │ DATE         │                    │
│ end_date                │ DATE         │                    │
│ max_seats               │ INTEGER      │ DEFAULT 40         │
│ max_free_seats          │ INTEGER      │ DEFAULT 15         │
│ current_session_id      │ UUID (FK)    │ → sessions         │
│ community_type          │ TEXT         │ 'whatsapp'/'discord'/'telegram' │
│ community_link          │ TEXT         │ Invite link        │
│ is_active               │ BOOLEAN      │ DEFAULT true       │
│ created_at              │ TIMESTAMPTZ  │                    │
│ updated_at              │ TIMESTAMPTZ  │                    │
└─────────────────────────┴──────────────┴────────────────────┘
```

### 7. sessions

```
┌─────────────────────────────────────────────────────────────┐
│ sessions                                                    │
├─────────────────────────┬──────────────┬────────────────────┤
│ Column                  │ Type         │ Notes              │
├─────────────────────────┼──────────────┼────────────────────┤
│ id                      │ UUID (PK)    │                    │
│ batch_id                │ UUID (FK)    │ → batches          │
│ title                   │ TEXT         │                    │
│ description             │ TEXT         │                    │
│ scheduled_at            │ TIMESTAMPTZ  │                    │
│ duration_minutes        │ INTEGER      │ DEFAULT 120        │
│ session_type            │ TEXT         │ 'beginner'/'advanced'/'ai' │
│ zoom_link_encrypted     │ TEXT         │ Encrypted URL      │
│ zoom_link_expires_at    │ TIMESTAMPTZ  │                    │
│ is_active               │ BOOLEAN      │ DEFAULT true       │
│ created_at              │ TIMESTAMPTZ  │                    │
│ updated_at              │ TIMESTAMPTZ  │                    │
└─────────────────────────┴──────────────┴────────────────────┘
```

### 8. session_lessons

```
┌─────────────────────────────────────────────────────────────┐
│ session_lessons                                             │
├─────────────────┬──────────────┬────────────────────────────┤
│ Column          │ Type         │ Notes                      │
├─────────────────┼──────────────┼────────────────────────────┤
│ id              │ UUID (PK)    │                            │
│ session_id      │ UUID (FK)    │ → sessions                 │
│ lesson_id       │ UUID (FK)    │ → lessons                  │
│ display_order   │ INTEGER      │ DEFAULT 0                  │
│ created_at      │ TIMESTAMPTZ  │                            │
├─────────────────┴──────────────┴────────────────────────────┤
│ UNIQUE: (session_id, lesson_id)                             │
└─────────────────────────────────────────────────────────────┘
```

### 9. enrollments

```
┌─────────────────────────────────────────────────────────────┐
│ enrollments                                                 │
├─────────────────┬──────────────┬────────────────────────────┤
│ Column          │ Type         │ Notes                      │
├─────────────────┼──────────────┼────────────────────────────┤
│ id              │ UUID (PK)    │                            │
│ user_id         │ UUID (FK)    │ → auth.users               │
│ batch_id        │ UUID (FK)    │ → batches                  │
│ is_free         │ BOOLEAN      │ DEFAULT false              │
│ status          │ TEXT         │ 'active'/'completed'/'cancelled'/'paused' │
│ enrolled_at     │ TIMESTAMPTZ  │ DEFAULT now()              │
│ completed_at    │ TIMESTAMPTZ  │                            │
│ created_at      │ TIMESTAMPTZ  │                            │
│ updated_at      │ TIMESTAMPTZ  │                            │
├─────────────────┴──────────────┴────────────────────────────┤
│ UNIQUE: (user_id, batch_id)                                 │
│ PARTIAL UNIQUE: (user_id) WHERE status = 'active'           │
└─────────────────────────────────────────────────────────────┘
```

### 10. attendance

```
┌─────────────────────────────────────────────────────────────┐
│ attendance                                                  │
├─────────────────┬──────────────┬────────────────────────────┤
│ Column          │ Type         │ Notes                      │
├─────────────────┼──────────────┼────────────────────────────┤
│ id              │ UUID (PK)    │                            │
│ enrollment_id   │ UUID (FK)    │ → enrollments              │
│ session_id      │ UUID (FK)    │ → sessions                 │
│ joined_at       │ TIMESTAMPTZ  │ DEFAULT now()              │
│ left_at         │ TIMESTAMPTZ  │                            │
│ duration_seconds│ INTEGER      │                            │
│ device_info     │ JSONB        │ {"browser":"", "os":""}    │
│ ip_address      │ INET         │                            │
│ join_token      │ TEXT         │ Signed token used          │
│ created_at      │ TIMESTAMPTZ  │                            │
├─────────────────┴──────────────┴────────────────────────────┤
│ UNIQUE: (enrollment_id, session_id)                         │
└─────────────────────────────────────────────────────────────┘
```

### 11. lesson_progress

```
┌─────────────────────────────────────────────────────────────┐
│ lesson_progress                                             │
├─────────────────┬──────────────┬────────────────────────────┤
│ Column          │ Type         │ Notes                      │
├─────────────────┼──────────────┼────────────────────────────┤
│ id              │ UUID (PK)    │                            │
│ user_id         │ UUID (FK)    │ → auth.users               │
│ lesson_id       │ UUID (FK)    │ → lessons                  │
│ is_completed    │ BOOLEAN      │ DEFAULT false              │
│ completed_at    │ TIMESTAMPTZ  │                            │
│ notes           │ TEXT         │ User's personal notes      │
│ created_at      │ TIMESTAMPTZ  │                            │
│ updated_at      │ TIMESTAMPTZ  │                            │
├─────────────────┴──────────────┴────────────────────────────┤
│ UNIQUE: (user_id, lesson_id)                                │
└─────────────────────────────────────────────────────────────┘
```

### 12. session_feedback

```
┌─────────────────────────────────────────────────────────────┐
│ session_feedback                                            │
├─────────────────┬──────────────┬────────────────────────────┤
│ Column          │ Type         │ Notes                      │
├─────────────────┼──────────────┼────────────────────────────┤
│ id              │ UUID (PK)    │                            │
│ session_id      │ UUID (FK)    │ → sessions                 │
│ user_id         │ UUID (FK)    │ → auth.users               │
│ rating          │ INTEGER      │ CHECK 1-5                  │
│ comment         │ TEXT         │                            │
│ is_anonymous    │ BOOLEAN      │ DEFAULT false              │
│ created_at      │ TIMESTAMPTZ  │                            │
├─────────────────┴──────────────┴────────────────────────────┤
│ UNIQUE: (session_id, user_id)                               │
└─────────────────────────────────────────────────────────────┘
```

### 13. audit_logs

```
┌─────────────────────────────────────────────────────────────┐
│ audit_logs                                                  │
├─────────────────┬──────────────┬────────────────────────────┤
│ Column          │ Type         │ Notes                      │
├─────────────────┼──────────────┼────────────────────────────┤
│ id              │ UUID (PK)    │                            │
│ user_id         │ UUID (FK)    │ → auth.users (nullable)    │
│ action          │ TEXT         │ 'session_join', 'enrollment_create' │
│ resource_type   │ TEXT         │ 'session', 'enrollment'    │
│ resource_id     │ UUID         │                            │
│ metadata        │ JSONB        │ Additional context         │
│ ip_address      │ INET         │                            │
│ user_agent      │ TEXT         │                            │
│ created_at      │ TIMESTAMPTZ  │ DEFAULT now()              │
└─────────────────┴──────────────┴────────────────────────────┘
```

---

## Entity Relationships

```
curriculum_versions
        │
        │ 1:N
        ▼
course_modules ──────────────────────────────────┐
        │                                        │
        │ 1:N                                    │
        ▼                                        │
    topics                                       │
        │                                        │
        │ 1:N                                    │
        ▼                                        │
    lessons ◄────────────────────────┐           │
        │                            │           │
        │ 1:N                        │           │
        ▼                            │           │
  assignments                        │           │
                                     │           │
                                     │           │
batches ◄────────────────────────────┼───────────┘
   │                                 │
   │ 1:N                             │
   ▼                                 │
sessions ◄───────────────────────────┤
   │                                 │
   │ 1:N                             │
   ▼                                 │
session_lessons ─────────────────────┘


auth.users
     │
     ├──────────────────┬──────────────────┬─────────────────┐
     │ 1:N              │ 1:N              │ 1:N             │ 1:N
     ▼                  ▼                  ▼                 ▼
enrollments      lesson_progress    session_feedback    audit_logs
     │
     │ 1:N
     ▼
attendance
```

---

## Views

### batch_seat_status

```sql
-- Shows seat availability per batch
SELECT * FROM batch_seat_status;

-- Columns:
-- id, name, max_seats, max_free_seats, is_active,
-- total_enrolled, free_enrolled, seats_available, free_seats_available
```

---

## Key Indexes

| Index | Table | Purpose |
|-------|-------|---------|
| `idx_enrollments_one_active` | enrollments | Only one active enrollment per user |
| `idx_sessions_scheduled` | sessions | Query upcoming sessions |
| `idx_lesson_progress_completed` | lesson_progress | Query completed lessons |
| `idx_attendance_session` | attendance | Query session attendance |

---

## Common Queries

### Get user's enrollment with batch info

```sql
SELECT e.*, b.name as batch_name, b.current_session_id
FROM enrollments e
JOIN batches b ON b.id = e.batch_id
WHERE e.user_id = $1 AND e.status = 'active';
```

### Get lessons for a module (with free tier check)

```sql
SELECT l.*
FROM lessons l
JOIN topics t ON t.id = l.topic_id
JOIN course_modules cm ON cm.id = t.module_id
WHERE cm.id = $module_id
AND l.is_active = true
ORDER BY t.display_order, l.display_order;
```

### Get user's progress percentage per module

```sql
SELECT
    cm.name,
    cm.type,
    COUNT(l.id) as total_lessons,
    COUNT(lp.id) FILTER (WHERE lp.is_completed) as completed,
    ROUND(COUNT(lp.id) FILTER (WHERE lp.is_completed)::numeric / COUNT(l.id) * 100, 1) as percentage
FROM course_modules cm
JOIN topics t ON t.module_id = cm.id
JOIN lessons l ON l.topic_id = t.id AND l.is_active = true
LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = $1
GROUP BY cm.id
ORDER BY cm.display_order;
```

### Get upcoming sessions for a batch

```sql
SELECT s.*,
    CASE WHEN s.zoom_link_encrypted IS NOT NULL THEN true ELSE false END as is_joinable
FROM sessions s
WHERE s.batch_id = $1
AND s.scheduled_at >= now()
AND s.is_active = true
ORDER BY s.scheduled_at
LIMIT 5;
```

### Check batch seat availability

```sql
SELECT
    seats_available > 0 as has_seats,
    free_seats_available > 0 as has_free_seats
FROM batch_seat_status
WHERE id = $batch_id;
```

---

## Seed Data UUIDs

Use these when referencing seed data in queries:

| Entity | ID |
|--------|-----|
| Curriculum v1.0 | `a0000000-0000-0000-0000-000000000001` |
| Beginner Module | `b0000000-0000-0000-0000-000000000001` |
| Advanced Module | `b0000000-0000-0000-0000-000000000002` |
| AI Module | `b0000000-0000-0000-0000-000000000003` |
| January 2025 Batch | `f0000000-0000-0000-0000-000000000001` |
| Arrays Topic | `c0000000-0000-0000-0000-000000000001` |
| Two Pointer Lesson | `d0000000-0000-0000-0000-000000000002` |

---

## RLS Summary

| Table | Public Read | Enrolled Only | Own Records | Free Tier Restricted |
|-------|-------------|---------------|-------------|---------------------|
| curriculum_versions | ✓ (active) | - | - | - |
| course_modules | ✓ | - | - | - |
| topics | ✓ | - | - | - |
| lessons | - | ✓ | - | ✓ |
| assignments | - | ✓ | - | ✓ |
| batches | - | ✓ | - | - |
| sessions | - | ✓ | - | ✓ |
| enrollments | - | - | ✓ | - |
| lesson_progress | - | - | ✓ (CRUD) | - |
| session_feedback | - | - | ✓ (CRUD) | - |
| attendance | - | - | ✓ (read) | - |
| audit_logs | - | - | - | - |
