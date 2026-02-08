import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../services/supabase/client';
import type { BlogPost, BlogPostFormData, EditorJSData } from '../../types';
import { generateSlug, calculateReadTime } from '../../utils/blog';

export function useBlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPosts((data as BlogPost[]) || []);
    } catch (err) {
      console.error('Blog admin fetch error:', err);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = async (formData: BlogPostFormData) => {
    try {
      const slug = generateSlug(formData.title);
      const readTime = calculateReadTime(formData.content);
      const now = new Date().toISOString();

      const { data, error: insertError } = await supabase
        .from('blog_posts')
        .insert({
          title: formData.title,
          slug,
          excerpt: formData.excerpt,
          content: formData.content,
          cover_image_url: formData.cover_image_url,
          category: formData.category,
          tags: formData.tags,
          status: formData.status,
          read_time_minutes: readTime,
          author_name: 'Ganesh Patil',
          published_at: formData.status === 'published' ? now : null,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      await fetchPosts();
      return { data: data as BlogPost, error: null };
    } catch (err) {
      console.error('Blog create error:', err);
      return { data: null, error: 'Failed to create post' };
    }
  };

  const updatePost = async (id: string, formData: BlogPostFormData, existingPost: BlogPost) => {
    try {
      const slug = generateSlug(formData.title);
      const readTime = calculateReadTime(formData.content);

      // Set published_at when first publishing
      const publishedAt =
        formData.status === 'published' && !existingPost.published_at
          ? new Date().toISOString()
          : existingPost.published_at;

      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          title: formData.title,
          slug,
          excerpt: formData.excerpt,
          content: formData.content,
          cover_image_url: formData.cover_image_url,
          category: formData.category,
          tags: formData.tags,
          status: formData.status,
          read_time_minutes: readTime,
          published_at: publishedAt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchPosts();
      return { error: null };
    } catch (err) {
      console.error('Blog update error:', err);
      return { error: 'Failed to update post' };
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchPosts();
      return { error: null };
    } catch (err) {
      console.error('Blog delete error:', err);
      return { error: 'Failed to delete post' };
    }
  };

  const uploadImage = async (file: File): Promise<{ url: string | null; error: string | null }> => {
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `blog/${fileName}`;

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

  const fetchPost = useCallback(async (id: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      return { data: data as BlogPost, error: null };
    } catch (err) {
      console.error('Blog fetch single error:', err);
      return { data: null, error: 'Failed to load post' };
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    uploadImage,
  };
}

// Separate hook for single post editing (avoids loading all posts)
export function useBlogPost(id: string | undefined) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchPost() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setPost(data as BlogPost);
      } catch (err) {
        console.error('Blog post fetch error:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  return { post, loading, error };
}

// Helper to get content from EditorJS data for search
export function getPlainText(content: EditorJSData): string {
  return content.blocks
    .map((block) => {
      const text = String(block.data.text || '');
      return text.replace(/<[^>]*>/g, '');
    })
    .join(' ');
}
