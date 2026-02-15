import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../services/supabase/client';
import type { DSAPattern, DSAPatternFormData } from '../../types';
import { generateSlug, calculateReadTime } from '../../utils/blog';

export function usePatternsAdmin() {
  const [patterns, setPatterns] = useState<DSAPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatterns = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('dsa_patterns')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPatterns((data as DSAPattern[]) || []);
    } catch (err) {
      console.error('Patterns admin fetch error:', err);
      setError('Failed to load patterns');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPattern = async (formData: DSAPatternFormData) => {
    try {
      const slug = generateSlug(formData.title);
      const readTime = calculateReadTime(formData.content);
      const now = new Date().toISOString();

      const { data, error: insertError } = await supabase
        .from('dsa_patterns')
        .insert({
          title: formData.title,
          slug,
          excerpt: formData.excerpt,
          category: formData.category,
          difficulty: formData.difficulty,
          when_to_use: formData.when_to_use,
          template_code: formData.template_code,
          template_language: formData.template_language,
          time_complexity: formData.time_complexity,
          space_complexity: formData.space_complexity,
          example_problems: formData.example_problems,
          content: formData.content,
          cover_image_url: formData.cover_image_url,
          tags: formData.tags,
          status: formData.status,
          access_level: formData.access_level,
          display_order: formData.display_order,
          read_time_minutes: readTime,
          author_name: 'Ganesh Patil',
          published_at: formData.status === 'published' ? now : null,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      await fetchPatterns();
      return { data: data as DSAPattern, error: null };
    } catch (err) {
      console.error('Pattern create error:', err);
      return { data: null, error: 'Failed to create pattern' };
    }
  };

  const updatePattern = async (id: string, formData: DSAPatternFormData, existingPattern: DSAPattern) => {
    try {
      const slug = generateSlug(formData.title);
      const readTime = calculateReadTime(formData.content);

      const publishedAt =
        formData.status === 'published' && !existingPattern.published_at
          ? new Date().toISOString()
          : existingPattern.published_at;

      const { error: updateError } = await supabase
        .from('dsa_patterns')
        .update({
          title: formData.title,
          slug,
          excerpt: formData.excerpt,
          category: formData.category,
          difficulty: formData.difficulty,
          when_to_use: formData.when_to_use,
          template_code: formData.template_code,
          template_language: formData.template_language,
          time_complexity: formData.time_complexity,
          space_complexity: formData.space_complexity,
          example_problems: formData.example_problems,
          content: formData.content,
          cover_image_url: formData.cover_image_url,
          tags: formData.tags,
          status: formData.status,
          access_level: formData.access_level,
          display_order: formData.display_order,
          read_time_minutes: readTime,
          published_at: publishedAt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchPatterns();
      return { error: null };
    } catch (err) {
      console.error('Pattern update error:', err);
      return { error: 'Failed to update pattern' };
    }
  };

  const deletePattern = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('dsa_patterns')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchPatterns();
      return { error: null };
    } catch (err) {
      console.error('Pattern delete error:', err);
      return { error: 'Failed to delete pattern' };
    }
  };

  const uploadImage = async (file: File): Promise<{ url: string | null; error: string | null }> => {
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `patterns/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, { cacheControl: '31536000' });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      return { url: urlData.publicUrl, error: null };
    } catch (err) {
      console.error('Image upload error:', err);
      return { url: null, error: 'Failed to upload image' };
    }
  };

  const fetchPattern = useCallback(async (id: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('dsa_patterns')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      return { data: data as DSAPattern, error: null };
    } catch (err) {
      console.error('Pattern fetch single error:', err);
      return { data: null, error: 'Failed to load pattern' };
    }
  }, []);

  useEffect(() => {
    fetchPatterns();
  }, [fetchPatterns]);

  return {
    patterns,
    loading,
    error,
    refetch: fetchPatterns,
    fetchPattern,
    createPattern,
    updatePattern,
    deletePattern,
    uploadImage,
  };
}

// Separate hook for single pattern editing
export function usePatternPost(id: string | undefined) {
  const [pattern, setPattern] = useState<DSAPattern | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchPattern() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('dsa_patterns')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setPattern(data as DSAPattern);
      } catch (err) {
        console.error('Pattern fetch error:', err);
        setError('Failed to load pattern');
      } finally {
        setLoading(false);
      }
    }

    fetchPattern();
  }, [id]);

  return { pattern, loading, error };
}
