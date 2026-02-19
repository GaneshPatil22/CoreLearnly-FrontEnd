import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../services/supabase/client';
import type { Roadmap, RoadmapFormData } from '../../types';
import { generateSlug } from '../../utils/blog';

export function useRoadmapsAdmin() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmaps = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('roadmaps')
        .select('*')
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;
      setRoadmaps((data as Roadmap[]) || []);
    } catch (err) {
      console.error('Roadmaps admin fetch error:', err);
      setError('Failed to load roadmaps');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRoadmap = useCallback(async (id: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      return { data: data as Roadmap, error: null };
    } catch (err) {
      console.error('Roadmap fetch single error:', err);
      return { data: null, error: 'Failed to load roadmap' };
    }
  }, []);

  const createRoadmap = async (formData: RoadmapFormData) => {
    try {
      const slug = generateSlug(formData.title);
      const now = new Date().toISOString();

      const { data, error: insertError } = await supabase
        .from('roadmaps')
        .insert({
          title: formData.title,
          slug,
          description: formData.description,
          cover_image_url: formData.cover_image_url,
          icon_name: formData.icon_name,
          gradient_from: formData.gradient_from,
          gradient_to: formData.gradient_to,
          difficulty_level: formData.difficulty_level,
          estimated_duration: formData.estimated_duration,
          status: formData.status,
          display_order: formData.display_order,
          is_featured: formData.is_featured,
          total_patterns: 0,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      await fetchRoadmaps();
      return { data: data as Roadmap, error: null };
    } catch (err) {
      console.error('Roadmap create error:', err);
      return { data: null, error: 'Failed to create roadmap' };
    }
  };

  const updateRoadmap = async (id: string, formData: RoadmapFormData) => {
    try {
      const slug = generateSlug(formData.title);

      const { error: updateError } = await supabase
        .from('roadmaps')
        .update({
          title: formData.title,
          slug,
          description: formData.description,
          cover_image_url: formData.cover_image_url,
          icon_name: formData.icon_name,
          gradient_from: formData.gradient_from,
          gradient_to: formData.gradient_to,
          difficulty_level: formData.difficulty_level,
          estimated_duration: formData.estimated_duration,
          status: formData.status,
          display_order: formData.display_order,
          is_featured: formData.is_featured,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchRoadmaps();
      return { error: null };
    } catch (err) {
      console.error('Roadmap update error:', err);
      return { error: 'Failed to update roadmap' };
    }
  };

  const deleteRoadmap = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('roadmaps')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchRoadmaps();
      return { error: null };
    } catch (err) {
      console.error('Roadmap delete error:', err);
      return { error: 'Failed to delete roadmap' };
    }
  };

  const uploadCoverImage = async (file: File): Promise<{ url: string | null; error: string | null }> => {
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `roadmaps/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, { cacheControl: '31536000' });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      return { url: urlData.publicUrl, error: null };
    } catch (err) {
      console.error('Cover image upload error:', err);
      return { url: null, error: 'Failed to upload image' };
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, [fetchRoadmaps]);

  return {
    roadmaps,
    loading,
    error,
    refetch: fetchRoadmaps,
    fetchRoadmap,
    createRoadmap,
    updateRoadmap,
    deleteRoadmap,
    uploadCoverImage,
  };
}
