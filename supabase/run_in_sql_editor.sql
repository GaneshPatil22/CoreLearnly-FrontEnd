-- ============================================================================
-- CORELEARNLY COMPLETE DATABASE SETUP
-- Version: 2.0 | December 2024
--
-- HOW TO USE:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Copy this entire file
-- 3. Paste and click "Run"
--
-- This creates all tables, indexes, RLS policies, and seed data
-- ============================================================================


-- ============================================================================
-- PART 1: TABLES
-- ============================================================================

-- 1. curriculum_versions
CREATE TABLE curriculum_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version TEXT NOT NULL UNIQUE,
    description TEXT,
    published_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. course_modules
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

-- 3. topics
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT topics_module_order_unique UNIQUE (module_id, display_order)
);

-- 4. lessons
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER DEFAULT 120,
    display_order INTEGER NOT NULL DEFAULT 0,
    resources JSONB DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT lessons_topic_order_unique UNIQUE (topic_id, display_order)
);

-- 5. assignments
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('leetcode', 'hackerrank', 'codeforces', 'geeksforgeeks', 'other')),
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT assignments_lesson_order_unique UNIQUE (lesson_id, display_order)
);

-- 6. batches (current_session_id FK added after sessions)
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    curriculum_version_id UUID NOT NULL REFERENCES curriculum_versions(id),
    start_date DATE NOT NULL,
    end_date DATE,
    max_seats INTEGER NOT NULL DEFAULT 40,
    max_free_seats INTEGER NOT NULL DEFAULT 15,
    current_session_id UUID,
    community_type TEXT CHECK (community_type IN ('whatsapp', 'discord', 'telegram')),
    community_link TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. sessions
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMPTZ,
    duration_minutes INTEGER DEFAULT 120,
    session_type TEXT NOT NULL CHECK (session_type IN ('beginner', 'advanced', 'ai')),
    zoom_link_encrypted TEXT,
    zoom_link_expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add FK for batches.current_session_id
ALTER TABLE batches
    ADD CONSTRAINT batches_current_session_fkey
    FOREIGN KEY (current_session_id) REFERENCES sessions(id) ON DELETE SET NULL;

-- 8. session_lessons
CREATE TABLE session_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT session_lessons_unique UNIQUE (session_id, lesson_id)
);

-- 9. enrollments
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

-- 10. attendance
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    left_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    device_info JSONB,
    ip_address INET,
    join_token TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT attendance_unique UNIQUE (enrollment_id, session_id)
);

-- 11. lesson_progress
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

-- 12. session_feedback
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

-- 13. audit_logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================================
-- PART 2: INDEXES
-- ============================================================================

CREATE INDEX idx_curriculum_versions_active ON curriculum_versions(is_active);
CREATE INDEX idx_course_modules_version ON course_modules(curriculum_version_id);
CREATE INDEX idx_course_modules_type ON course_modules(type);
CREATE INDEX idx_topics_module ON topics(module_id);
CREATE INDEX idx_lessons_topic ON lessons(topic_id);
CREATE INDEX idx_lessons_active ON lessons(is_active);
CREATE INDEX idx_assignments_lesson ON assignments(lesson_id);
CREATE INDEX idx_batches_active ON batches(is_active);
CREATE INDEX idx_batches_curriculum ON batches(curriculum_version_id);
CREATE INDEX idx_sessions_batch ON sessions(batch_id);
CREATE INDEX idx_sessions_scheduled ON sessions(scheduled_at);
CREATE INDEX idx_sessions_type ON sessions(session_type);
CREATE INDEX idx_session_lessons_session ON session_lessons(session_id);
CREATE INDEX idx_session_lessons_lesson ON session_lessons(lesson_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_batch ON enrollments(batch_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollments_free ON enrollments(is_free);
CREATE INDEX idx_attendance_enrollment ON attendance(enrollment_id);
CREATE INDEX idx_attendance_session ON attendance(session_id);
CREATE INDEX idx_attendance_joined ON attendance(joined_at);
CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX idx_lesson_progress_completed ON lesson_progress(user_id, is_completed);
CREATE INDEX idx_session_feedback_session ON session_feedback(session_id);
CREATE INDEX idx_session_feedback_user ON session_feedback(user_id);
CREATE INDEX idx_session_feedback_rating ON session_feedback(rating);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- Only ONE active enrollment per user
CREATE UNIQUE INDEX idx_enrollments_one_active ON enrollments(user_id) WHERE status = 'active';


-- ============================================================================
-- PART 3: ENABLE ROW LEVEL SECURITY
-- ============================================================================

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


-- ============================================================================
-- PART 4: RLS POLICIES
-- ============================================================================

-- curriculum_versions: Public read active
CREATE POLICY "Public read active curriculum" ON curriculum_versions FOR SELECT USING (is_active = true);
CREATE POLICY "Service role full access cv" ON curriculum_versions FOR ALL USING (auth.role() = 'service_role');

-- course_modules: Public read
CREATE POLICY "Public read modules" ON course_modules FOR SELECT USING (true);
CREATE POLICY "Service role full access cm" ON course_modules FOR ALL USING (auth.role() = 'service_role');

-- topics: Public read
CREATE POLICY "Public read topics" ON topics FOR SELECT USING (true);
CREATE POLICY "Service role full access topics" ON topics FOR ALL USING (auth.role() = 'service_role');

-- lessons: Enrolled users only (free tier restriction)
CREATE POLICY "Enrolled users read lessons" ON lessons FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM enrollments e
        JOIN batches b ON b.id = e.batch_id
        JOIN course_modules cm ON cm.curriculum_version_id = b.curriculum_version_id
        JOIN topics t ON t.module_id = cm.id
        WHERE e.user_id = auth.uid()
        AND e.status = 'active'
        AND t.id = lessons.topic_id
        AND (e.is_free = false OR cm.type = 'beginner')
    )
);
CREATE POLICY "Service role full access lessons" ON lessons FOR ALL USING (auth.role() = 'service_role');

