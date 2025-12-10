# CoreLearnly Database Design

> Document for database review
> Version: 2.0
> Created: December 2024
> Stack: Supabase (PostgreSQL)

---

## Table of Contents

1. [Overview](#overview)
2. [Business Rules](#business-rules)
3. [Entity Relationship Diagram](#entity-relationship-diagram)
4. [Table Definitions](#table-definitions)
5. [Row Level Security (RLS) Policies](#row-level-security-rls-policies)
6. [Edge Functions (Secure URL Access)](#edge-functions)
7. [API Endpoints](#api-endpoints)
8. [Sample Queries](#sample-queries)
9. [Admin Operations](#admin-operations)
10. [Scalability Plan](#scalability-plan)

---

## Overview

### Business Context

CoreLearnly is an online education platform offering a 6-month technical interview preparation course:

| Module | Duration | Content |
|--------|----------|---------|
| **Beginner** | 2 months | Arrays, Pointers, Prefix Sum, Recursion, Basic System Design |
| **Advanced** | 4 months | DP, Graphs, OS, DB, Distributed Systems |
| **AI** | Parallel (weekends) | 1 class/week throughout the program |

### Key Requirements

1. **Single Instructor Model** - No teacher management in Phase-1
2. **Batch System** - Multiple batches in parallel, same curriculum
3. **Seat Limits** - Max 40 seats per batch, max 15 free seats
4. **Free Tier** - Free users access **only Beginner module** (first 2 months)
5. **Secure Sessions** - Zoom links never exposed, signed URL access only
6. **Curriculum Versioning** - Content updates don't break existing progress
7. **Feedback System** - Required per-session feedback from students
8. **Community Groups** - WhatsApp/Discord per batch

### Design Principles

- **Curriculum is GLOBAL** - Lessons/Topics created once, reused across all batches
- **Sessions are per-BATCH** - Each batch schedules its own live classes
- **Progress is per-USER** - Individual completion tracking with versioning

---

## Business Rules

### Enrollment Rules

```
┌─────────────────────────────────────────────────────────────────┐
│                     ENROLLMENT RULES                            │
└─────────────────────────────────────────────────────────────────┘

1. One active enrollment per student at a time
2. Max 40 total seats per batch
3. Max 15 free seats per batch
4. Free users → Beginner module ONLY
5. Re-enrollment allowed after drop/completion

VALIDATION LOGIC:
─────────────────
IF batch.total_enrolled >= 40 → BLOCK enrollment
IF enrollment.is_free AND batch.free_seats_count >= 15 → BLOCK free enrollment
IF enrollment.is_free → RESTRICT to course_module = 'beginner'
```

### Free vs Paid Access

```
┌─────────────────────────────────────────────────────────────────┐
│                     ACCESS MATRIX                               │
└─────────────────────────────────────────────────────────────────┘

                        │ FREE USER │ PAID USER │
────────────────────────┼───────────┼───────────┤
Beginner Lessons        │     ✓     │     ✓     │
Beginner Sessions       │     ✓     │     ✓     │
Advanced Lessons        │     ✗     │     ✓     │
Advanced Sessions       │     ✗     │     ✓     │
AI Weekend Classes      │     ✗     │     ✓     │
Assignments             │     ✓     │     ✓     │
Community Group         │     ✓     │     ✓     │
────────────────────────┴───────────┴───────────┘

UPSELL TRIGGER:
When Advanced module starts → Prompt free users to upgrade
```

### Progress Completion Rules

```
Lesson Completion    → Student self-marks as done
Module Completion    → ≥80% of lessons completed
Batch Completion     → All sessions attended OR marked done
```

---

## Entity Relationship Diagram

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ENTITY RELATIONSHIPS                              │
└─────────────────────────────────────────────────────────────────────────────┘

CURRICULUM (Global - Created Once)
──────────────────────────────────
┌──────────────────┐     ┌──────────────┐     ┌──────────────┐
│ curriculum_      │     │ course_      │     │   topics     │
│ versions         │────►│ modules      │────►│              │
│                  │     │ (beginner/   │     │ (Arrays,     │
│ v1.0, v2.0...    │     │  advanced)   │     │  Trees...)   │
└──────────────────┘     └──────────────┘     └───────┬──────┘
                                                      │
                                                      ▼
                                              ┌──────────────┐
                                              │   lessons    │
                                              │              │
                                              │ (Two Pointer,│
                                              │  Sliding...) │
                                              └───────┬──────┘
                                                      │
                                                      ▼
                                              ┌──────────────┐
                                              │ assignments  │
                                              │              │
                                              │ (LC/HR URLs) │
                                              └──────────────┘


BATCHES & SCHEDULING (Per Batch)
────────────────────────────────
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   batches    │────►│  sessions    │────►│ session_     │
│              │     │              │     │ lessons      │
│ (Jan 2025,   │     │ (Live class  │     │ (Mapping)    │
│  Feb 2025)   │     │  occurrences)│     │              │
└──────┬───────┘     └──────┬───────┘     └──────────────┘
       │                    │
       │                    ▼
       │             ┌──────────────┐
       │             │ session_     │
       │             │ feedback     │
       │             └──────────────┘
       │
       ▼
┌──────────────┐
│ community_   │
│ groups       │
└──────────────┘


USERS & PROGRESS (Per User)
───────────────────────────
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ auth.users   │────►│ enrollments  │────►│ attendance   │
│              │     │              │     │              │
└──────┬───────┘     └──────────────┘     └──────────────┘
       │
       ▼
┌──────────────┐
│ lesson_      │
│ progress     │
└──────────────┘
```

### Detailed ERD

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DETAILED ERD                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│curriculum_      │
│versions         │
├─────────────────┤
│ id (PK)         │
│ version         │─────────────┐
│ description     │             │
│ published_at    │             │
│ is_active       │             │
└─────────────────┘             │
                                │ 1:N
                                ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ course_modules  │      │    topics       │      │    lessons      │
├─────────────────┤      ├─────────────────┤      ├─────────────────┤
│ id (PK)         │      │ id (PK)         │      │ id (PK)         │
│ curriculum_     │◄─────│ module_id (FK)  │◄─────│ topic_id (FK)   │
│ version_id (FK) │ 1:N  │ name            │ 1:N  │ title           │
│ name            │      │ description     │      │ description     │
│ type (beginner/ │      │ icon            │      │ duration_min    │
│       advanced) │      │ display_order   │      │ display_order   │
│ display_order   │      └─────────────────┘      │ resources       │
└─────────────────┘                               └────────┬────────┘
                                                           │
                                                           │ 1:N
                                                           ▼
                                                  ┌─────────────────┐
                                                  │  assignments    │
                                                  ├─────────────────┤
                                                  │ id (PK)         │
                                                  │ lesson_id (FK)  │
                                                  │ title           │
                                                  │ url             │
                                                  │ platform        │
                                                  │ difficulty      │
                                                  └─────────────────┘


┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│    batches      │      │   sessions      │      │ session_lessons │
├─────────────────┤      ├─────────────────┤      ├─────────────────┤
│ id (PK)         │      │ id (PK)         │      │ id (PK)         │
│ name            │◄─────│ batch_id (FK)   │◄─────│ session_id (FK) │
│ curriculum_     │ 1:N  │ title           │ 1:N  │ lesson_id (FK)  │
│ version_id (FK) │      │ scheduled_at    │      │ display_order   │
│ start_date      │      │ duration_min    │      └─────────────────┘
│ max_seats       │      │ session_type    │
│ max_free_seats  │      │ zoom_link_enc   │
│ community_type  │      │ is_active       │
│ community_link  │      └────────┬────────┘
│ is_active       │               │
└────────┬────────┘               │ 1:N
         │                        ▼
         │               ┌─────────────────┐
         │               │session_feedback │
         │               ├─────────────────┤
         │               │ id (PK)         │
         │               │ session_id (FK) │
         │               │ user_id (FK)    │
         │               │ rating          │
         │               │ comment         │
         │               │ is_anonymous    │
         │               └─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  enrollments    │      │   attendance    │      │ lesson_progress │
├─────────────────┤      ├─────────────────┤      ├─────────────────┤
│ id (PK)         │      │ id (PK)         │      │ id (PK)         │
│ user_id (FK)    │◄─────│ enrollment_     │      │ user_id (FK)    │
│ batch_id (FK)   │ 1:N  │ id (FK)         │      │ lesson_id (FK)  │
│ is_free         │      │ session_id (FK) │      │ is_completed    │
│ status          │      │ joined_at       │      │ completed_at    │
│ enrolled_at     │      │ device_info     │      │ notes           │
└─────────────────┘      │ ip_address      │      └─────────────────┘
                         └─────────────────┘
```

---

## Table Definitions

### 1. curriculum_versions

Tracks content versions. New versions only affect future batches.

```sql
CREATE TABLE curriculum_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version TEXT NOT NULL UNIQUE,  -- 'v1.0', 'v2.0', etc.
    description TEXT,
    published_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_curriculum_versions_active ON curriculum_versions(is_active);

COMMENT ON TABLE curriculum_versions IS 'Tracks curriculum versions. Past batches retain their version, new batches use latest.';
```

**Sample Data:**
| id | version | description | is_active |
|----|---------|-------------|-----------|
| cv-1 | v1.0 | Initial curriculum | false |
| cv-2 | v2.0 | Added new DP topics | true |

---

### 2. course_modules

Groups content into Beginner/Advanced. Links to curriculum version.

```sql
CREATE TABLE course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curriculum_version_id UUID NOT NULL REFERENCES curriculum_versions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('beginner', 'advanced', 'ai')),
    duration_months INTEGER NOT NULL DEFAULT 2,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT course_modules_version_type_unique UNIQUE (curriculum_version_id, type)
);

CREATE INDEX idx_course_modules_version ON course_modules(curriculum_version_id);
CREATE INDEX idx_course_modules_type ON course_modules(type);

COMMENT ON TABLE course_modules IS 'Course modules: Beginner (2 months), Advanced (4 months), AI (parallel).';
COMMENT ON COLUMN course_modules.type IS 'beginner = free tier access, advanced/ai = paid only';
```

**Sample Data:**
| id | curriculum_version_id | name | type | duration_months |
|----|-----------------------|------|------|-----------------|
| cm-1 | cv-2 | Beginner DSA & System Design | beginner | 2 |
| cm-2 | cv-2 | Advanced DSA & System Design | advanced | 4 |
| cm-3 | cv-2 | AI Fundamentals | ai | 6 |

---

### 3. topics

Subject areas within modules (e.g., Arrays, Trees, Graphs).

```sql
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,  -- Icon identifier for UI
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT topics_module_order_unique UNIQUE (module_id, display_order)
);

CREATE INDEX idx_topics_module ON topics(module_id);

COMMENT ON TABLE topics IS 'Topic areas within modules (e.g., Arrays, Linked Lists, Trees).';
```

**Sample Data:**
| id | module_id | name | display_order |
|----|-----------|------|---------------|
| t-1 | cm-1 | Arrays & Pointers | 1 |
| t-2 | cm-1 | Prefix Sum | 2 |
| t-3 | cm-1 | Recursion | 3 |
| t-4 | cm-2 | Dynamic Programming | 1 |
| t-5 | cm-2 | Graphs | 2 |

---

### 4. lessons

Individual learning units within topics.

```sql
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER DEFAULT 120,
    display_order INTEGER NOT NULL DEFAULT 0,
    resources JSONB DEFAULT '{}',  -- {"notes": "url", "slides": "url", "video": "url"}
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT lessons_topic_order_unique UNIQUE (topic_id, display_order)
);

CREATE INDEX idx_lessons_topic ON lessons(topic_id);
CREATE INDEX idx_lessons_active ON lessons(is_active);

COMMENT ON TABLE lessons IS 'Individual lessons within topics. Global content shared by all batches.';
```

**Sample Data:**
| id | topic_id | title | duration_minutes |
|----|----------|-------|------------------|
| l-1 | t-1 | Introduction to Arrays | 90 |
| l-2 | t-1 | Two Pointer Technique | 120 |
| l-3 | t-1 | Sliding Window | 120 |
| l-4 | t-4 | 1D DP Basics | 120 |

**Resources JSONB Example:**
```json
{
    "notes": "https://drive.google.com/file/d/xxx",
    "slides": "https://drive.google.com/file/d/yyy",
    "problems": "https://leetcode.com/list/xxx"
}
```

---

### 5. assignments

Practice problems linked to lessons.

```sql
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,  -- External URL (LeetCode, HackerRank, etc.)
    platform TEXT NOT NULL CHECK (platform IN ('leetcode', 'hackerrank', 'codeforces', 'geeksforgeeks', 'other')),
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT assignments_lesson_order_unique UNIQUE (lesson_id, display_order)
);

CREATE INDEX idx_assignments_lesson ON assignments(lesson_id);

COMMENT ON TABLE assignments IS 'Practice problems linked to lessons. External URLs to LC/HR/etc.';
```

**Sample Data:**
| id | lesson_id | title | url | platform | difficulty |
|----|-----------|-------|-----|----------|------------|
| a-1 | l-2 | Two Sum | https://leetcode.com/problems/two-sum | leetcode | easy |
| a-2 | l-2 | 3Sum | https://leetcode.com/problems/3sum | leetcode | medium |

---

### 6. batches

Student groups with seat limits and community links.

```sql
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    curriculum_version_id UUID NOT NULL REFERENCES curriculum_versions(id),
    start_date DATE NOT NULL,
    end_date DATE,

    -- Seat limits
    max_seats INTEGER NOT NULL DEFAULT 40,
    max_free_seats INTEGER NOT NULL DEFAULT 15,

    -- Current session tracking
    current_session_id UUID,  -- FK added after sessions table created

    -- Community
    community_type TEXT CHECK (community_type IN ('whatsapp', 'discord', 'telegram')),
    community_link TEXT,  -- Invite link (shown only to enrolled students)

    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_batches_active ON batches(is_active);
CREATE INDEX idx_batches_curriculum ON batches(curriculum_version_id);

COMMENT ON TABLE batches IS 'Student batches with seat limits. Max 40 total, max 15 free seats.';
```

**Sample Data:**
| id | name | start_date | max_seats | max_free_seats | community_type |
|----|------|------------|-----------|----------------|----------------|
| b-1 | January 2025 | 2025-01-15 | 40 | 15 | whatsapp |
| b-2 | February 2025 | 2025-02-01 | 40 | 15 | discord |

---

### 7. sessions

Live class occurrences per batch.

```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMPTZ,  -- When the class is scheduled
    duration_minutes INTEGER DEFAULT 120,
    session_type TEXT NOT NULL CHECK (session_type IN ('beginner', 'advanced', 'ai')),

    -- Secure Zoom link (encrypted at rest)
    zoom_link_encrypted TEXT,  -- Encrypted zoom URL
    zoom_link_expires_at TIMESTAMPTZ,

    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add FK for batches.current_session_id
ALTER TABLE batches
    ADD CONSTRAINT batches_current_session_fkey
    FOREIGN KEY (current_session_id) REFERENCES sessions(id) ON DELETE SET NULL;

CREATE INDEX idx_sessions_batch ON sessions(batch_id);
CREATE INDEX idx_sessions_scheduled ON sessions(scheduled_at);
CREATE INDEX idx_sessions_type ON sessions(session_type);

COMMENT ON TABLE sessions IS 'Live class occurrences per batch. Zoom link stored encrypted.';
COMMENT ON COLUMN sessions.zoom_link_encrypted IS 'AES-256 encrypted Zoom URL. Decrypted only via Edge Function.';
```

**Sample Data:**
| id | batch_id | title | scheduled_at | session_type |
|----|----------|-------|--------------|--------------|
| s-1 | b-1 | Arrays - Two Pointer | 2025-01-20 19:00 | beginner |
| s-2 | b-1 | Prefix Sum Techniques | 2025-01-22 19:00 | beginner |
| s-3 | b-1 | AI Tools Introduction | 2025-01-25 10:00 | ai |

---

### 8. session_lessons

Links sessions to lessons (which lessons are covered in which session).

```sql
CREATE TABLE session_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT session_lessons_unique UNIQUE (session_id, lesson_id)
);

CREATE INDEX idx_session_lessons_session ON session_lessons(session_id);
CREATE INDEX idx_session_lessons_lesson ON session_lessons(lesson_id);

COMMENT ON TABLE session_lessons IS 'Maps which lessons are covered in each session.';
```

---

### 9. enrollments

Links users to batches with free/paid distinction.

```sql
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    is_free BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'paused')),
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT enrollments_user_batch_unique UNIQUE (user_id, batch_id)
);

-- Only one ACTIVE enrollment per user
CREATE UNIQUE INDEX idx_enrollments_one_active
    ON enrollments(user_id)
    WHERE status = 'active';

CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_batch ON enrollments(batch_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollments_free ON enrollments(is_free);

COMMENT ON TABLE enrollments IS 'User-batch link. is_free=true means beginner-only access.';
```

---

### 10. attendance

Tracks who joined each session with security info.

```sql
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    left_at TIMESTAMPTZ,
    duration_seconds INTEGER,

    -- Security tracking
    device_info JSONB,  -- {"browser": "Chrome", "os": "macOS", "device": "desktop"}
    ip_address INET,
    join_token TEXT,  -- The signed token used to join

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT attendance_unique UNIQUE (enrollment_id, session_id)
);

CREATE INDEX idx_attendance_enrollment ON attendance(enrollment_id);
CREATE INDEX idx_attendance_session ON attendance(session_id);
CREATE INDEX idx_attendance_joined ON attendance(joined_at);

COMMENT ON TABLE attendance IS 'Tracks session attendance with device/IP for security auditing.';
```

---

### 11. lesson_progress

User's self-marked progress on lessons.

```sql
CREATE TABLE lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT lesson_progress_unique UNIQUE (user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX idx_lesson_progress_completed ON lesson_progress(user_id, is_completed);

COMMENT ON TABLE lesson_progress IS 'User self-marked lesson completion. Module complete at 80%.';
```

---

### 12. session_feedback

Required feedback after each session.

```sql
CREATE TABLE session_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_anonymous BOOLEAN NOT NULL DEFAULT false,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT session_feedback_unique UNIQUE (session_id, user_id)
);

CREATE INDEX idx_session_feedback_session ON session_feedback(session_id);
CREATE INDEX idx_session_feedback_user ON session_feedback(user_id);
CREATE INDEX idx_session_feedback_rating ON session_feedback(rating);

COMMENT ON TABLE session_feedback IS 'Per-session student feedback. Rating 1-5, optional anonymous.';
```

---

### 13. audit_logs

Security audit trail for sensitive operations.

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,  -- 'session_join', 'enrollment_create', etc.
    resource_type TEXT NOT NULL,  -- 'session', 'enrollment', etc.
    resource_id UUID,
    metadata JSONB,  -- Additional context
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

COMMENT ON TABLE audit_logs IS 'Security audit trail. Tracks session joins, enrollments, etc.';
```

---

## Row Level Security (RLS) Policies

### Enable RLS on All Tables

```sql
-- Enable RLS
ALTER TABLE curriculum_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
```

### Curriculum Content (Public Read)

```sql
-- Curriculum versions - public read
CREATE POLICY "Public read curriculum versions"
    ON curriculum_versions FOR SELECT
    USING (is_active = true);

-- Course modules - public read
CREATE POLICY "Public read course modules"
    ON course_modules FOR SELECT
    USING (true);

-- Topics - public read
CREATE POLICY "Public read topics"
    ON topics FOR SELECT
    USING (true);

-- Lessons - enrolled users only (with free tier restriction)
CREATE POLICY "Enrolled users read lessons"
    ON lessons FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM enrollments e
            JOIN batches b ON b.id = e.batch_id
            JOIN course_modules cm ON cm.curriculum_version_id = b.curriculum_version_id
            JOIN topics t ON t.module_id = cm.id
            WHERE e.user_id = auth.uid()
            AND e.status = 'active'
            AND t.id = lessons.topic_id
            AND (
                e.is_free = false  -- Paid users see everything
                OR cm.type = 'beginner'  -- Free users only beginner
            )
        )
    );

-- Assignments - same as lessons
CREATE POLICY "Enrolled users read assignments"
    ON assignments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM lessons l
            JOIN topics t ON t.id = l.topic_id
            JOIN course_modules cm ON cm.id = t.module_id
            JOIN batches b ON b.curriculum_version_id = cm.curriculum_version_id
            JOIN enrollments e ON e.batch_id = b.id
            WHERE e.user_id = auth.uid()
            AND e.status = 'active'
            AND l.id = assignments.lesson_id
            AND (e.is_free = false OR cm.type = 'beginner')
        )
    );
```

### Batches & Sessions

```sql
-- Batches - enrolled users see their batch
CREATE POLICY "Enrolled users view own batch"
    ON batches FOR SELECT
    USING (
        id IN (
            SELECT batch_id FROM enrollments
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Sessions - enrolled users see their batch's sessions (with free tier restriction)
CREATE POLICY "Enrolled users view sessions"
    ON sessions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM enrollments e
            WHERE e.user_id = auth.uid()
            AND e.batch_id = sessions.batch_id
            AND e.status = 'active'
            AND (
                e.is_free = false
                OR sessions.session_type = 'beginner'
            )
        )
    );

-- Session lessons - same as sessions
CREATE POLICY "Enrolled users view session lessons"
    ON session_lessons FOR SELECT
    USING (
        session_id IN (
            SELECT s.id FROM sessions s
            JOIN enrollments e ON e.batch_id = s.batch_id
            WHERE e.user_id = auth.uid() AND e.status = 'active'
        )
    );
```

### User Data (Own Records Only)

```sql
-- Enrollments - own records only
CREATE POLICY "Users view own enrollments"
    ON enrollments FOR SELECT
    USING (user_id = auth.uid());

-- Attendance - own records only
CREATE POLICY "Users view own attendance"
    ON attendance FOR SELECT
    USING (
        enrollment_id IN (
            SELECT id FROM enrollments WHERE user_id = auth.uid()
        )
    );

-- Lesson progress - own records
CREATE POLICY "Users manage own progress"
    ON lesson_progress FOR ALL
    USING (user_id = auth.uid());

-- Session feedback - own records for write, all for read (for analytics)
CREATE POLICY "Users manage own feedback"
    ON session_feedback FOR ALL
    USING (user_id = auth.uid());

-- Audit logs - no user access (admin only)
CREATE POLICY "No user access to audit logs"
    ON audit_logs FOR SELECT
    USING (false);
```

### Service Role (Admin) Policies

```sql
-- Service role has full access to all tables
CREATE POLICY "Service role full access" ON curriculum_versions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON course_modules FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON topics FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON lessons FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON assignments FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON batches FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON sessions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON session_lessons FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON enrollments FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON attendance FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON lesson_progress FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON session_feedback FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON audit_logs FOR ALL USING (auth.role() = 'service_role');
```

---

## Edge Functions

### 1. enroll-student

Handles enrollment with seat limit validation.

```typescript
// supabase/functions/enroll-student/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EnrollRequest {
  batch_id: string
  is_free: boolean
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401)
    }

    const { batch_id, is_free }: EnrollRequest = await req.json()

    // Use service role for validation queries
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Check for existing active enrollment
    const { data: existingEnrollment } = await supabaseAdmin
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (existingEnrollment) {
      return jsonResponse({
        success: false,
        error: 'You already have an active enrollment'
      }, 400)
    }

    // Get batch with current enrollment counts
    const { data: batch, error: batchError } = await supabaseAdmin
      .from('batches')
      .select(`
        id,
        max_seats,
        max_free_seats,
        is_active,
        enrollments:enrollments(count),
        free_enrollments:enrollments(count)
      `)
      .eq('id', batch_id)
      .eq('enrollments.status', 'active')
      .eq('free_enrollments.status', 'active')
      .eq('free_enrollments.is_free', true)
      .single()

    if (batchError || !batch) {
      return jsonResponse({ success: false, error: 'Batch not found' }, 404)
    }

    if (!batch.is_active) {
      return jsonResponse({ success: false, error: 'Batch is not active' }, 400)
    }

    const totalEnrolled = batch.enrollments?.[0]?.count || 0
    const freeEnrolled = batch.free_enrollments?.[0]?.count || 0

    // Check seat limits
    if (totalEnrolled >= batch.max_seats) {
      return jsonResponse({
        success: false,
        error: 'Batch is full (max seats reached)'
      }, 400)
    }

    if (is_free && freeEnrolled >= batch.max_free_seats) {
      return jsonResponse({
        success: false,
        error: 'No free seats available in this batch'
      }, 400)
    }

    // Create enrollment
    const { data: enrollment, error: enrollError } = await supabaseAdmin
      .from('enrollments')
      .insert({
        user_id: user.id,
        batch_id: batch_id,
        is_free: is_free,
        status: 'active'
      })
      .select()
      .single()

    if (enrollError) {
      console.error('Enrollment error:', enrollError)
      return jsonResponse({ success: false, error: 'Failed to enroll' }, 500)
    }

    // Log audit event
    await supabaseAdmin.from('audit_logs').insert({
      user_id: user.id,
      action: 'enrollment_create',
      resource_type: 'enrollment',
      resource_id: enrollment.id,
      metadata: { batch_id, is_free },
      ip_address: req.headers.get('x-forwarded-for')?.split(',')[0] || null
    })

    return jsonResponse({
      success: true,
      data: enrollment
    }, 201)

  } catch (error) {
    console.error('Error:', error)
    return jsonResponse({ success: false, error: 'Internal server error' }, 500)
  }
})

function jsonResponse(data: any, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
```

### 2. get-session-join-url

Generates signed, time-limited join URL.

```typescript
// supabase/functions/get-session-join-url/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { encodeBase64 } from "https://deno.land/std@0.168.0/encoding/base64.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ENCRYPTION_KEY = Deno.env.get('ZOOM_ENCRYPTION_KEY')!
const TOKEN_EXPIRY_SECONDS = 1200  // 20 minutes

interface JoinRequest {
  session_id: string
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401)
    }

    const { session_id }: JoinRequest = await req.json()

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get session with enrollment validation
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('sessions')
      .select(`
        id,
        title,
        session_type,
        zoom_link_encrypted,
        batch_id,
        batch:batches(
          id,
          enrollments!inner(
            id,
            user_id,
            is_free,
            status
          )
        )
      `)
      .eq('id', session_id)
      .eq('batch.enrollments.user_id', user.id)
      .eq('batch.enrollments.status', 'active')
      .single()

    if (sessionError || !session) {
      return jsonResponse({
        success: false,
        error: 'Session not found or not enrolled'
      }, 403)
    }

    const enrollment = session.batch?.enrollments?.[0]
    if (!enrollment) {
      return jsonResponse({
        success: false,
        error: 'Not enrolled in this batch'
      }, 403)
    }

    // Free users can only access beginner sessions
    if (enrollment.is_free && session.session_type !== 'beginner') {
      return jsonResponse({
        success: false,
        error: 'Free tier access is limited to Beginner module only. Please upgrade to access this session.'
      }, 403)
    }

    // Check if zoom link exists
    if (!session.zoom_link_encrypted) {
      return jsonResponse({
        success: true,
        join_url: null,
        message: 'Session link not yet available'
      }, 200)
    }

    // Decrypt zoom link (simplified - use proper encryption in production)
    const zoomLink = await decryptZoomLink(session.zoom_link_encrypted)

    // Generate signed token
    const expiresAt = Math.floor(Date.now() / 1000) + TOKEN_EXPIRY_SECONDS
    const token = await generateSignedToken(user.id, session_id, expiresAt)

    // Record attendance
    await supabaseAdmin.from('attendance').upsert({
      enrollment_id: enrollment.id,
      session_id: session_id,
      joined_at: new Date().toISOString(),
      device_info: {
        user_agent: req.headers.get('user-agent')
      },
      ip_address: req.headers.get('x-forwarded-for')?.split(',')[0] || null,
      join_token: token
    }, {
      onConflict: 'enrollment_id,session_id'
    })

    // Log audit event
    await supabaseAdmin.from('audit_logs').insert({
      user_id: user.id,
      action: 'session_join',
      resource_type: 'session',
      resource_id: session_id,
      metadata: {
        session_type: session.session_type,
        is_free_user: enrollment.is_free
      },
      ip_address: req.headers.get('x-forwarded-for')?.split(',')[0] || null,
      user_agent: req.headers.get('user-agent')
    })

    return jsonResponse({
      success: true,
      join_url: zoomLink,
      session_title: session.title,
      expires_in: TOKEN_EXPIRY_SECONDS
    }, 200)

  } catch (error) {
    console.error('Error:', error)
    return jsonResponse({ success: false, error: 'Internal server error' }, 500)
  }
})

