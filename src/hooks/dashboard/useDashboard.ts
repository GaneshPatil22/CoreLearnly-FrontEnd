import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../services/supabase/client';
import { useAuth } from '../../context/auth/AuthContext';
import type { DashboardData, CourseModule, Topic, Lesson, Session, Enrollment, Batch, LessonProgress } from '../../types';

// Session status based on time
export type SessionStatus = 'upcoming' | 'joinable' | 'in_progress' | 'completed';

export interface SessionWithStatus extends Session {
  status: SessionStatus;
  canJoin: boolean;
}

interface UseDashboardReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  toggleLessonProgress: (lessonId: string, completed: boolean) => Promise<void>;
  getSessionJoinUrl: (sessionId: string) => Promise<{ url: string | null; error: string | null }>;
  refetch: () => Promise<void>;
}

// Helper to calculate session status
export function getSessionStatus(session: Session): SessionWithStatus {
  const now = new Date();
  const sessionStart = new Date(session.scheduled_at);
  const diffMs = sessionStart.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  // Join window: 15 min before to 4 hours after start
  const JOIN_WINDOW_BEFORE_MINS = 15;
  const JOIN_WINDOW_AFTER_MINS = 240; // 4 hours

  let status: SessionStatus;
  let canJoin = false;

  if (diffMins > JOIN_WINDOW_BEFORE_MINS) {
    // More than 15 mins before session
    status = 'upcoming';
  } else if (diffMins > 0) {
    // Within 15 mins before session start
    status = 'joinable';
    // Can only join if zoom link is present
    canJoin = !!session.has_zoom_link;
  } else if (diffMins > -JOIN_WINDOW_AFTER_MINS && session.has_zoom_link) {
    // Session started, within 4 hour window, AND zoom link still present
    status = 'in_progress';
    canJoin = true;
  } else {
    // Either:
    // - More than 4 hours after session start, OR
    // - Zoom link removed (instructor ended the session)
    status = 'completed';
  }

  return { ...session, status, canJoin };
}

interface EnrollmentWithBatch {
  id: string;
  user_id: string;
  batch_id: string;
  is_free: boolean;
  status: string;
  enrolled_at: string;
  batches: Batch | null;
}

