import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase/client';
import type { DSAPattern } from '../types';

// Fetch all published patterns (metadata only, no content)
export function usePatterns() {
  const [patterns, setPatterns] = useState<DSAPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatterns = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('dsa_patterns')
        .select('id, title, slug, excerpt, category, difficulty, when_to_use, template_language, time_complexity, space_complexity, example_problems, cover_image_url, tags, status, access_level, display_order, read_time_minutes, author_name, published_at, created_at, updated_at')
        .eq('status', 'published')
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;
      setPatterns((data as DSAPattern[]) || []);
    } catch (err) {
      console.error('Patterns fetch error:', err);
      setError('Failed to load patterns');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatterns();
  }, [fetchPatterns]);

  return { patterns, loading, error, refetch: fetchPatterns };
}

// Fetch a single published pattern by slug (full content)
export function usePatternBySlug(slug: string | undefined) {
  const [pattern, setPattern] = useState<DSAPattern | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    async function fetchPattern() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('dsa_patterns')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (fetchError) throw fetchError;
        setPattern(data as DSAPattern);
      } catch (err) {
        console.error('Pattern fetch error:', err);
        setError('Pattern not found');
      } finally {
        setLoading(false);
      }
    }

    fetchPattern();
  }, [slug]);

  return { pattern, loading, error };
}
