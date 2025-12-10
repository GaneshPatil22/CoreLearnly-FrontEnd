-- ============================================================================
-- CORELEARNLY DATABASE SCHEMA
-- Version: 2.0
-- Created: December 2024
--
-- Execute this in Supabase SQL Editor or via Supabase CLI migrations
-- ============================================================================

-- ============================================================================
-- SECTION 1: TABLE DEFINITIONS (in dependency order)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1.1 curriculum_versions
-- Tracks content versions. New versions only affect future batches.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS curriculum_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version TEXT NOT NULL UNIQUE,
    description TEXT,
    published_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 1.2 course_modules
-- Groups content into Beginner/Advanced/AI. Links to curriculum version.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS course_modules (
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

-- ----------------------------------------------------------------------------
-- 1.3 topics
-- Subject areas within modules (e.g., Arrays, Trees, Graphs).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS topics (
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

-- ----------------------------------------------------------------------------
-- 1.4 lessons
-- Individual learning units within topics.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lessons (
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

-- ----------------------------------------------------------------------------
-- 1.5 assignments
-- Practice problems linked to lessons.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assignments (
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

-- ----------------------------------------------------------------------------
-- 1.6 batches
-- Student groups with seat limits and community links.
-- Note: current_session_id FK added after sessions table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    curriculum_version_id UUID NOT NULL REFERENCES curriculum_versions(id),
    start_date DATE NOT NULL,
    end_date DATE,

    -- Seat limits
    max_seats INTEGER NOT NULL DEFAULT 40,
    max_free_seats INTEGER NOT NULL DEFAULT 15,

    -- Current session tracking (FK added later)
    current_session_id UUID,

    -- Community
    community_type TEXT CHECK (community_type IN ('whatsapp', 'discord', 'telegram')),
    community_link TEXT,

    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 1.7 sessions
-- Live class occurrences per batch.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMPTZ,
    duration_minutes INTEGER DEFAULT 120,
    session_type TEXT NOT NULL CHECK (session_type IN ('beginner', 'advanced', 'ai')),

    -- Secure Zoom link (encrypted at rest)
    zoom_link_encrypted TEXT,
    zoom_link_expires_at TIMESTAMPTZ,

    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add FK for batches.current_session_id now that sessions exists
ALTER TABLE batches
    ADD CONSTRAINT batches_current_session_fkey
    FOREIGN KEY (current_session_id) REFERENCES sessions(id) ON DELETE SET NULL;

-- ----------------------------------------------------------------------------
-- 1.8 session_lessons
-- Links sessions to lessons (which lessons are covered in which session).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS session_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT session_lessons_unique UNIQUE (session_id, lesson_id)
);

-- ----------------------------------------------------------------------------
-- 1.9 enrollments
-- Links users to batches with free/paid distinction.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS enrollments (
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

-- ----------------------------------------------------------------------------
-- 1.10 attendance
-- Tracks who joined each session with security info.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    left_at TIMESTAMPTZ,
    duration_seconds INTEGER,

    -- Security tracking
    device_info JSONB,
    ip_address INET,
    join_token TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT attendance_unique UNIQUE (enrollment_id, session_id)
);

-- ----------------------------------------------------------------------------
-- 1.11 lesson_progress
-- User's self-marked progress on lessons.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lesson_progress (
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

-- ----------------------------------------------------------------------------
-- 1.12 session_feedback
-- Required feedback after each session.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS session_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_anonymous BOOLEAN NOT NULL DEFAULT false,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT session_feedback_unique UNIQUE (session_id, user_id)
);

-- ----------------------------------------------------------------------------
-- 1.13 audit_logs
-- Security audit trail for sensitive operations.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
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
-- SECTION 2: INDEXES
-- ============================================================================

-- curriculum_versions
CREATE INDEX IF NOT EXISTS idx_curriculum_versions_active ON curriculum_versions(is_active);

-- course_modules
CREATE INDEX IF NOT EXISTS idx_course_modules_version ON course_modules(curriculum_version_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_type ON course_modules(type);

-- topics
CREATE INDEX IF NOT EXISTS idx_topics_module ON topics(module_id);

-- lessons
CREATE INDEX IF NOT EXISTS idx_lessons_topic ON lessons(topic_id);
CREATE INDEX IF NOT EXISTS idx_lessons_active ON lessons(is_active);

-- assignments
CREATE INDEX IF NOT EXISTS idx_assignments_lesson ON assignments(lesson_id);

-- batches
CREATE INDEX IF NOT EXISTS idx_batches_active ON batches(is_active);
CREATE INDEX IF NOT EXISTS idx_batches_curriculum ON batches(curriculum_version_id);

-- sessions
CREATE INDEX IF NOT EXISTS idx_sessions_batch ON sessions(batch_id);
CREATE INDEX IF NOT EXISTS idx_sessions_scheduled ON sessions(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_sessions_type ON sessions(session_type);

-- session_lessons
CREATE INDEX IF NOT EXISTS idx_session_lessons_session ON session_lessons(session_id);
CREATE INDEX IF NOT EXISTS idx_session_lessons_lesson ON session_lessons(lesson_id);

-- enrollments
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_batch ON enrollments(batch_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_free ON enrollments(is_free);

-- Partial unique index: Only one ACTIVE enrollment per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_enrollments_one_active
    ON enrollments(user_id)
    WHERE status = 'active';

-- attendance
CREATE INDEX IF NOT EXISTS idx_attendance_enrollment ON attendance(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_attendance_session ON attendance(session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_joined ON attendance(joined_at);

-- lesson_progress
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_completed ON lesson_progress(user_id, is_completed);

-- session_feedback
CREATE INDEX IF NOT EXISTS idx_session_feedback_session ON session_feedback(session_id);
CREATE INDEX IF NOT EXISTS idx_session_feedback_user ON session_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_session_feedback_rating ON session_feedback(rating);

-- audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);


-- ============================================================================
-- SECTION 3: TABLE COMMENTS
-- ============================================================================

COMMENT ON TABLE curriculum_versions IS 'Tracks curriculum versions. Past batches retain their version, new batches use latest.';
COMMENT ON TABLE course_modules IS 'Course modules: Beginner (2 months), Advanced (4 months), AI (parallel). beginner = free tier access.';
COMMENT ON TABLE topics IS 'Topic areas within modules (e.g., Arrays, Linked Lists, Trees).';
COMMENT ON TABLE lessons IS 'Individual lessons within topics. Global content shared by all batches.';
COMMENT ON TABLE assignments IS 'Practice problems linked to lessons. External URLs to LC/HR/etc.';
COMMENT ON TABLE batches IS 'Student batches with seat limits. Max 40 total, max 15 free seats.';
COMMENT ON TABLE sessions IS 'Live class occurrences per batch. Zoom link stored encrypted.';
COMMENT ON TABLE session_lessons IS 'Maps which lessons are covered in each session.';
COMMENT ON TABLE enrollments IS 'User-batch link. is_free=true means beginner-only access.';
COMMENT ON TABLE attendance IS 'Tracks session attendance with device/IP for security auditing.';
COMMENT ON TABLE lesson_progress IS 'User self-marked lesson completion. Module complete at 80%.';
COMMENT ON TABLE session_feedback IS 'Per-session student feedback. Rating 1-5, optional anonymous.';
COMMENT ON TABLE audit_logs IS 'Security audit trail. Tracks session joins, enrollments, etc.';

COMMENT ON COLUMN sessions.zoom_link_encrypted IS 'AES-256 encrypted Zoom URL. Decrypted only via Edge Function.';
COMMENT ON COLUMN lessons.resources IS 'JSON: {"notes": "gdrive-url", "slides": "url", "problems": "leetcode-url"}';
COMMENT ON COLUMN course_modules.type IS 'beginner = free tier access, advanced/ai = paid only';
COMMENT ON COLUMN batches.current_session_id IS 'The currently active/upcoming session for this batch';


-- ============================================================================
-- SECTION 4: ENABLE ROW LEVEL SECURITY
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
-- SECTION 5: ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 5.1 curriculum_versions policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Public read active curriculum versions"
    ON curriculum_versions FOR SELECT
    USING (is_active = true);

CREATE POLICY "Service role full access curriculum_versions"
    ON curriculum_versions FOR ALL
    USING (auth.role() = 'service_role');

-- ----------------------------------------------------------------------------
-- 5.2 course_modules policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Public read course modules"
    ON course_modules FOR SELECT
    USING (true);

CREATE POLICY "Service role full access course_modules"
    ON course_modules FOR ALL
    USING (auth.role() = 'service_role');

-- ----------------------------------------------------------------------------
-- 5.3 topics policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Public read topics"
    ON topics FOR SELECT
    USING (true);

CREATE POLICY "Service role full access topics"
    ON topics FOR ALL
    USING (auth.role() = 'service_role');

-- ----------------------------------------------------------------------------
-- 5.4 lessons policies (enrolled users only, with free tier restriction)
-- ----------------------------------------------------------------------------
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
                e.is_free = false
                OR cm.type = 'beginner'
            )
        )
    );

CREATE POLICY "Service role full access lessons"
    ON lessons FOR ALL
    USING (auth.role() = 'service_role');

-- ----------------------------------------------------------------------------
-- 5.5 assignments policies (same as lessons)
-- ----------------------------------------------------------------------------
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

CREATE POLICY "Service role full access assignments"
    ON assignments FOR ALL
    USING (auth.role() = 'service_role');

-- ----------------------------------------------------------------------------
-- 5.6 batches policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Enrolled users view own batch"
    ON batches FOR SELECT
    USING (
        id IN (
            SELECT batch_id FROM enrollments
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Service role full access batches"
    ON batches FOR ALL
    USING (auth.role() = 'service_role');

-- ----------------------------------------------------------------------------
-- 5.7 sessions policies (with free tier restriction)
-- ----------------------------------------------------------------------------
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

CREATE POLICY "Service role full access sessions"
    ON sessions FOR ALL
    USING (auth.role() = 'service_role');

-- ----------------------------------------------------------------------------
-- 5.8 session_lessons policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Enrolled users view session_lessons"
    ON session_lessons FOR SELECT
    USING (
        session_id IN (
            SELECT s.id FROM sessions s
            JOIN enrollments e ON e.batch_id = s.batch_id
            WHERE e.user_id = auth.uid() AND e.status = 'active'
        )
    );

CREATE POLICY "Service role full access session_lessons"
    ON session_lessons FOR ALL
    USING (auth.role() = 'service_role');

-- ----------------------------------------------------------------------------
-- 5.9 enrollments policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Users view own enrollments"
    ON enrollments FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Service role full access enrollments"
    ON enrollments FOR ALL
    USING (auth.role() = 'service_role');

-- ----------------------------------------------------------------------------
-- 5.10 attendance policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Users view own attendance"
    ON attendance FOR SELECT
    USING (
        enrollment_id IN (
            SELECT id FROM enrollments WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role full access attendance"
    ON attendance FOR ALL
    USING (auth.role() = 'service_role');

-- ----------------------------------------------------------------------------
-- 5.11 lesson_progress policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Users view own progress"
    ON lesson_progress FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users insert own progress"
    ON lesson_progress FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own progress"
    ON lesson_progress FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users delete own progress"
    ON lesson_progress FOR DELETE
    USING (user_id = auth.uid());

CREATE POLICY "Service role full access lesson_progress"
    ON lesson_progress FOR ALL
    USING (auth.role() = 'service_role');

-- ----------------------------------------------------------------------------
-- 5.12 session_feedback policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Users view own feedback"
    ON session_feedback FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users insert own feedback"
    ON session_feedback FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own feedback"
    ON session_feedback FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Service role full access session_feedback"
    ON session_feedback FOR ALL
    USING (auth.role() = 'service_role');

-- ----------------------------------------------------------------------------
-- 5.13 audit_logs policies (admin only)
-- ----------------------------------------------------------------------------
CREATE POLICY "No user access to audit_logs"
    ON audit_logs FOR SELECT
    USING (false);

CREATE POLICY "Service role full access audit_logs"
    ON audit_logs FOR ALL
    USING (auth.role() = 'service_role');


-- ============================================================================
-- SECTION 6: HELPER FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables with updated_at column
CREATE TRIGGER update_curriculum_versions_updated_at
    BEFORE UPDATE ON curriculum_versions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at
    BEFORE UPDATE ON course_modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topics_updated_at
    BEFORE UPDATE ON topics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
    BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_batches_updated_at
    BEFORE UPDATE ON batches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at
    BEFORE UPDATE ON enrollments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at
    BEFORE UPDATE ON lesson_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================================================
-- SECTION 7: USEFUL VIEWS (Optional - for easier querying)
-- ============================================================================

-- View: Batch seat availability
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
-- END OF MIGRATION
-- ============================================================================
