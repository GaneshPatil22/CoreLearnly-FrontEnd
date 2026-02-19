import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase/client';
import type { Roadmap } from '../types';

export function useRoadmaps() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmaps = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('status', 'published')
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;
      setRoadmaps((data as Roadmap[]) || []);
    } catch (err) {
      console.error('Roadmaps fetch error:', err);
      setError('Failed to load roadmaps');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoadmaps();
  }, [fetchRoadmaps]);

  return { roadmaps, loading, error, refetch: fetchRoadmaps };
}

export function useRoadmapBySlug(slug: string | undefined) {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmap = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (fetchError) throw fetchError;
      setRoadmap(data as Roadmap);
    } catch (err) {
      console.error('Roadmap fetch error:', err);
      setError('Roadmap not found');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  return { roadmap, loading, error, refetch: fetchRoadmap };
}
