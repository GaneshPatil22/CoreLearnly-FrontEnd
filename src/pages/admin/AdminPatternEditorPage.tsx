import { useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Editor } from '@tiptap/react';
import { usePatternsAdmin, usePatternPost } from '../../hooks/admin/usePatternsAdmin';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { PATTERN_CATEGORIES } from '../../types';
import type { PatternCategory, PatternDifficulty, AccessLevel, DSAPatternFormData, TiptapDoc } from '../../types';

const TEMPLATE_LANGUAGES = ['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'swift'];

const AdminPatternEditorPage = () => {
  const { patternId } = useParams<{ patternId: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(patternId);

  const { pattern: existingPattern, loading: patternLoading } = usePatternPost(patternId);

  if (isEditing && patternLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <PatternEditorForm
      key={patternId || 'new'}
      existingPattern={existingPattern}
      isEditing={isEditing}
      patternId={patternId}
      navigate={navigate}
    />
  );
};

function PatternEditorForm({
  existingPattern,
  isEditing,
  patternId,
  navigate,
}: {
  existingPattern: ReturnType<typeof usePatternPost>['pattern'];
  isEditing: boolean;
  patternId: string | undefined;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const { createPattern, updatePattern, uploadImage } = usePatternsAdmin();

  const editorRef = useRef<Editor | null>(null);
  const [title, setTitle] = useState(existingPattern?.title || '');
  const [excerpt, setExcerpt] = useState(existingPattern?.excerpt || '');
  const [whenToUse, setWhenToUse] = useState(existingPattern?.when_to_use || '');
  const [templateCode, setTemplateCode] = useState(existingPattern?.template_code || '');
  const [templateLanguage, setTemplateLanguage] = useState(existingPattern?.template_language || 'javascript');
  const [timeComplexity, setTimeComplexity] = useState(existingPattern?.time_complexity || '');
  const [spaceComplexity, setSpaceComplexity] = useState(existingPattern?.space_complexity || '');
  const [exampleProblemsInput, setExampleProblemsInput] = useState(existingPattern?.example_problems.join(', ') || '');
  const [coverImageUrl, setCoverImageUrl] = useState(existingPattern?.cover_image_url || '');
  const [category, setCategory] = useState<PatternCategory>(existingPattern?.category || 'Arrays');
  const [difficulty, setDifficulty] = useState<PatternDifficulty>(existingPattern?.difficulty || 'medium');
  const [tagsInput, setTagsInput] = useState(existingPattern?.tags.join(', ') || '');
  const [status, setStatus] = useState<'draft' | 'published'>(existingPattern?.status || 'draft');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(existingPattern?.access_level || 'free');
  const [displayOrder, setDisplayOrder] = useState(existingPattern?.display_order || 0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editorReady, setEditorReady] = useState(false);

  const initialTiptapContent: TiptapDoc | undefined = existingPattern?.content as TiptapDoc | undefined;

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

    let content: TiptapDoc = { type: 'doc', content: [{ type: 'paragraph' }] };
    if (editorRef.current && editorReady) {
      content = editorRef.current.getJSON() as TiptapDoc;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const exampleProblems = exampleProblemsInput
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const formData: DSAPatternFormData = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      category,
      difficulty,
      when_to_use: whenToUse.trim(),
      template_code: templateCode,
      template_language: templateLanguage,
      time_complexity: timeComplexity.trim(),
      space_complexity: spaceComplexity.trim(),
      example_problems: exampleProblems,
      content,
      cover_image_url: coverImageUrl || null,
      tags,
      status,
      access_level: accessLevel,
      display_order: displayOrder,
    };

    if (isEditing && existingPattern) {
      const result = await updatePattern(existingPattern.id, formData, existingPattern);
      if (result.error) {
        setSaveError(result.error);
      } else {
        navigate('/admin/patterns');
      }
    } else {
      const result = await createPattern(formData);
      if (result.error) {
        setSaveError(result.error);
      } else {
        navigate('/admin/patterns');
      }
    }

    setSaving(false);
  };

  // Lazy import TiptapEditor
  const TiptapEditor = useRef<typeof import('../../components/admin/TiptapEditor').default | null>(null);
  const [editorLoaded, setEditorLoaded] = useState(false);

  if (!editorLoaded) {
    import('../../components/admin/TiptapEditor').then((mod) => {
      TiptapEditor.current = mod.default;
      setEditorLoaded(true);
    });
  }

  return (
    <div className="space-y-6">
      <SEO
        title={isEditing ? 'Edit Pattern' : 'New Pattern'}
        description="Pattern editor"
        path={isEditing ? `/admin/patterns/edit/${patternId}` : '/admin/patterns/new'}
        noIndex
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Pattern' : 'New Pattern'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/patterns')}
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
              placeholder="Pattern title"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white text-xl font-bold placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Excerpt */}
          <div>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief description of this pattern..."
              rows={2}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* When to Use */}
          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              When to Use
            </label>
            <textarea
              value={whenToUse}
              onChange={(e) => setWhenToUse(e.target.value)}
              placeholder="Describe when this pattern is most useful..."
              rows={3}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Template Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-dark-text-secondary">
                Template Code
              </label>
              <select
                value={templateLanguage}
                onChange={(e) => setTemplateLanguage(e.target.value)}
                className="bg-dark-bg border border-dark-border rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-primary transition-colors"
              >
                {TEMPLATE_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={templateCode}
              onChange={(e) => setTemplateCode(e.target.value)}
              placeholder="// Pattern template code..."
              rows={10}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors font-mono text-sm resize-none"
            />
          </div>

          {/* Detailed Explanation (Tiptap Editor) */}
          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Detailed Explanation
            </label>
            {editorLoaded && TiptapEditor.current ? (
              <TiptapEditor.current
                initialContent={initialTiptapContent}
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
              onChange={(e) => setCategory(e.target.value as PatternCategory)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
            >
              {PATTERN_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div className="card">
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Difficulty
            </label>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    difficulty === d
                      ? d === 'easy'
                        ? 'bg-green-400/20 text-green-400'
                        : d === 'medium'
                          ? 'bg-yellow-400/20 text-yellow-400'
                          : 'bg-red-400/20 text-red-400'
                      : 'bg-dark-bg text-dark-text-muted hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Complexity */}
          <div className="card">
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Time Complexity
            </label>
            <input
              type="text"
              value={timeComplexity}
              onChange={(e) => setTimeComplexity(e.target.value)}
              placeholder="e.g. O(n)"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors mb-3"
            />
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Space Complexity
            </label>
            <input
              type="text"
              value={spaceComplexity}
              onChange={(e) => setSpaceComplexity(e.target.value)}
              placeholder="e.g. O(1)"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Example Problems */}
          <div className="card">
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Example Problems
            </label>
            <input
              type="text"
              value={exampleProblemsInput}
              onChange={(e) => setExampleProblemsInput(e.target.value)}
              placeholder="e.g. Two Sum, 3Sum, Container With Most Water"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors"
            />
            <p className="text-xs text-dark-text-muted mt-1">Comma separated</p>
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
              placeholder="e.g. arrays, two-pointers, beginner"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors"
            />
            <p className="text-xs text-dark-text-muted mt-1">Comma separated</p>
          </div>

          {/* Access Level */}
          <div className="card">
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Access Level
            </label>
            <select
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value as AccessLevel)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="free">Free</option>
              <option value="preview">Preview</option>
              <option value="full">Full (Paid)</option>
            </select>
          </div>

          {/* Display Order */}
          <div className="card">
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPatternEditorPage;