-- assignments: Same as lessons
CREATE POLICY "Enrolled users read assignments" ON assignments FOR SELECT USING (
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
CREATE POLICY "Service role full access assignments" ON assignments FOR ALL USING (auth.role() = 'service_role');

-- batches: Enrolled users see their batch
CREATE POLICY "Enrolled users view batch" ON batches FOR SELECT USING (
    id IN (SELECT batch_id FROM enrollments WHERE user_id = auth.uid() AND status = 'active')
);
CREATE POLICY "Service role full access batches" ON batches FOR ALL USING (auth.role() = 'service_role');

-- sessions: Enrolled users (free tier restriction)
CREATE POLICY "Enrolled users view sessions" ON sessions FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM enrollments e
        WHERE e.user_id = auth.uid()
        AND e.batch_id = sessions.batch_id
        AND e.status = 'active'
        AND (e.is_free = false OR sessions.session_type = 'beginner')
    )
);
CREATE POLICY "Service role full access sessions" ON sessions FOR ALL USING (auth.role() = 'service_role');

-- session_lessons
CREATE POLICY "Enrolled users view session_lessons" ON session_lessons FOR SELECT USING (
    session_id IN (
        SELECT s.id FROM sessions s
        JOIN enrollments e ON e.batch_id = s.batch_id
        WHERE e.user_id = auth.uid() AND e.status = 'active'
    )
);
CREATE POLICY "Service role full access sl" ON session_lessons FOR ALL USING (auth.role() = 'service_role');

-- enrollments: Own records
CREATE POLICY "Users view own enrollments" ON enrollments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Service role full access enrollments" ON enrollments FOR ALL USING (auth.role() = 'service_role');

-- attendance: Own records
CREATE POLICY "Users view own attendance" ON attendance FOR SELECT USING (
    enrollment_id IN (SELECT id FROM enrollments WHERE user_id = auth.uid())
);
CREATE POLICY "Service role full access attendance" ON attendance FOR ALL USING (auth.role() = 'service_role');

-- lesson_progress: Full CRUD on own records
CREATE POLICY "Users view own progress" ON lesson_progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert own progress" ON lesson_progress FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own progress" ON lesson_progress FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users delete own progress" ON lesson_progress FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "Service role full access progress" ON lesson_progress FOR ALL USING (auth.role() = 'service_role');

-- session_feedback: Own records
CREATE POLICY "Users view own feedback" ON session_feedback FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert own feedback" ON session_feedback FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own feedback" ON session_feedback FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Service role full access feedback" ON session_feedback FOR ALL USING (auth.role() = 'service_role');

-- audit_logs: No user access
CREATE POLICY "No user access audit_logs" ON audit_logs FOR SELECT USING (false);
CREATE POLICY "Service role full access audit" ON audit_logs FOR ALL USING (auth.role() = 'service_role');


