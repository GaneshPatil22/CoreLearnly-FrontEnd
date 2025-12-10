# Student Dashboard - Planning Document

> Planning document for student dashboard implementation
> Status: PLANNING PHASE
> Created: December 2024

---

## Requirements Summary

### Core Features

1. **Classes List** - Organized by topic/module (not dates)
2. **Completion Tracking** - User can mark classes as completed
3. **Upcoming Class** - Single highlighted next session with Join button
4. **Secure Join** - Only logged-in enrolled users can join
5. **No Recordings** - Remove all recording mentions (for now)

### Design Decisions

| Decision | Choice |
|----------|--------|
| Batch Model | Single batch enrollment (student sees only their batch) |
| Organization | By topic/module (Arrays, Linked Lists, Trees, etc.) |
| Class Details | Detailed (Title + Status + Description + Duration + Resources) |
| Upcoming Display | Single next class highlighted prominently |

---

## Data Model Design

### Entity Relationship

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   USERS     │       │   BATCHES   │       │   MODULES   │
│  (Supabase  │       │             │       │             │
│    Auth)    │       │ - name      │       │ - name      │
│             │       │ - start_date│       │ - order     │
│             │       │ - is_active │       │ - subject   │
└──────┬──────┘       └──────┬──────┘       └──────┬──────┘
       │                     │                     │
       │    ┌────────────────┴────────────────┐    │
       │    │                                 │    │
       ▼    ▼                                 ▼    ▼
┌─────────────────┐                   ┌─────────────────┐
│   ENROLLMENTS   │                   │    SESSIONS     │
│                 │                   │                 │
│ - user_id (FK)  │                   │ - batch_id (FK) │
│ - batch_id (FK) │                   │ - module_id (FK)│
│ - status        │                   │ - title         │
│ - enrolled_at   │                   │ - description   │
└────────┬────────┘                   │ - duration_min  │
         │                            │ - order         │
         │                            │ - join_url      │
         │                            │ - is_upcoming   │
         │                            │ - resources     │
         │                            └────────┬────────┘
         │                                     │
         │         ┌───────────────────────────┘
         │         │
         ▼         ▼
    ┌─────────────────┐
    │ USER_PROGRESS   │
    │                 │
    │ - user_id (FK)  │
    │ - session_id(FK)│
    │ - is_completed  │
    │ - completed_at  │
    │ - notes (opt)   │
    └─────────────────┘
