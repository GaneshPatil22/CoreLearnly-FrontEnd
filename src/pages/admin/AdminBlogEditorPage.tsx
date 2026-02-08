import { useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditorJS from '@editorjs/editorjs';
import { useBlogAdmin, useBlogPost } from '../../hooks/admin/useBlogAdmin';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { BLOG_CATEGORIES } from '../../types';
import type { BlogCategory, BlogPostFormData, EditorJSData } from '../../types';

const AdminBlogEditorPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(postId);

  const { post: existingPost, loading: postLoading } = useBlogPost(postId);

  if (isEditing && postLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <BlogEditorForm
      key={postId || 'new'}
      existingPost={existingPost}
      isEditing={isEditing}
      postId={postId}
      navigate={navigate}
    />
  );
};

// Separate form component so it mounts with initial values from existingPost
function BlogEditorForm({
  existingPost,
  isEditing,
  postId,
  navigate,
}: {
  existingPost: ReturnType<typeof useBlogPost>['post'];
  isEditing: boolean;
  postId: string | undefined;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const { createPost, updatePost, uploadImage } = useBlogAdmin();

  const editorRef = useRef<EditorJS | null>(null);
  const [title, setTitle] = useState(existingPost?.title || '');
  const [excerpt, setExcerpt] = useState(existingPost?.excerpt || '');
  const [coverImageUrl, setCoverImageUrl] = useState(existingPost?.cover_image_url || '');
  const [category, setCategory] = useState<BlogCategory>(existingPost?.category || 'DSA');
  const [tagsInput, setTagsInput] = useState(existingPost?.tags.join(', ') || '');
  const [status, setStatus] = useState<'draft' | 'published'>(existingPost?.status || 'draft');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editorReady, setEditorReady] = useState(false);

  const handleUploadImage = useCallback(
    async (file: File) => {
      return uploadImage(file);
    },
    [uploadImage],
  );

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await uploadImage(file);
    if (result.url) {
      setCoverImageUrl(result.url);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setSaveError('Title is required');
      return;
    }

    setSaving(true);
    setSaveError(null);

    let content: EditorJSData = { blocks: [] };
    if (editorRef.current && editorReady) {
      try {
        content = (await editorRef.current.save()) as EditorJSData;
      } catch {
        setSaveError('Failed to save editor content');
        setSaving(false);
        return;
      }
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const formData: BlogPostFormData = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      content,
      cover_image_url: coverImageUrl || null,
      category,
      tags,
      status,
    };

    if (isEditing && existingPost) {
      const result = await updatePost(existingPost.id, formData, existingPost);
      if (result.error) {
        setSaveError(result.error);
      } else {
        navigate('/admin/blog');
      }
    } else {
      const result = await createPost(formData);
      if (result.error) {
        setSaveError(result.error);
      } else {
        navigate('/admin/blog');
      }
    }

    setSaving(false);
  };

  // Lazy import BlogEditor to avoid loading Editor.js on every admin page
  const BlogEditor = useRef<typeof import('../../components/admin/BlogEditor').default | null>(null);
  const [editorLoaded, setEditorLoaded] = useState(false);

  if (!editorLoaded) {
    import('../../components/admin/BlogEditor').then((mod) => {
      BlogEditor.current = mod.default;
      setEditorLoaded(true);
    });
  }

  return (
    <div className="space-y-6">
      <SEO
        title={isEditing ? 'Edit Post' : 'New Post'}
        description="Blog editor"
        path={isEditing ? `/admin/blog/edit/${postId}` : '/admin/blog/new'}
        noIndex
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Post' : 'New Post'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/blog')}
            className="px-4 py-2 text-sm text-dark-text-secondary hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="p-3 bg-red-400/10 border border-red-400/20 rounded-lg text-red-400 text-sm">
          {saveError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white text-xl font-bold placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Excerpt */}
          <div>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief excerpt or summary..."
              rows={3}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Editor */}
          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Content
            </label>
            {editorLoaded && BlogEditor.current ? (
              <BlogEditor.current
                initialData={existingPost?.content}
                onReady={() => setEditorReady(true)}
                onUploadImage={handleUploadImage}
                editorRef={editorRef}
              />
            ) : (
              <div className="min-h-[400px] bg-dark-bg border border-dark-border rounded-lg p-4 flex items-center justify-center">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="card">
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Status
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setStatus('draft')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  status === 'draft'
                    ? 'bg-yellow-400/20 text-yellow-400'
                    : 'bg-dark-bg text-dark-text-muted hover:text-white'
                }`}
              >
                Draft
              </button>
              <button
                onClick={() => setStatus('published')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  status === 'published'
                    ? 'bg-green-400/20 text-green-400'
                    : 'bg-dark-bg text-dark-text-muted hover:text-white'
                }`}
              >
                Published
              </button>
            </div>
          </div>

          {/* Cover Image */}
          <div className="card">
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Cover Image
            </label>
            {coverImageUrl ? (
              <div className="relative mb-3">
                <img
                  src={coverImageUrl}
                  alt="Cover"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  onClick={() => setCoverImageUrl('')}
                  className="absolute top-2 right-2 w-6 h-6 bg-dark-bg/80 rounded-full flex items-center justify-center text-dark-text-muted hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
            ) : null}
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageUpload}
              className="w-full text-sm text-dark-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-dark-border file:text-dark-text-secondary hover:file:bg-dark-border/80"
            />
          </div>

          {/* Category */}
          <div className="card">
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BlogCategory)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
            >
              {BLOG_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="card">
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Tags
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. arrays, sorting, beginner"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors"
            />
            <p className="text-xs text-dark-text-muted mt-1">Comma separated</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminBlogEditorPage;
