import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase/client';
import type { RoadmapPhase, RoadmapNode, DSAPattern, UserPatternProgress } from '../types';
import { useAuth } from '../context/auth/AuthContext';

export interface RoadmapPhaseWithNodes extends RoadmapPhase {
  nodes: RoadmapNodeWithPatterns[];
}

export interface RoadmapNodeWithPatterns extends RoadmapNode {
  patterns: DSAPattern[];
}

// Fetch published roadmap phases + nodes, enriched with pattern metadata
export function useRoadmap(roadmapId: string | undefined) {
  const [phases, setPhases] = useState<RoadmapPhaseWithNodes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmap = useCallback(async () => {
    if (!roadmapId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch phases scoped to this roadmap
      const { data: phasesData, error: phasesError } = await supabase
        .from('roadmap_phases')
        .select('*')
        .eq('roadmap_id', roadmapId)
        .eq('status', 'published')
        .order('display_order', { ascending: true });

      if (phasesError) throw phasesError;

      // Fetch nodes
      const { data: nodesData, error: nodesError } = await supabase
        .from('roadmap_nodes')
        .select('*')
        .eq('status', 'published')
        .order('display_order', { ascending: true });

      if (nodesError) throw nodesError;

      // Collect all pattern IDs from nodes
      const allPatternIds = new Set<string>();
      for (const node of (nodesData || [])) {
        for (const pid of (node.pattern_ids || [])) {
          allPatternIds.add(pid);
        }
      }

      // Fetch pattern metadata (no content)
      let patternsMap = new Map<string, DSAPattern>();
      if (allPatternIds.size > 0) {
        const { data: patternsData } = await supabase
          .from('dsa_patterns')
          .select('id, title, slug, excerpt, category, difficulty, time_complexity, space_complexity, tags, status, access_level, display_order, read_time_minutes, author_name, published_at, created_at, updated_at')
          .in('id', Array.from(allPatternIds))
          .eq('status', 'published');

        if (patternsData) {
          patternsMap = new Map(patternsData.map((p) => [p.id, p as DSAPattern]));
        }
      }

      // Merge nodes into phases
      const nodesTyped = (nodesData || []) as RoadmapNode[];
      const phasesWithNodes: RoadmapPhaseWithNodes[] = ((phasesData || []) as RoadmapPhase[]).map((phase) => {
        const phaseNodes: RoadmapNodeWithPatterns[] = nodesTyped
          .filter((n) => n.phase_id === phase.id)
          .map((node) => ({
            ...node,
            patterns: (node.pattern_ids || [])
              .map((pid) => patternsMap.get(pid))
              .filter((p): p is DSAPattern => p !== undefined),
          }));

        return { ...phase, nodes: phaseNodes };
      });

      setPhases(phasesWithNodes);
    } catch (err) {
      console.error('Roadmap fetch error:', err);
      setError('Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  }, [roadmapId]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  return { phases, loading, error, refetch: fetchRoadmap };
}

// Progress tracking hook for logged-in users
export function usePatternProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserPatternProgress[]>([]);

  const fetchProgress = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error: fetchError } = await supabase
        .from('user_pattern_progress')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;
      setProgress((data as UserPatternProgress[]) || []);
    } catch (err) {
      console.error('Progress fetch error:', err);
    }
  }, [user]);

  const toggleProgress = useCallback(async (patternId: string) => {
    if (!user) return;

    const existing = progress.find((p) => p.pattern_id === patternId);

    if (existing) {
      if (existing.is_completed) {
        // Mark as incomplete
        await supabase
          .from('user_pattern_progress')
          .update({ is_completed: false, completed_at: null })
          .eq('id', existing.id);
      } else {
        // Mark as complete
        await supabase
          .from('user_pattern_progress')
          .update({ is_completed: true, completed_at: new Date().toISOString() })
          .eq('id', existing.id);
      }
    } else {
      // Insert new progress
      await supabase
        .from('user_pattern_progress')
        .insert({
          user_id: user.id,
          pattern_id: patternId,
          is_completed: true,
          completed_at: new Date().toISOString(),
        });
    }

    await fetchProgress();
  }, [user, progress, fetchProgress]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { progress, toggleProgress, refetch: fetchProgress };
}