```

### Tables

#### 1. batches

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | "January 2025 Batch" |
| start_date | date | Batch start date |
| end_date | date | Optional end date |
| is_active | boolean | Currently active batch |
| created_at | timestamptz | Creation timestamp |

#### 2. modules

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | "Arrays & Strings", "Linked Lists" |
| description | text | Module overview |
| subject | text | 'dsa', 'lld', 'hld', 'ai' |
| display_order | int | Sort order (1, 2, 3...) |
| icon | text | Optional icon name |
| created_at | timestamptz | Creation timestamp |

#### 3. sessions

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| batch_id | uuid | FK to batches |
| module_id | uuid | FK to modules |
| title | text | "Two Pointer Technique" |
| description | text | What will be covered |
| duration_minutes | int | Expected duration (90, 120, etc.) |
| display_order | int | Order within module |
| join_url | text | Zoom/Meet link (NULL = not joinable) |
| is_upcoming | boolean | Mark as current upcoming class |
| resources | jsonb | Links, notes, materials |
| created_at | timestamptz | Creation timestamp |

**Note on `join_url`**:
- When NULL → Join button is disabled/faded
- When has value → Join button is active
- Only admin can set this value
- Security: URL only returned if user is logged in + enrolled

#### 4. enrollments

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to auth.users |
| batch_id | uuid | FK to batches |
| status | text | 'active', 'completed', 'cancelled' |
| enrolled_at | timestamptz | When enrolled |

#### 5. user_progress

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to auth.users |
| session_id | uuid | FK to sessions |
| is_completed | boolean | User marked as done |
| completed_at | timestamptz | When marked complete |
| notes | text | Optional user notes |

---

## Dashboard UI Design

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER                                                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ CoreLearnly          [Batch: Jan 2025]     [User] [Logout]│  │
│  └───────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  UPCOMING CLASS (Highlighted Card)                        │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  🟢 Next Class                                      │  │  │
│  │  │                                                     │  │  │
│  │  │  Two Pointer Technique                              │  │  │
│  │  │  Module: Arrays & Strings                           │  │  │
│  │  │  Duration: ~2 hours                                 │  │  │
│  │  │                                                     │  │  │
│  │  │  Learn how to solve problems using two pointers...  │  │  │
│  │  │                                                     │  │  │
│  │  │  [Join Class] ← Active when URL available           │  │  │
│  │  │               ← Faded/disabled when no URL          │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  PROGRESS OVERVIEW                                        │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │  │
│  │  │ DSA      │ │ LLD      │ │ HLD      │ │ AI       │     │  │
│  │  │ 12/40    │ │ 0/15     │ │ 0/12     │ │ 2/8      │     │  │
│  │  │ ████░░░░ │ │ ░░░░░░░░ │ │ ░░░░░░░░ │ │ ██░░░░░░ │     │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  CLASSES BY MODULE                                        │  │
│  │                                                           │  │
│  │  ▼ Arrays & Strings (5 classes)              [3/5 done]  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ ✓ Introduction to Arrays         90 min    [Done]   │  │  │
│  │  │ ✓ Array Manipulation             120 min   [Done]   │  │  │
│  │  │ ✓ String Basics                  90 min    [Done]   │  │  │
│  │  │ ○ Two Pointer Technique          120 min   [Mark]   │  │  │
│  │  │ ○ Sliding Window                 120 min   [Mark]   │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  ▶ Linked Lists (4 classes)                  [0/4 done]  │  │
│  │  ▶ Stacks & Queues (3 classes)               [0/3 done]  │  │
│  │  ▶ Trees (6 classes)                         [0/6 done]  │  │
│  │  ▶ Graphs (5 classes)                        [0/5 done]  │  │
│  │  ...                                                      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Session Card (Expanded View)

```
┌─────────────────────────────────────────────────────────────────┐
│  ✓ Two Pointer Technique                                        │
│                                                                 │
│  Learn efficient problem-solving using two pointer approach.    │
│  We'll cover: opposite direction pointers, same direction       │
│  pointers, and solve 5+ LeetCode problems together.            │
│                                                                 │
│  Duration: ~2 hours                                             │
│                                                                 │
│  Resources:                                                     │
│  • LeetCode Problem List (link)                                │
│  • Class Notes (link)                                          │
│                                                                 │
│  ┌──────────────┐  ┌────────────────┐                          │
│  │ Mark as Done │  │ Unmark         │  ← Toggle based on state │
│  └──────────────┘  └────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

### Join Button States

```
State 1: No URL (Disabled)
┌─────────────────────────────┐
│  Join Class                 │  ← Faded, cursor: not-allowed
│  (Link will be shared soon) │
└─────────────────────────────┘

State 2: URL Available + Logged In (Active)
┌─────────────────────────────┐
│  Join Class →               │  ← Bright, clickable
└─────────────────────────────┘

State 3: URL Available + Not Logged In
┌─────────────────────────────┐
│  Login to Join              │  ← Redirects to login
└─────────────────────────────┘
```

---

## Security Model

### Row Level Security (RLS)

```sql
-- Users can only see their enrolled batch's sessions
CREATE POLICY "Users see enrolled batch sessions" ON sessions
  FOR SELECT USING (
    batch_id IN (
      SELECT batch_id FROM enrollments
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Users can only manage their own progress
CREATE POLICY "Users manage own progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);

-- Join URL protection: Return NULL if not logged in
-- (Handled in Edge Function or view)
```

### Secure Join URL Flow

```
1. User clicks "Join Class"
       │
       ▼
2. Frontend calls: supabase.functions.invoke('get-join-url', { session_id })
       │
       ▼
3. Edge Function checks:
   ├── Is user authenticated? → No → Return 401
   ├── Is user enrolled in this batch? → No → Return 403
   └── Does session have join_url? → No → Return { url: null }
       │
       ▼
4. Return { url: "https://zoom.us/j/..." }
       │
       ▼
5. Frontend opens URL in new tab
```

---

## Module/Topic Structure (Example)

### DSA (Data Structures & Algorithms)

