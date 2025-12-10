import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../services/supabase/client';

// Types
export interface AdminStats {
  totalStudents: number;
  freeStudents: number;
  paidStudents: number;
  totalSessions: number;
  upcomingSessions: number;
  todaySession: AdminSession | null;
}

export interface AdminSession {
  id: string;
  title: string;
  description: string;
  scheduled_at: string;
  duration_minutes: number;
  session_type: string;
  is_active: boolean;
  has_zoom_link: boolean;
  batch_name: string;
}

export interface AdminStudent {
  id: string;
  user_id: string;
  email: string;
  is_free: boolean;
  status: string;
  enrolled_at: string;
  batch_name: string;
  batch_id: string;
  completed_lessons: number;
  total_lessons: number;
}

export interface AdminBatch {
  id: string;
  name: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
}

// Hook for admin dashboard stats
export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);

      // Get enrollment counts
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select('id, is_free, status')
        .eq('status', 'active');

      if (enrollError) throw enrollError;

      const totalStudents = enrollments?.length || 0;
      const freeStudents = enrollments?.filter(e => e.is_free).length || 0;
      const paidStudents = totalStudents - freeStudents;

      // Get session counts
      const now = new Date().toISOString();
      const { data: sessions, error: sessionError } = await supabase
        .from('sessions')
        .select('id, scheduled_at')
        .eq('is_active', true);

      if (sessionError) throw sessionError;

      const totalSessions = sessions?.length || 0;
      const upcomingSessions = sessions?.filter(s => s.scheduled_at > now).length || 0;

      // Get all sessions (without foreign key join to avoid 300 error)
      const { data: allSessions, error: allSessionsError } = await supabase
        .from('sessions')
        .select('id, title, description, scheduled_at, duration_minutes, session_type, is_active, zoom_link_encrypted, batch_id')
        .eq('is_active', true)
        .order('scheduled_at', { ascending: true });

      if (allSessionsError) throw allSessionsError;

      // Get batches separately
      const { data: batches, error: batchesError } = await supabase
        .from('batches')
        .select('id, name');

      if (batchesError) throw batchesError;

      const batchMap = new Map((batches || []).map(b => [b.id, b.name]));

      // Filter for today's session on frontend
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const todaySessionData = (allSessions || []).find(s => {
        const sessionDate = new Date(s.scheduled_at);
        return sessionDate >= todayStart && sessionDate <= todayEnd;
      });

      const todaySession: AdminSession | null = todaySessionData ? {
        id: todaySessionData.id,
        title: todaySessionData.title,
        description: todaySessionData.description,
        scheduled_at: todaySessionData.scheduled_at,
        duration_minutes: todaySessionData.duration_minutes,
        session_type: todaySessionData.session_type,
        is_active: todaySessionData.is_active,
        has_zoom_link: !!todaySessionData.zoom_link_encrypted,
        batch_name: batchMap.get(todaySessionData.batch_id) || 'Unknown'
      } : null;

      setStats({
        totalStudents,
        freeStudents,
        paidStudents,
        totalSessions,
        upcomingSessions,
        todaySession
      });

    } catch (err) {
      console.error('Admin stats error:', err);
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

// Hook for managing sessions
export function useAdminSessions() {
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch sessions without foreign key join
      const { data, error: fetchError } = await supabase
        .from('sessions')
        .select('id, title, description, scheduled_at, duration_minutes, session_type, is_active, zoom_link_encrypted, batch_id')
        .eq('is_active', true)
        .order('scheduled_at', { ascending: true });

      if (fetchError) throw fetchError;

      // Fetch batches separately
      const { data: batches, error: batchesError } = await supabase
        .from('batches')
        .select('id, name');

      if (batchesError) throw batchesError;

      const batchMap = new Map((batches || []).map(b => [b.id, b.name]));

      const formattedSessions: AdminSession[] = (data || []).map(s => ({
        id: s.id,
        title: s.title,
        description: s.description,
        scheduled_at: s.scheduled_at,
        duration_minutes: s.duration_minutes,
        session_type: s.session_type,
        is_active: s.is_active,
        has_zoom_link: !!s.zoom_link_encrypted,
        batch_name: batchMap.get(s.batch_id) || 'Unknown'
      }));

      setSessions(formattedSessions);
    } catch (err) {
      console.error('Admin sessions error:', err);
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateZoomLink = async (sessionId: string, zoomLink: string | null) => {
    try {
      const { error: updateError } = await supabase
        .from('sessions')
        .update({
          zoom_link_encrypted: zoomLink,
          zoom_link_expires_at: zoomLink ? new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString() : null
        })
        .eq('id', sessionId);

      if (updateError) throw updateError;

      // Refresh sessions
      await fetchSessions();
      return { error: null };
    } catch (err) {
      console.error('Update zoom link error:', err);
      return { error: 'Failed to update zoom link' };
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('sessions')
        .update({ is_active: false })
        .eq('id', sessionId);

      if (deleteError) throw deleteError;

      await fetchSessions();
      return { error: null };
    } catch (err) {
      console.error('Delete session error:', err);
      return { error: 'Failed to delete session' };
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return { sessions, loading, error, refetch: fetchSessions, updateZoomLink, deleteSession };
}

// Hook for managing students
export function useAdminStudents() {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [batches, setBatches] = useState<AdminBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);

      // Get enrollments without foreign key join
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select('id, user_id, is_free, status, enrolled_at, batch_id')
        .eq('status', 'active')
        .order('enrolled_at', { ascending: false });

      if (enrollError) throw enrollError;

      // Fetch batches for dropdown and lookup
      const { data: batchData, error: batchError } = await supabase
        .from('batches')
        .select('id, name, is_active, start_date, end_date');

      if (batchError) throw batchError;

      const batchMap = new Map((batchData || []).map(b => [b.id, b.name]));
      setBatches((batchData || []).filter(b => b.is_active));

      // Get user emails from auth (need to fetch separately)
      const userIds = enrollments?.map(e => e.user_id) || [];

      // Get lesson progress counts
      const { data: progressData, error: progressError } = await supabase
        .from('lesson_progress')
        .select('user_id, is_completed')
        .in('user_id', userIds);

      if (progressError) throw progressError;

      // Get total lessons count
      const { data: lessonCount, error: lessonError } = await supabase
        .from('lessons')
        .select('id', { count: 'exact' })
        .eq('is_active', true);

      if (lessonError) throw lessonError;
      const totalLessons = lessonCount?.length || 0;

      // Group progress by user
      const progressByUser = new Map<string, number>();
      (progressData || []).forEach(p => {
        if (p.is_completed) {
          progressByUser.set(p.user_id, (progressByUser.get(p.user_id) || 0) + 1);
        }
      });

      // We need to get emails - for now use user_id, you can enhance this later
      const formattedStudents: AdminStudent[] = (enrollments || []).map(e => ({
        id: e.id,
        user_id: e.user_id,
        email: e.user_id.slice(0, 8) + '...', // Placeholder - will need auth admin API for real email
        is_free: e.is_free,
        status: e.status,
        enrolled_at: e.enrolled_at,
        batch_name: batchMap.get(e.batch_id) || 'Unknown',
        batch_id: e.batch_id,
        completed_lessons: progressByUser.get(e.user_id) || 0,
        total_lessons: totalLessons
      }));

      setStudents(formattedStudents);

    } catch (err) {
      console.error('Admin students error:', err);
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFreeStatus = async (enrollmentId: string, isFree: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from('enrollments')
        .update({ is_free: isFree })
        .eq('id', enrollmentId);

      if (updateError) throw updateError;

      await fetchStudents();
      return { error: null };
    } catch (err) {
      console.error('Toggle free status error:', err);
      return { error: 'Failed to update student' };
    }
  };

  const removeStudent = async (enrollmentId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('enrollments')
        .update({ status: 'cancelled' })
        .eq('id', enrollmentId);

      if (updateError) throw updateError;

      await fetchStudents();
      return { error: null };
    } catch (err) {
      console.error('Remove student error:', err);
      return { error: 'Failed to remove student' };
    }
  };

  const addStudent = async (userId: string, batchId: string, isFree: boolean) => {
    try {
      const { error: insertError } = await supabase
        .from('enrollments')
        .insert({
          user_id: userId,
          batch_id: batchId,
          is_free: isFree,
          status: 'active'
        });

      if (insertError) throw insertError;

      await fetchStudents();
      return { error: null };
    } catch (err) {
      console.error('Add student error:', err);
      return { error: 'Failed to add student' };
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { students, batches, loading, error, refetch: fetchStudents, toggleFreeStatus, removeStudent, addStudent };
}

// Hook for fetching lessons (for session creation)
export function useAdminLessons() {
  const [lessons, setLessons] = useState<{ id: string; title: string; topic_name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLessons() {
      // Fetch lessons without foreign key join
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('id, title, topic_id')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (lessonsError) {
        setLoading(false);
        return;
      }

      // Fetch topics separately
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('id, name');

      if (topicsError) {
        setLoading(false);
        return;
      }

      const topicMap = new Map((topicsData || []).map(t => [t.id, t.name]));

      setLessons((lessonsData || []).map(l => ({
        id: l.id,
        title: l.title,
        topic_name: topicMap.get(l.topic_id) || 'Unknown'
      })));

      setLoading(false);
    }

    fetchLessons();
  }, []);

  return { lessons, loading };
}
