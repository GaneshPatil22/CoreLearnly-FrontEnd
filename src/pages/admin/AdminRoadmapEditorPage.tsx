import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRoadmapsAdmin } from '../../hooks/admin/useRoadmapsAdmin';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import type { RoadmapDifficulty, RoadmapFormData } from '../../types';

const AdminRoadmapEditorPage = () => {
  const { roadmapId } = useParams<{ roadmapId: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(roadmapId);
  const { fetchRoadmap, createRoadmap, updateRoadmap, uploadCoverImage } = useRoadmapsAdmin();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [iconName, setIconName] = useState('map');
  const [gradientFrom, setGradientFrom] = useState('#6366f1');
  const [gradientTo, setGradientTo] = useState('#8b5cf6');
  const [difficultyLevel, setDifficultyLevel] = useState<RoadmapDifficulty>('mixed');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  // Load existing roadmap data
  useEffect(() => {
    if (!roadmapId) return;
    (async () => {
      const result = await fetchRoadmap(roadmapId);
      if (result.data) {
        setTitle(result.data.title);
        setDescription(result.data.description);
        setCoverImageUrl(result.data.cover_image_url);
        setIconName(result.data.icon_name);
        setGradientFrom(result.data.gradient_from);
        setGradientTo(result.data.gradient_to);
        setDifficultyLevel(result.data.difficulty_level);
        setEstimatedDuration(result.data.estimated_duration);
        setDisplayOrder(result.data.display_order);
        setIsFeatured(result.data.is_featured);
        setStatus(result.data.status);
      }
      setLoading(false);
    })();
  }, [roadmapId, fetchRoadmap]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const result = await uploadCoverImage(file);
    if (result.url) {
      setCoverImageUrl(result.url);
    }
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setSaving(true);

    const formData: RoadmapFormData = {
      title: title.trim(),
      description: description.trim(),
      cover_image_url: coverImageUrl,
      icon_name: iconName,
      gradient_from: gradientFrom,
      gradient_to: gradientTo,
      difficulty_level: difficultyLevel,
      estimated_duration: estimatedDuration.trim(),
      display_order: displayOrder,
      is_featured: isFeatured,
      status,
    };

    if (isEditing && roadmapId) {
      const result = await updateRoadmap(roadmapId, formData);
      if (!result.error) {
        navigate('/admin/roadmaps');
      }
    } else {
      const result = await createRoadmap(formData);
      if (!result.error) {
        navigate('/admin/roadmaps');
      }
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <SEO
        title={isEditing ? 'Edit Roadmap' : 'New Roadmap'}
        description="Create or edit a roadmap"
        path={isEditing ? `/admin/roadmaps/edit/${roadmapId}` : '/admin/roadmaps/new'}
        noIndex
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{isEditing ? 'Edit Roadmap' : 'New Roadmap'}</h1>
          <button
            onClick={() => navigate('/admin/roadmaps')}
            className="text-sm text-dark-text-muted hover:text-white transition-colors mt-1"
          >
            &larr; Back to Roadmaps
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-dark-text-muted mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Roadmap title"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white text-sm placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-dark-text-muted mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Roadmap description"
              rows={3}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white text-sm placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Cover Image */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-dark-text-muted mb-1">Cover Image</label>
            <div className="flex items-center gap-4">
              {coverImageUrl && (
                <img src={coverImageUrl} alt="Cover" className="w-24 h-16 object-cover rounded-lg" />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-dark-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                {uploading && <p className="text-xs text-dark-text-muted mt-1">Uploading...</p>}
              </div>
              {coverImageUrl && (
                <button
                  onClick={() => setCoverImageUrl(null)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Icon Name */}
          <div>
            <label className="block text-xs font-medium text-dark-text-muted mb-1">Icon Name</label>
            <input
              type="text"
              value={iconName}
              onChange={(e) => setIconName(e.target.value)}
              placeholder="e.g. rocket, star, fire, brain, target, map"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white text-sm placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-medium text-dark-text-muted mb-1">Difficulty Level</label>
            <select
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value as RoadmapDifficulty)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          {/* Gradient Colors */}
          <div>
            <label className="block text-xs font-medium text-dark-text-muted mb-1">Gradient From</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={gradientFrom}
                onChange={(e) => setGradientFrom(e.target.value)}
                className="w-10 h-10 rounded-lg border border-dark-border cursor-pointer"
              />
              <input
                type="text"
                value={gradientFrom}
                onChange={(e) => setGradientFrom(e.target.value)}
                className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-dark-text-muted mb-1">Gradient To</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={gradientTo}
                onChange={(e) => setGradientTo(e.target.value)}
                className="w-10 h-10 rounded-lg border border-dark-border cursor-pointer"
              />
              <input
                type="text"
                value={gradientTo}
                onChange={(e) => setGradientTo(e.target.value)}
                className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Gradient Preview */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-dark-text-muted mb-1">Gradient Preview</label>
            <div
              className="w-full h-16 rounded-lg"
              style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
            />
          </div>

          {/* Estimated Duration */}
          <div>
            <label className="block text-xs font-medium text-dark-text-muted mb-1">Estimated Duration</label>
            <input
              type="text"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              placeholder="e.g. 3-6 months"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white text-sm placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-xs font-medium text-dark-text-muted mb-1">Display Order</label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Is Featured */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-dark-border"
              />
              <span className="text-sm text-dark-text-secondary">Featured Roadmap</span>
            </label>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-dark-text-muted mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-dark-border">
          <button
            onClick={() => navigate('/admin/roadmaps')}
            className="px-4 py-2 text-sm text-dark-text-secondary hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !title.trim()}
            className="px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : isEditing ? 'Update Roadmap' : 'Create Roadmap'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRoadmapEditorPage;
