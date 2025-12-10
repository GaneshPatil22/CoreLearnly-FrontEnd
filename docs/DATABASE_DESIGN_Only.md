# Online Learning Platform Architecture & Requirements

*(Draft – for review with backend engineering)*

> **Latest Operational Decisions**  
> • Single instructor (no teacher management)  
> • No coupons / referral system (Phase-1)  
> • Maximum **40 seats per batch** enforced  
> • **15 free-seat limit** per batch → access **only for Beginner (first 2 months)**  
> • Curriculum versioning enabled (content updates shouldn’t break existing progress)  
> • Student feedback required **per session**  
> • Community group per batch (WhatsApp initially, Discord optional)

---

## 1. Business Goals
- Deliver structured **DSA + System Design** (6 months) + parallel **AI weekend classes**
- Support multiple batches in parallel, each with same course content
- Secure classes such that **only enrolled logged-in students** can attend Zoom sessions
- Scalable design to support thousands of students and future team expansion

---

## 2. User Roles
| Role | Capabilities |
|------|--------------|
| Student | Enroll in 1 active batch, access content, mark progress, join sessions, submit assignments |
| Admin (Instructor) | Manage batches, schedule classes, upload Zoom links, control access |

*No teacher-level role in Phase-1*

---

## 3. Functional Requirements
### Enrollment Rules
- One active batch per student at a time
- Max 40 seats per batch
- Max 15 free seats per batch (only beginner module access)
- Re-enrollment allowed after drop/completion

### Course Structure
| Module | Duration | Topics Covered |
|--------|----------|----------------|
| Beginner | 2 months | Arrays→Pointers→Prefix Sum → Recursion → Basics System Design |
| Advanced | 4 months | DP, Graphs, OS, DB, Distributed Systems |

AI classes run **parallel** on weekends (1/week)

### Progress & Assignments
- Student can **self-mark** progress
- Assignments list will contain external URLs (LC/HR)

### Session Access Security
- Zoom link is **never visible directly**
- Join button only active when admin attaches signed access

---

## 4. Technical Architecture Overview
- **Supabase** for DB, Auth, Storage, RLS
- Backend (if required) = lightweight proxy for Zoom security
- Frontend: Next.js or Swift app or Web App (future mobile app)

**Key Design Principle** → *Curriculum content is defined ONCE and reused across all batches*

---

## 5. Database Domain Model

### Core Entities
| Entity | Purpose |
|--------|---------|
| Users | Student accounts + subscription details |
| Batches | Specific schedule groups for same course |
| Sessions | Each class occurrence (Beginner+Advanced+AI) |
| CurriculumVersions | Tracks updates to content |
| CourseModules | Beginner/Advanced grouping |
| Topics | Example: Arrays section |
| Lessons | Example: Two Pointers lesson |
| Assignments | Linked to lessons |
| Attendance | Tracks who joined each class |
| SessionFeedback | Rating and comment per session |
| CommunityGroups | WhatsApp/Discord mapping |

---

### ✔️ ASCII ERD (Full Detailed)
```
+---------+       +------------+        +-------------+
| Users   |1     *| Enrollments|*     1 | Batches     |
+----+----+       +-----+------+        +------+------+
     |                  |                     |
     |                  |                     |
     |1                 |*                    |1
     |                  |                     |
     v                  v                     v
+------------+    +------------+        +-------------+
|Attendance  |* 1 | Sessions   |1     *| SessionFeedback|
+------------+    +------+-----+        +--------------+
                       |
                       |1
                       |
                       v
                 +-----------+      +--------------+
                 | LessonMap |* 1  | Lessons      |
                 +-----+-----+      +------+------+
                       |                  |
                       |1                 |*
                       v                  v
                 +-----------+      +--------------+
                 | Topics    |1    *| Assignments  |
                 +-----------+      +--------------+
```
(
`LessonMap` = Linking table mapping Sessions to Lessons in correct order
)

---

## 6. Important Rules & Logic
### Enrollment
```text
If batch seats >= 40 → block enrollment
If free seats enrolled >= 15 → block free enrollment
```

### Free Seats
- Access **only beginner module lessons + sessions**
- When **Advanced starts** → upsell to full access

### Curriculum Versioning
- New versions only affect **future batches**
- Past student progress remains untouched

### Attendance Security
- Attended only when **signed server token validated**
- Link expires after session

---

## 7. Zoom Link Security & RLS Policies
### Student Flow
```
Student → Login → Dashboard → Upcoming Session → Join
↓ (Admin attached signed URL)
Zoom launched through secure proxy
```

### Backend Security Idea
- Zoom link stored encrypted in Supabase
- Runtime signed URL generated with `UserID + SessionID + Expiry`
- RLS ensures only **enrolled users** can access

### Example RLS for Session Access
```sql
CREATE POLICY "enrolled_can_view_sessions"
ON Sessions
USING (
  EXISTS (
    SELECT 1 FROM Enrollments e
    WHERE e.user_id = auth.uid()
    AND e.batch_id = Sessions.batch_id
  )
);
```

---

## 8. API Endpoints (Full Detailed)
> Authentication: **JWT** from Supabase Auth required in headers

| API | Method | Description | Access |
|-----|--------|-------------|--------|
| `/enroll` | POST | Enroll in batch | Student |
| `/sessions/upcoming` | GET | Next classes | Student |
| `/sessions/:id/join` | POST | Generates signed Zoom token | Student |
| `/progress/lesson/:id` | POST | Mark completed | Student |
| `/feedback/session` | POST | Submit rating + comment | Student |
| `/admin/batches` | CRUD | Manage batches | Admin |
| `/admin/sessions` | CRUD | Schedule, attach Zoom link | Admin |
| `/admin/curriculum` | CRUD | Content updates | Admin |

### Example Response
```json
{
  "session_id": "S123",
  "zoom_signed_url": "https://domain/join?token=abc" ,
  "expires_in": 1200
}
```

---

## 9. Progress Tracking Logic
- Each lesson completion updates `StudentProgress`
- Module completion once **>=80%** lessons completed
- Batch completion only when all sessions attended or marked done

---

## 10. Feedback Collection
| Field | Purpose |
|------|---------|
| rating (1-5) | Quality check |
| comment | Improvement areas |
| anonymous boolean | optional |

Admin dashboard: session-wise analytics

---

## 11. Community / Group Chat
- WhatsApp link or Discord invite auto-assigned after enrollment
- Group stored per batch → only valid for active students

---

## 12. Scalability Plan
| Stage | Students | Action |
|------|---------|--------|
| MVP | 100–300 | Single region DB |
| Growth | 1K–10K | Storage caching, read-replicas |
| Scale | 10K+ | Partition Sessions table per batch |

Audit logging added as students scale

---

## 13. Monitoring & Audits
- Log every `session join` event
- Track repeated attempts from new devices → block

---

## 14. Future Phase Upgrades
- Project submissions & code judge
- AI-powered doubt assistant
- Certificate generation
- Monthly tests with scores

---

**End of Document — v1.0**

