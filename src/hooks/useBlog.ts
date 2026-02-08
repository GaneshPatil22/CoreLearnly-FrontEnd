import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase/client';
import type { BlogPost } from '../types';

// Fetch all published posts (metadata only, no content)
export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, cover_image_url, category, tags, status, read_time_minutes, author_name, published_at, created_at, updated_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPosts((data as BlogPost[]) || []);
    } catch (err) {
      console.error('Blog posts fetch error:', err);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts };
}

// Fetch a single published post by slug (full content)
export function useBlogPostBySlug(slug: string | undefined) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    async function fetchPost() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (fetchError) throw fetchError;
        setPost(data as BlogPost);
      } catch (err) {
        console.error('Blog post fetch error:', err);
        setError('Post not found');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  return { post, loading, error };
}
