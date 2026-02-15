import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../services/supabase/client';
import type { RoadmapPhase, RoadmapPhaseFormData, RoadmapNode, RoadmapNodeFormData, DSAPattern } from '../../types';
import { generateSlug } from '../../utils/blog';

export function useRoadmapAdmin() {
  const [phases, setPhases] = useState<RoadmapPhase[]>([]);
  const [nodes, setNodes] = useState<RoadmapNode[]>([]);
  const [patterns, setPatterns] = useState<DSAPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);

      const [phasesRes, nodesRes, patternsRes] = await Promise.all([
        supabase.from('roadmap_phases').select('*').order('display_order', { ascending: true }),
        supabase.from('roadmap_nodes').select('*').order('display_order', { ascending: true }),
        supabase.from('dsa_patterns').select('id, title, slug, category, difficulty, status').eq('status', 'published').order('title', { ascending: true }),
      ]);

      if (phasesRes.error) throw phasesRes.error;
      if (nodesRes.error) throw nodesRes.error;

      setPhases((phasesRes.data as RoadmapPhase[]) || []);
      setNodes((nodesRes.data as RoadmapNode[]) || []);
      setPatterns((patternsRes.data as DSAPattern[]) || []);
    } catch (err) {
      console.error('Roadmap admin fetch error:', err);
      setError('Failed to load roadmap data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Phase CRUD
  const createPhase = async (formData: RoadmapPhaseFormData) => {
    try {
      const slug = generateSlug(formData.title);
      const now = new Date().toISOString();

      const { error: insertError } = await supabase
        .from('roadmap_phases')
        .insert({
          title: formData.title,
          slug,
          description: formData.description,
          phase_level: formData.phase_level,
          display_order: formData.display_order,
          icon_name: formData.icon_name,
          status: formData.status,
          created_at: now,
          updated_at: now,
        });

      if (insertError) throw insertError;
      await fetchAll();
      return { error: null };
    } catch (err) {
      console.error('Phase create error:', err);
      return { error: 'Failed to create phase' };
    }
  };

  const updatePhase = async (id: string, formData: RoadmapPhaseFormData) => {
    try {
      const slug = generateSlug(formData.title);

      const { error: updateError } = await supabase
        .from('roadmap_phases')
        .update({
          title: formData.title,
          slug,
          description: formData.description,
          phase_level: formData.phase_level,
          display_order: formData.display_order,
          icon_name: formData.icon_name,
          status: formData.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchAll();
      return { error: null };
    } catch (err) {
      console.error('Phase update error:', err);
      return { error: 'Failed to update phase' };
    }
  };

  const deletePhase = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('roadmap_phases')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchAll();
      return { error: null };
    } catch (err) {
      console.error('Phase delete error:', err);
      return { error: 'Failed to delete phase' };
    }
  };

  // Node CRUD
  const createNode = async (formData: RoadmapNodeFormData) => {
    try {
      const slug = generateSlug(formData.title);
      const now = new Date().toISOString();

      const { error: insertError } = await supabase
        .from('roadmap_nodes')
        .insert({
          phase_id: formData.phase_id,
          title: formData.title,
          slug,
          description: formData.description,
          display_order: formData.display_order,
          pattern_ids: formData.pattern_ids,
          access_level: formData.access_level,
          status: formData.status,
          created_at: now,
          updated_at: now,
        });

      if (insertError) throw insertError;
      await fetchAll();
      return { error: null };
    } catch (err) {
      console.error('Node create error:', err);
      return { error: 'Failed to create node' };
    }
  };

  const updateNode = async (id: string, formData: RoadmapNodeFormData) => {
    try {
      const slug = generateSlug(formData.title);

      const { error: updateError } = await supabase
        .from('roadmap_nodes')
        .update({
          phase_id: formData.phase_id,
          title: formData.title,
          slug,
          description: formData.description,
          display_order: formData.display_order,
          pattern_ids: formData.pattern_ids,
          access_level: formData.access_level,
          status: formData.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchAll();
      return { error: null };
    } catch (err) {
      console.error('Node update error:', err);
      return { error: 'Failed to update node' };
    }
  };

  const deleteNode = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('roadmap_nodes')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchAll();
      return { error: null };
    } catch (err) {
      console.error('Node delete error:', err);
      return { error: 'Failed to delete node' };
    }
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    phases,
    nodes,
    patterns,
    loading,
    error,
    refetch: fetchAll,
    createPhase,
    updatePhase,
    deletePhase,
    createNode,
    updateNode,
    deleteNode,
  };
}