-- ============================================================================
-- PART 5: HELPER FUNCTION & TRIGGERS
-- ============================================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_curriculum_versions_updated_at BEFORE UPDATE ON curriculum_versions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_modules_updated_at BEFORE UPDATE ON course_modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_topics_updated_at BEFORE UPDATE ON topics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_batches_updated_at BEFORE UPDATE ON batches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lesson_progress_updated_at BEFORE UPDATE ON lesson_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================================================
-- PART 6: VIEW FOR BATCH SEAT STATUS
-- ============================================================================

CREATE OR REPLACE VIEW batch_seat_status AS
SELECT
    b.id,
    b.name,
    b.max_seats,
    b.max_free_seats,
    b.is_active,
    COUNT(e.id) FILTER (WHERE e.status = 'active') AS total_enrolled,
    COUNT(e.id) FILTER (WHERE e.status = 'active' AND e.is_free = true) AS free_enrolled,
    b.max_seats - COUNT(e.id) FILTER (WHERE e.status = 'active') AS seats_available,
    b.max_free_seats - COUNT(e.id) FILTER (WHERE e.status = 'active' AND e.is_free = true) AS free_seats_available
FROM batches b
LEFT JOIN enrollments e ON e.batch_id = b.id
GROUP BY b.id;


-- ============================================================================
-- PART 7: SEED DATA - CURRICULUM
-- ============================================================================

-- Curriculum Version
INSERT INTO curriculum_versions (id, version, description, is_active, published_at)
VALUES ('a0000000-0000-0000-0000-000000000001', 'v1.0', 'Initial curriculum - DSA + System Design + AI', true, now());

-- Course Modules
INSERT INTO course_modules (id, curriculum_version_id, name, description, type, duration_months, display_order) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Beginner DSA & System Design', 'Foundation: Arrays, Pointers, Prefix Sum, Recursion, Basic System Design', 'beginner', 2, 1),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Advanced DSA & System Design', 'DP, Graphs, Trees, OS, DB, Distributed Systems', 'advanced', 4, 2),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'AI Fundamentals', 'AI concepts, tools, and practical applications', 'ai', 6, 3);