| Module | Classes | Topics |
|--------|---------|--------|
| Arrays & Strings | 5 | Basics, Manipulation, Two Pointer, Sliding Window, Practice |
| Linked Lists | 4 | Singly, Doubly, Cycle Detection, Reversal |
| Stacks & Queues | 3 | Implementation, Monotonic Stack, Problems |
| Trees | 6 | Binary Tree, BST, Traversals, LCA, Problems |
| Graphs | 5 | BFS, DFS, Shortest Path, Topological Sort, Problems |
| Dynamic Programming | 8 | 1D DP, 2D DP, String DP, Tree DP, Practice |
| Recursion & Backtracking | 4 | Basics, Permutations, Subsets, N-Queens |
| Sorting & Searching | 3 | Algorithms, Binary Search, Applications |
| Heaps | 2 | Implementation, Top K Problems |
| Tries | 2 | Implementation, Applications |

### LLD (Low Level Design)

| Module | Classes |
|--------|---------|
| OOP Principles | 3 |
| SOLID Principles | 3 |
| Design Patterns | 5 |
| Case Studies | 4 |

### HLD (High Level Design)

| Module | Classes |
|--------|---------|
| System Design Basics | 2 |
| Scalability | 3 |
| Database Design | 2 |
| Case Studies | 5 |

### AI Fundamentals

| Module | Classes |
|--------|---------|
| AI Concepts | 2 |
| AI Tools | 3 |
| Practical Applications | 3 |

---

## Files to Update (Remove Recording Mentions)

| File | Line(s) | Current Text | Action |
|------|---------|--------------|--------|
| `src/pages/ApplyConfirmationPage.tsx` | 127 | "Lifetime access to recordings" | Remove or replace |
| `src/pages/TermsPage.tsx` | 77 | "We will provide recordings..." | Update terms |
| `src/pages/TermsPage.tsx` | 125 | "Recordings will be available for 30 days..." | Remove |
| `src/pages/TermsPage.tsx` | 263 | "...recordings..." in termination clause | Update |
| `src/components/sections/FAQSection.tsx` | 24 | "Recordings are provided for revision" | Update FAQ |
| `src/pages/WorkshopPage.tsx` | 491-496 | Recording FAQ items | Update or remove |
| `src/pages/PrivacyPolicyPage.tsx` | 78, 121, 190 | Recording mentions | Update policy |

---

## Implementation Phases

### Phase 1: Database Setup
- [ ] Create Supabase tables (batches, modules, sessions, enrollments, user_progress)
- [ ] Set up RLS policies
- [ ] Create Edge Function for secure join URL
- [ ] Seed initial data (modules, sample sessions)

### Phase 2: Core Dashboard
- [ ] Create dashboard route (`/dashboard`)
- [ ] Build UpcomingClassCard component
- [ ] Build ModuleAccordion component
- [ ] Build SessionCard component
- [ ] Implement progress tracking (mark as done)

### Phase 3: Authentication Integration
- [ ] Protected route wrapper
- [ ] Login redirect for non-authenticated users
- [ ] Enrollment verification
- [ ] Secure join URL fetch

### Phase 4: Polish & Content Updates
- [ ] Remove recording mentions from existing pages
- [ ] Add progress overview stats
- [ ] Mobile responsive design
- [ ] Loading states & error handling

---

## Decisions Made

| Question | Decision |
|----------|----------|
| Admin Panel | Use Supabase Dashboard directly (no custom admin UI) |
| Resources | Google Drive links stored in `resources` jsonb field |
| Priority | Full plan review before implementation |

## Open Questions (Still Need Answers)

1. **Notifications**: Do students need email notifications for upcoming classes?

2. **Mobile App**: Is mobile web sufficient or native app planned?

3. **Multiple Batches**: Can a user ever be in multiple batches?

---

## Component Structure (Proposed)

```
src/
├── pages/
│   └── DashboardPage.tsx
│
├── components/
│   └── dashboard/
│       ├── UpcomingClassCard.tsx
│       ├── ProgressOverview.tsx
│       ├── ModuleAccordion.tsx
│       ├── SessionCard.tsx
│       ├── JoinButton.tsx
│       └── ProgressToggle.tsx
│
├── hooks/
│   ├── useEnrollment.ts
│   ├── useSessions.ts
│   ├── useProgress.ts
│   └── useUpcomingClass.ts
│
├── lib/
│   └── supabase.ts
│
└── types/
    └── dashboard.ts
```

---

## Next Steps

Once this plan is approved:

1. Review and finalize data model
2. Set up Supabase tables
3. Start with Phase 1 implementation
4. Build incrementally with user feedback

---

## Revision History

| Date | Change |
|------|--------|
| Dec 2024 | Initial planning document created |
