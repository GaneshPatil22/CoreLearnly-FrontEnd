import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRoadmapAdmin } from '../../hooks/admin/useRoadmapAdmin';
import { getPhaseColor } from '../../utils/pattern';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import type { PhaseLevel, AccessLevel, RoadmapPhaseFormData, RoadmapNodeFormData, RoadmapPhase, RoadmapNode } from '../../types';

const AdminRoadmapPage = () => {
  const { roadmapId } = useParams<{ roadmapId: string }>();
  const {
    phases,
    nodes,
    patterns,
    loading,
    error,
    createPhase,
    updatePhase,
    deletePhase,
    createNode,
    updateNode,
    deleteNode,
  } = useRoadmapAdmin(roadmapId);

  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [editingPhase, setEditingPhase] = useState<RoadmapPhase | null>(null);
  const [showPhaseForm, setShowPhaseForm] = useState(false);
  const [editingNode, setEditingNode] = useState<{ node: RoadmapNode; phaseId: string } | null>(null);
  const [showNodeForm, setShowNodeForm] = useState<string | null>(null); // phaseId

  const toggleExpanded = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) next.delete(phaseId);
      else next.add(phaseId);
      return next;
    });
  };

  const handleDeletePhase = async (id: string, title: string) => {
    if (!confirm(`Delete phase "${title}" and all its nodes? This cannot be undone.`)) return;
    await deletePhase(id);
  };

  const handleDeleteNode = async (id: string, title: string) => {
    if (!confirm(`Delete node "${title}"? This cannot be undone.`)) return;
    await deleteNode(id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SEO
        title="Manage Phases & Nodes"
        description="Manage roadmap phases and nodes"
        path={`/admin/roadmaps/${roadmapId}/manage`}
        noIndex
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/admin/roadmaps" className="text-sm text-dark-text-muted hover:text-white transition-colors">
            &larr; Back to Roadmaps
          </Link>
          <h1 className="text-2xl font-bold text-white mt-1">Manage Phases & Nodes</h1>
          <p className="text-dark-text-muted mt-1">
            {phases.length} phases &middot; {nodes.length} nodes
          </p>
        </div>
        <button
          onClick={() => { setEditingPhase(null); setShowPhaseForm(true); }}
          className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Add Phase
        </button>
      </div>

      {/* Phase Form Modal */}
      {showPhaseForm && roadmapId && (
        <PhaseFormCard
          existing={editingPhase}
          roadmapId={roadmapId}
          onSave={async (formData) => {
            if (editingPhase) {
              await updatePhase(editingPhase.id, formData);
            } else {
              await createPhase(formData);
            }
            setShowPhaseForm(false);
            setEditingPhase(null);
          }}
          onCancel={() => { setShowPhaseForm(false); setEditingPhase(null); }}
        />
      )}

      {/* Phases Accordion */}
      {phases.length === 0 ? (
        <div className="text-center py-12 text-dark-text-muted">
          <p>No phases yet. Create your first phase to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {phases.map((phase) => {
            const phaseNodes = nodes.filter((n) => n.phase_id === phase.id);
            const isExpanded = expandedPhases.has(phase.id);

            return (
              <div key={phase.id} className="card">
                {/* Phase Header */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleExpanded(phase.id)}
                    className="flex-1 flex items-center gap-3 text-left"
                  >
                    <svg
                      className={`w-5 h-5 text-dark-text-muted transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">{phase.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getPhaseColor(phase.phase_level)}`}>
                          {phase.phase_level}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            phase.status === 'published'
                              ? 'bg-green-400/10 text-green-400'
                              : 'bg-yellow-400/10 text-yellow-400'
                          }`}
                        >
                          {phase.status}
                        </span>
                      </div>
                      <p className="text-sm text-dark-text-muted mt-0.5">
                        {phaseNodes.length} nodes &middot; Order: {phase.display_order}
                      </p>
                    </div>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditingPhase(phase); setShowPhaseForm(true); }}
                      className="px-3 py-1.5 text-sm text-dark-text-secondary hover:text-white bg-dark-border rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePhase(phase.id, phase.title)}
                      className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Expanded: Nodes */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-dark-border space-y-3">
                    {phaseNodes.length === 0 ? (
                      <p className="text-sm text-dark-text-muted">No nodes in this phase.</p>
                    ) : (
                      phaseNodes.map((node) => (
                        <div
                          key={node.id}
                          className="flex items-center justify-between bg-dark-bg rounded-lg px-4 py-3"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-white text-sm font-medium truncate">{node.title}</h4>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  node.status === 'published'
                                    ? 'bg-green-400/10 text-green-400'
                                    : 'bg-yellow-400/10 text-yellow-400'
                                }`}
                              >
                                {node.status}
                              </span>
                            </div>
                            <p className="text-xs text-dark-text-muted mt-0.5">
                              {node.pattern_ids.length} patterns linked &middot; Order: {node.display_order} &middot; Access: {node.access_level}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => setEditingNode({ node, phaseId: phase.id })}
                              className="px-2 py-1 text-xs text-dark-text-secondary hover:text-white bg-dark-border rounded transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteNode(node.id, node.title)}
                              className="px-2 py-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                    <button
                      onClick={() => { setEditingNode(null); setShowNodeForm(phase.id); }}
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      + Add Node
                    </button>

                    {/* Inline Node Form */}
                    {(showNodeForm === phase.id || editingNode?.phaseId === phase.id) && (
                      <NodeFormCard
                        phaseId={phase.id}
                        existing={editingNode?.phaseId === phase.id ? editingNode.node : null}
                        allPatterns={patterns}
                        onSave={async (formData) => {
                          if (editingNode?.phaseId === phase.id) {
                            await updateNode(editingNode.node.id, formData);
                          } else {
                            await createNode(formData);
                          }
                          setShowNodeForm(null);
                          setEditingNode(null);
                        }}
                        onCancel={() => { setShowNodeForm(null); setEditingNode(null); }}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Phase form inline card
function PhaseFormCard({
  existing,
  roadmapId,
  onSave,
  onCancel,
}: {
  existing: RoadmapPhase | null;
  roadmapId: string;
  onSave: (data: RoadmapPhaseFormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(existing?.title || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [phaseLevel, setPhaseLevel] = useState<PhaseLevel>(existing?.phase_level || 'beginner');
  const [displayOrder, setDisplayOrder] = useState(existing?.display_order || 0);
  const [iconName, setIconName] = useState(existing?.icon_name || 'book');
  const [status, setStatus] = useState<'draft' | 'published'>(existing?.status || 'draft');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setSaving(true);
    await onSave({
      roadmap_id: roadmapId,
      title: title.trim(),
      description: description.trim(),
      phase_level: phaseLevel,
      display_order: displayOrder,
      icon_name: iconName,
      status,
    });
    setSaving(false);
  };

  return (
    <div className="card border-primary/30">
      <h3 className="text-white font-medium mb-4">{existing ? 'Edit Phase' : 'New Phase'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-dark-text-muted mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Phase title"
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white text-sm placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-dark-text-muted mb-1">Level</label>
          <select
            value={phaseLevel}
            onChange={(e) => setPhaseLevel(e.target.value as PhaseLevel)}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-dark-text-muted mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Phase description"
            rows={2}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white text-sm placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-dark-text-muted mb-1">Display Order</label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-dark-text-muted mb-1">Icon Name</label>
          <input
            type="text"
            value={iconName}
            onChange={(e) => setIconName(e.target.value)}
            placeholder="e.g. book, rocket, star"
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white text-sm placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>
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
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-sm text-dark-text-secondary hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving || !title.trim()}
          className="px-4 py-1.5 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}

// Node form inline card
function NodeFormCard({
  phaseId,
  existing,
  allPatterns,
  onSave,
  onCancel,
}: {
  phaseId: string;
  existing: RoadmapNode | null;
  allPatterns: { id: string; title: string; category: string }[];
  onSave: (data: RoadmapNodeFormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(existing?.title || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [displayOrder, setDisplayOrder] = useState(existing?.display_order || 0);
  const [patternIds, setPatternIds] = useState<string[]>(existing?.pattern_ids || []);
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(existing?.access_level || 'free');
  const [status, setStatus] = useState<'draft' | 'published'>(existing?.status || 'draft');
  const [saving, setSaving] = useState(false);
  const [patternSearch, setPatternSearch] = useState('');

  const filteredPatterns = allPatterns.filter(
    (p) =>
      p.title.toLowerCase().includes(patternSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(patternSearch.toLowerCase()),
  );

  const togglePattern = (id: string) => {
    setPatternIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setSaving(true);
    await onSave({
      phase_id: phaseId,
      title: title.trim(),
      description: description.trim(),
      display_order: displayOrder,
      pattern_ids: patternIds,
      access_level: accessLevel,
      status,
    });
    setSaving(false);
  };

  return (
    <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
      <h4 className="text-white text-sm font-medium mb-3">{existing ? 'Edit Node' : 'New Node'}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-dark-text-muted mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Node title"
            className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white text-sm placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-dark-text-muted mb-1">Display Order</label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-dark-text-muted mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Node description"
            rows={2}
            className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white text-sm placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-dark-text-muted mb-1">Access Level</label>
          <select
            value={accessLevel}
            onChange={(e) => setAccessLevel(e.target.value as AccessLevel)}
            className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors"
          >
            <option value="free">Free</option>
            <option value="preview">Preview</option>
            <option value="full">Full (Paid)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-dark-text-muted mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
            className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-dark-text-muted mb-1">
            Linked Patterns ({patternIds.length} selected)
          </label>
          <input
            type="text"
            value={patternSearch}
            onChange={(e) => setPatternSearch(e.target.value)}
            placeholder="Search patterns..."
            className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white text-sm placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors mb-2"
          />
          <div className="max-h-40 overflow-y-auto space-y-1">
            {filteredPatterns.map((p) => (
              <label
                key={p.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-dark-card cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={patternIds.includes(p.id)}
                  onChange={() => togglePattern(p.id)}
                  className="rounded border-dark-border"
                />
                <span className="text-sm text-dark-text-secondary">{p.title}</span>
                <span className="text-xs text-dark-text-muted ml-auto">{p.category}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-sm text-dark-text-secondary hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving || !title.trim()}
          className="px-4 py-1.5 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}

export default AdminRoadmapPage;