export function useDashboard(): UseDashboardReturn {
  const { user } = useAuth();
  const userId = user?.id;
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Get user's active enrollment with batch info
      const { data: enrollment, error: enrollError } = await supabase
        .from('enrollments')
        .select(`
          id,
          user_id,
          batch_id,
          is_free,
          status,
          enrolled_at,
          batches (
            id,
            name,
            curriculum_version_id,
            start_date,
            end_date,
            is_active
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      if (enrollError) throw enrollError;

      if (!enrollment) {
        setData({
          enrollment: null,
          modules: [],
          progress: [],
          todaySession: null,
          upcomingSession: null,
          stats: { totalLessons: 0, completedLessons: 0, progressPercent: 0 }
        });
        setHasFetched(true);
        setLoading(false);
        return;
      }

      const enrollmentData = enrollment as unknown as EnrollmentWithBatch;
      const batch = enrollmentData.batches;
      const curriculumVersionId = batch?.curriculum_version_id;

      if (!curriculumVersionId) {
        throw new Error('No curriculum version found for this batch');
      }

      // 2. Get course_modules with topics and lessons
      const { data: modules, error: modulesError } = await supabase
        .from('course_modules')
        .select(`
          id,
          curriculum_version_id,
          name,
          description,
          type,
          display_order,
          topics (
            id,
            module_id,
            name,
            description,
            display_order,
            lessons (
              id,
              topic_id,
              title,
              description,
              display_order,
              is_active
            )
          )
        `)
        .eq('curriculum_version_id', curriculumVersionId)
        .order('display_order', { ascending: true });

      if (modulesError) throw modulesError;

      // Sort topics and lessons within each module
      const sortedModules = (modules || []).map(module => ({
        ...module,
        topics: (module.topics || [])
          .sort((a: Topic, b: Topic) => a.display_order - b.display_order)
          .map((topic: Topic) => ({
            ...topic,
            lessons: (topic.lessons || [])
              .filter((l: Lesson) => l.is_active)
              .sort((a: Lesson, b: Lesson) => a.display_order - b.display_order)
          }))
      })) as CourseModule[];

      // 3. Get user's lesson progress
      const { data: progress, error: progressError } = await supabase
        .from('lesson_progress')
        .select('id, user_id, lesson_id, is_completed, completed_at')
        .eq('user_id', userId);

      if (progressError) throw progressError;

      // 4. Get today's session and upcoming session for this batch
      const now = new Date();

      // Today's date boundaries (start and end of today)
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(now);
      todayEnd.setHours(23, 59, 59, 999);

      // Tomorrow start for upcoming sessions
      const tomorrowStart = new Date(todayEnd);
      tomorrowStart.setDate(tomorrowStart.getDate() + 1);
      tomorrowStart.setHours(0, 0, 0, 0);

      // 4a. Get today's session (session scheduled for today)
      const { data: todaySessionRaw, error: todaySessionError } = await supabase
        .from('sessions')
        .select(`
          id,
          batch_id,
          title,
          description,
          session_type,
          scheduled_at,
          duration_minutes,
          is_active,
          zoom_link_encrypted
        `)
        .eq('batch_id', enrollment.batch_id)
        .eq('is_active', true)
        .gte('scheduled_at', todayStart.toISOString())
        .lte('scheduled_at', todayEnd.toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (todaySessionError) throw todaySessionError;

      // Transform today's session - add has_zoom_link flag
      // Always show today's session if one exists - status changes based on time/zoom link
      const todaySession: Session | null = todaySessionRaw ? {
        id: todaySessionRaw.id,
        batch_id: todaySessionRaw.batch_id,
        title: todaySessionRaw.title,
        description: todaySessionRaw.description,
        session_type: todaySessionRaw.session_type,
        scheduled_at: todaySessionRaw.scheduled_at,
        duration_minutes: todaySessionRaw.duration_minutes,
        is_active: todaySessionRaw.is_active,
        has_zoom_link: !!todaySessionRaw.zoom_link_encrypted
      } : null;

      // 4b. Get next upcoming session (after today)
      const { data: upcomingSessionRaw, error: upcomingSessionError } = await supabase
        .from('sessions')
        .select(`
          id,
          batch_id,
          title,
          description,
          session_type,
          scheduled_at,
          duration_minutes,
          is_active,
          zoom_link_encrypted
        `)
        .eq('batch_id', enrollment.batch_id)
        .eq('is_active', true)
        .gte('scheduled_at', tomorrowStart.toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (upcomingSessionError) throw upcomingSessionError;

      // Transform upcoming session
      const upcomingSession: Session | null = upcomingSessionRaw ? {
        id: upcomingSessionRaw.id,
        batch_id: upcomingSessionRaw.batch_id,
        title: upcomingSessionRaw.title,
        description: upcomingSessionRaw.description,
        session_type: upcomingSessionRaw.session_type,
        scheduled_at: upcomingSessionRaw.scheduled_at,
        duration_minutes: upcomingSessionRaw.duration_minutes,
        is_active: upcomingSessionRaw.is_active,
        has_zoom_link: !!upcomingSessionRaw.zoom_link_encrypted
      } : null;

      // 5. Calculate stats - flatten all lessons
      const allLessons = sortedModules.flatMap(m =>
        (m.topics || []).flatMap(t => t.lessons || [])
      );
      const totalLessons = allLessons.length;
      const completedLessons = (progress || []).filter(p => p.is_completed).length;
      const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      // 6. Merge progress into lessons
      const progressMap = new Map((progress || []).map(p => [p.lesson_id, p]));
      const modulesWithProgress = sortedModules.map(module => ({
        ...module,
        topics: (module.topics || []).map(topic => ({
          ...topic,
          lessons: (topic.lessons || []).map(lesson => ({
            ...lesson,
            is_completed: progressMap.get(lesson.id)?.is_completed || false,
            completed_at: progressMap.get(lesson.id)?.completed_at || undefined
          }))
        }))
      }));

      const finalEnrollment: Enrollment = {
        id: enrollmentData.id,
        user_id: enrollmentData.user_id,
        batch_id: enrollmentData.batch_id,
        is_free: enrollmentData.is_free,
        status: enrollmentData.status as 'active' | 'completed' | 'cancelled',
        enrolled_at: enrollmentData.enrolled_at,
        batch: batch || undefined
      };

      setData({
        enrollment: finalEnrollment,
        modules: modulesWithProgress,
        progress: (progress || []) as LessonProgress[],
        todaySession: todaySession as Session | null,
        upcomingSession: upcomingSession as Session | null,
        stats: { totalLessons, completedLessons, progressPercent }
      });

      setHasFetched(true);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // Only fetch if we haven't fetched yet or userId changed
    if (!hasFetched || !data) {
      fetchDashboardData();
    }
  }, [fetchDashboardData, hasFetched, data]);

  const toggleLessonProgress = async (lessonId: string, completed: boolean) => {
    try {
      const { data: result, error } = await supabase.functions.invoke('toggle-lesson-progress', {
        body: { lesson_id: lessonId, completed }
      });

      if (error) throw error;
      if (!result.success) throw new Error(result.error);

      // Update local state optimistically
      setData(prev => {
        if (!prev) return prev;

        const updatedModules = prev.modules.map(module => ({
          ...module,
          topics: (module.topics || []).map(topic => ({
            ...topic,
            lessons: (topic.lessons || []).map(lesson =>
              lesson.id === lessonId
                ? { ...lesson, is_completed: completed, completed_at: completed ? new Date().toISOString() : undefined }
                : lesson
            )
          }))
        }));

        const completedCount = updatedModules.flatMap(m =>
          (m.topics || []).flatMap(t => t.lessons || [])
        ).filter(l => l.is_completed).length;

        const totalCount = updatedModules.flatMap(m =>
          (m.topics || []).flatMap(t => t.lessons || [])
        ).length;

        return {
          ...prev,
          modules: updatedModules,
          stats: {
            ...prev.stats,
            completedLessons: completedCount,
            progressPercent: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
          }
        };
      });

    } catch (err) {
      console.error('Toggle progress error:', err);
      throw err;
    }
  };

  const getSessionJoinUrl = async (sessionId: string): Promise<{ url: string | null; error: string | null }> => {
    try {
      const { data: result, error } = await supabase.functions.invoke('get-session-join-url', {
        body: { session_id: sessionId }
      });

      if (error) throw error;
      if (!result.success) {
        return { url: null, error: result.error || result.message };
      }

      return { url: result.join_url, error: null };

    } catch (err) {
      console.error('Get join URL error:', err);
      return { url: null, error: 'Failed to get session link' };
    }
  };

  return {
    data,
    loading,
    error,
    toggleLessonProgress,
    getSessionJoinUrl,
    refetch: fetchDashboardData
  };
}