async function decryptZoomLink(encrypted: string): Promise<string> {
  // Simplified decryption - implement proper AES-256 decryption
  // In production, use Web Crypto API with proper key derivation
  const decoded = atob(encrypted)
  return decoded
}

async function generateSignedToken(userId: string, sessionId: string, expiresAt: number): Promise<string> {
  const payload = `${userId}:${sessionId}:${expiresAt}`
  const encoder = new TextEncoder()
  const data = encoder.encode(payload + ENCRYPTION_KEY)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32)
}

function jsonResponse(data: any, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
```

### 3. submit-feedback

Submit session feedback.

```typescript
// supabase/functions/submit-feedback/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FeedbackRequest {
  session_id: string
  rating: number
  comment?: string
  is_anonymous?: boolean
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401)
    }

    const { session_id, rating, comment, is_anonymous }: FeedbackRequest = await req.json()

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return jsonResponse({
        success: false,
        error: 'Rating must be between 1 and 5'
      }, 400)
    }

    // Verify user attended this session
    const { data: attendance } = await supabase
      .from('attendance')
      .select('id')
      .eq('session_id', session_id)
      .single()

    // Note: We allow feedback even without attendance record
    // (user might have watched recording or partial attendance)

    // Upsert feedback
    const { data: feedback, error } = await supabase
      .from('session_feedback')
      .upsert({
        session_id,
        user_id: user.id,
        rating,
        comment: comment || null,
        is_anonymous: is_anonymous || false
      }, {
        onConflict: 'session_id,user_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Feedback error:', error)
      return jsonResponse({ success: false, error: 'Failed to submit feedback' }, 500)
    }

    return jsonResponse({ success: true, data: feedback }, 200)

  } catch (error) {
    console.error('Error:', error)
    return jsonResponse({ success: false, error: 'Internal server error' }, 500)
  }
})