-- Topics
INSERT INTO topics (id, module_id, name, description, icon, display_order) VALUES
-- Beginner
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Arrays & Pointers', 'Array manipulation, two-pointer, sliding window', 'array', 1),
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Prefix Sum', 'Prefix sum for range queries', 'sum', 2),
('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Recursion & Backtracking', 'Recursion fundamentals and backtracking', 'recursion', 3),
('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'Basic System Design', 'System design basics and patterns', 'system', 4),
-- Advanced
('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002', 'Dynamic Programming', 'DP patterns: 1D, 2D, string, tree DP', 'dp', 1),
('c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000002', 'Graphs', 'BFS, DFS, shortest path, topological sort', 'graph', 2),
('c0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000002', 'Trees & BST', 'Binary trees, BST, traversals, LCA', 'tree', 3),
('c0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000002', 'Advanced System Design', 'Distributed systems, caching, case studies', 'distributed', 4),
-- AI
('c0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000003', 'AI Concepts', 'AI/ML fundamentals', 'ai', 1),
('c0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000003', 'AI Tools & Productivity', 'ChatGPT, Claude, Copilot', 'tools', 2);

-- Lessons
INSERT INTO lessons (id, topic_id, title, description, duration_minutes, display_order, resources) VALUES
-- Arrays & Pointers
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Introduction to Arrays', 'Array basics and memory layout', 90, 1, '{}'),
('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Two Pointer Technique', 'Two-pointer approach for array problems', 120, 2, '{"problems": "https://leetcode.com/tag/two-pointers/"}'),
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'Sliding Window', 'Fixed and variable sliding window', 120, 3, '{"problems": "https://leetcode.com/tag/sliding-window/"}'),
('d0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'Array Problem Solving', 'Practice medium-level array problems', 120, 4, '{}'),
-- Prefix Sum
('d0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000002', 'Prefix Sum Basics', 'Prefix sum concept and applications', 90, 1, '{}'),
('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000002', 'Range Query Problems', 'Range sum queries using prefix sum', 120, 2, '{}'),
-- Recursion
('d0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000003', 'Recursion Fundamentals', 'Recursion, base cases, call stack', 120, 1, '{}'),
('d0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000003', 'Backtracking', 'Permutations, combinations, subsets', 120, 2, '{"problems": "https://leetcode.com/tag/backtracking/"}'),
-- Basic System Design
('d0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000004', 'System Design Basics', 'Intro to system design and scalability', 120, 1, '{}'),
('d0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000004', 'Database Fundamentals', 'SQL vs NoSQL, indexing basics', 120, 2, '{}'),
-- DP (Advanced)
('d0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000005', '1D Dynamic Programming', 'Climbing stairs, house robber patterns', 120, 1, '{"problems": "https://leetcode.com/tag/dynamic-programming/"}'),
('d0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000005', '2D Dynamic Programming', 'Grid-based DP problems', 120, 2, '{}'),
('d0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000005', 'String DP', 'LCS, Edit Distance', 120, 3, '{}'),
-- Graphs (Advanced)
('d0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000006', 'Graph Representation & BFS', 'Adjacency list/matrix, BFS', 120, 1, '{}'),
('d0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000006', 'DFS & Applications', 'DFS, cycle detection, components', 120, 2, '{}'),
('d0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000006', 'Shortest Path Algorithms', 'Dijkstra, Bellman-Ford', 120, 3, '{}'),
-- AI
('d0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000009', 'What is AI?', 'AI, ML, deep learning basics', 90, 1, '{}'),
('d0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000010', 'Using ChatGPT Effectively', 'Prompt engineering', 90, 1, '{}'),
('d0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000010', 'AI for Developers', 'Copilot, Claude for coding', 90, 2, '{}');

-- Assignments
INSERT INTO assignments (id, lesson_id, title, url, platform, difficulty, display_order) VALUES
('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'Two Sum', 'https://leetcode.com/problems/two-sum/', 'leetcode', 'easy', 1),
('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', '3Sum', 'https://leetcode.com/problems/3sum/', 'leetcode', 'medium', 2),
('e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000002', 'Container With Most Water', 'https://leetcode.com/problems/container-with-most-water/', 'leetcode', 'medium', 3),
('e0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000003', 'Maximum Subarray', 'https://leetcode.com/problems/maximum-subarray/', 'leetcode', 'medium', 1),
('e0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000003', 'Longest Substring Without Repeating', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', 'leetcode', 'medium', 2),
('e0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000008', 'Subsets', 'https://leetcode.com/problems/subsets/', 'leetcode', 'medium', 1),
('e0000000-0000-0000-0000-000000000007', 'd0000000-0000-0000-0000-000000000008', 'Permutations', 'https://leetcode.com/problems/permutations/', 'leetcode', 'medium', 2),
('e0000000-0000-0000-0000-000000000008', 'd0000000-0000-0000-0000-000000000011', 'Climbing Stairs', 'https://leetcode.com/problems/climbing-stairs/', 'leetcode', 'easy', 1),
('e0000000-0000-0000-0000-000000000009', 'd0000000-0000-0000-0000-000000000011', 'House Robber', 'https://leetcode.com/problems/house-robber/', 'leetcode', 'medium', 2);


-- ============================================================================
-- PART 8: SEED DATA - TEST BATCH
-- ============================================================================

-- January 2025 Batch
INSERT INTO batches (id, name, description, curriculum_version_id, start_date, end_date, max_seats, max_free_seats, community_type, is_active)
VALUES ('f0000000-0000-0000-0000-000000000001', 'January 2025 Batch', '6-month program starting Jan 15', 'a0000000-0000-0000-0000-000000000001', '2025-01-15', '2025-07-15', 40, 15, 'whatsapp', true);

-- Sample Sessions
INSERT INTO sessions (id, batch_id, title, description, scheduled_at, duration_minutes, session_type) VALUES
('aa000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'Arrays - Introduction', 'First class: array basics', '2025-01-15 19:00:00+05:30', 90, 'beginner'),
('aa000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', 'Arrays - Two Pointer', 'Two-pointer technique', '2025-01-17 19:00:00+05:30', 120, 'beginner'),
('aa000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', 'Arrays - Sliding Window', 'Sliding window patterns', '2025-01-20 19:00:00+05:30', 120, 'beginner'),
('aa000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', 'AI - Introduction', 'Weekend AI class', '2025-01-18 10:00:00+05:30', 90, 'ai');

-- Link sessions to lessons
INSERT INTO session_lessons (session_id, lesson_id, display_order) VALUES
('aa000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 1),
('aa000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 1),
('aa000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003', 1),
('aa000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000018', 1);

-- Set current session
UPDATE batches SET current_session_id = 'aa000000-0000-0000-0000-000000000001' WHERE id = 'f0000000-0000-0000-0000-000000000001';


-- ============================================================================
-- DONE! Your database is ready.
-- ============================================================================