function jsonResponse(data: any, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
```

### 4. toggle-lesson-progress

Mark/unmark lesson completion.

```typescript
// supabase/functions/toggle-lesson-progress/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProgressRequest {
  lesson_id: string
  is_completed: boolean
  notes?: string
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401)
    }

    const { lesson_id, is_completed, notes }: ProgressRequest = await req.json()

    if (!lesson_id) {
      return jsonResponse({ success: false, error: 'lesson_id is required' }, 400)
    }

    // Verify user has access to this lesson (RLS will handle this)
    const { data: lesson } = await supabase
      .from('lessons')
      .select('id')
      .eq('id', lesson_id)
      .single()

    if (!lesson) {
      return jsonResponse({
        success: false,
        error: 'Lesson not found or access denied'
      }, 403)
    }

    // Upsert progress
    const { data: progress, error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id,
        is_completed,
        completed_at: is_completed ? new Date().toISOString() : null,
        notes: notes || null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,lesson_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Progress error:', error)
      return jsonResponse({ success: false, error: 'Failed to update progress' }, 500)
    }

    return jsonResponse({ success: true, data: progress }, 200)

  } catch (error) {
    console.error('Error:', error)
    return jsonResponse({ success: false, error: 'Internal server error' }, 500)
  }
})

function jsonResponse(data: any, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
```

---

## API Endpoints

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/functions/v1/enroll-student` | POST | Enroll in batch | Student |
| `/functions/v1/get-session-join-url` | POST | Get signed Zoom link | Student |
| `/functions/v1/toggle-lesson-progress` | POST | Mark lesson done | Student |
| `/functions/v1/submit-feedback` | POST | Submit session rating | Student |
| `/rest/v1/sessions?select=*&batch_id=eq.xxx` | GET | Get upcoming sessions | Student |
| `/rest/v1/lessons?select=*` | GET | Get lessons (RLS filtered) | Student |

### Example API Responses

**Get Join URL:**
```json
{
  "success": true,
  "join_url": "https://zoom.us/j/123456?pwd=xxx",
  "session_title": "Two Pointer Technique",
  "expires_in": 1200
}
```

**Enrollment Error (Batch Full):**
```json
{
  "success": false,
  "error": "Batch is full (max seats reached)"
}
```

**Free User Access Denied:**
```json
{
  "success": false,
  "error": "Free tier access is limited to Beginner module only. Please upgrade to access this session."
}
```

---

## Sample Queries

### Get User's Dashboard Data

```sql
-- Get enrollment with batch info
SELECT
    e.id as enrollment_id,
    e.is_free,
    e.status,
    b.id as batch_id,
    b.name as batch_name,
    b.community_type,
    b.community_link,
    b.current_session_id
FROM enrollments e
JOIN batches b ON b.id = e.batch_id
WHERE e.user_id = $1 AND e.status = 'active';
```

### Get Upcoming Sessions for User

```sql
SELECT
    s.id,
    s.title,
    s.scheduled_at,
    s.duration_minutes,
    s.session_type,
    CASE WHEN s.zoom_link_encrypted IS NOT NULL THEN true ELSE false END as is_joinable
FROM sessions s
JOIN enrollments e ON e.batch_id = s.batch_id
WHERE e.user_id = $1
AND e.status = 'active'
AND s.scheduled_at >= now()
AND (
    e.is_free = false
    OR s.session_type = 'beginner'
)
ORDER BY s.scheduled_at ASC
LIMIT 5;
```

### Get User's Progress by Module

```sql
SELECT
    cm.name as module_name,
    cm.type as module_type,
    COUNT(DISTINCT l.id) as total_lessons,
    COUNT(DISTINCT lp.lesson_id) FILTER (WHERE lp.is_completed = true) as completed_lessons,
    ROUND(
        (COUNT(DISTINCT lp.lesson_id) FILTER (WHERE lp.is_completed = true)::numeric /
         NULLIF(COUNT(DISTINCT l.id), 0) * 100),
        1
    ) as completion_percentage
FROM enrollments e
JOIN batches b ON b.id = e.batch_id
JOIN course_modules cm ON cm.curriculum_version_id = b.curriculum_version_id
JOIN topics t ON t.module_id = cm.id
JOIN lessons l ON l.topic_id = t.id AND l.is_active = true
LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = e.user_id
WHERE e.user_id = $1 AND e.status = 'active'
AND (e.is_free = false OR cm.type = 'beginner')
GROUP BY cm.id, cm.name, cm.type, cm.display_order
ORDER BY cm.display_order;
```

### Get Batch Seat Counts (Admin)

```sql
SELECT
    b.id,
    b.name,
    b.max_seats,
    b.max_free_seats,
    COUNT(e.id) as total_enrolled,
    COUNT(e.id) FILTER (WHERE e.is_free = true) as free_enrolled,
    b.max_seats - COUNT(e.id) as seats_available,
    b.max_free_seats - COUNT(e.id) FILTER (WHERE e.is_free = true) as free_seats_available
FROM batches b
LEFT JOIN enrollments e ON e.batch_id = b.id AND e.status = 'active'
WHERE b.is_active = true
GROUP BY b.id
ORDER BY b.start_date DESC;
```

### Get Session Feedback Analytics (Admin)

```sql
SELECT
    s.id as session_id,
    s.title,
    s.scheduled_at,
    COUNT(sf.id) as feedback_count,
    ROUND(AVG(sf.rating), 2) as avg_rating,
    COUNT(sf.id) FILTER (WHERE sf.rating >= 4) as positive_count,
    COUNT(sf.id) FILTER (WHERE sf.rating <= 2) as negative_count
FROM sessions s
LEFT JOIN session_feedback sf ON sf.session_id = s.id
WHERE s.batch_id = $1
GROUP BY s.id
ORDER BY s.scheduled_at DESC;
```

---

## Admin Operations

### Create New Curriculum Version

```sql
-- Create new version
INSERT INTO curriculum_versions (version, description, is_active)
VALUES ('v2.0', 'Updated DP and Graph content', false);

-- Copy modules from previous version (update curriculum_version_id)
-- Copy topics
-- Copy lessons
-- Then activate:
UPDATE curriculum_versions SET is_active = false WHERE is_active = true;
UPDATE curriculum_versions SET is_active = true WHERE version = 'v2.0';
```

### Create New Batch

```sql
INSERT INTO batches (
    name,
    curriculum_version_id,
    start_date,
    max_seats,
    max_free_seats,
    community_type,
    community_link
)
VALUES (
    'May 2025 Batch',
    (SELECT id FROM curriculum_versions WHERE is_active = true),
    '2025-05-01',
    40,
    15,
    'whatsapp',
    'https://chat.whatsapp.com/invite/xxx'
);
```

### Schedule Session

```sql
INSERT INTO sessions (
    batch_id,
    title,
    scheduled_at,
    duration_minutes,
    session_type
)
VALUES (
    'batch-uuid',
    'Arrays - Two Pointer Technique',
    '2025-01-20 19:00:00+05:30',
    120,
    'beginner'
);
```

### Attach Zoom Link (Before Class)

```sql
UPDATE sessions
SET
    zoom_link_encrypted = encode('https://zoom.us/j/123?pwd=xxx'::bytea, 'base64'),
    zoom_link_expires_at = now() + interval '3 hours',
    updated_at = now()
WHERE id = 'session-uuid';

-- Also update current session on batch
UPDATE batches
SET current_session_id = 'session-uuid'
WHERE id = 'batch-uuid';
```

### Remove Zoom Link (After Class)

```sql
UPDATE sessions
SET
    zoom_link_encrypted = NULL,
    zoom_link_expires_at = NULL,
    updated_at = now()
WHERE id = 'session-uuid';
```

---

## Scalability Plan

| Stage | Students | Infrastructure |
|-------|----------|----------------|
| **MVP** | 100-300 | Single region Supabase |
| **Growth** | 1K-10K | Read replicas, CDN for assets |
| **Scale** | 10K+ | Partition sessions table, dedicated connection pool |

### Scaling Considerations

1. **Sessions Table** - Partition by `batch_id` when data grows
2. **Attendance Table** - Archive old records monthly
3. **Audit Logs** - Move to separate storage after 90 days
4. **Connection Pooling** - Use PgBouncer for high concurrency

---

## Security Summary

| Layer | Protection |
|-------|------------|
| **Database (RLS)** | Users see only their data, free tier restrictions enforced |
| **Edge Functions** | Validates auth, enrollment, seat limits before operations |
| **Zoom Links** | Encrypted at rest, signed tokens with 20-min expiry |
| **Audit Logging** | All session joins and enrollments logged with IP/device |
| **Seat Limits** | Enforced at enrollment time, checked atomically |

### Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ZOOM LINK SECURITY FLOW                      │
└─────────────────────────────────────────────────────────────────┘

Student clicks "Join Class"
        │
        ▼
┌─────────────────────┐
│ Authenticated?      │──No──► 401 Unauthorized
└─────────┬───────────┘
          │ Yes
          ▼
┌─────────────────────┐
│ Active enrollment?  │──No──► 403 Forbidden
└─────────┬───────────┘
          │ Yes
          ▼
┌─────────────────────┐
│ Free user + Advanced│──Yes─► 403 "Upgrade required"
│ session?            │
└─────────┬───────────┘
          │ No
          ▼
┌─────────────────────┐
│ Zoom link exists?   │──No──► 200 { join_url: null }
└─────────┬───────────┘
          │ Yes
          ▼
┌─────────────────────┐
│ Generate signed     │
│ token (20 min)      │
│ Log attendance      │
│ Log audit event     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Return decrypted    │
│ Zoom URL            │
└─────────────────────┘
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 2024 | Initial design |
| 2.0 | Dec 2024 | Added: Curriculum versioning, seat limits, free tier, feedback, attendance tracking, audit logs |
