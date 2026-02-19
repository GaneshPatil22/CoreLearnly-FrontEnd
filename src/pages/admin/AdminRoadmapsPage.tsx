import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRoadmapsAdmin } from '../../hooks/admin/useRoadmapsAdmin';
import { getRoadmapDifficultyColor } from '../../utils/pattern';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';

type StatusFilter = 'all' | 'draft' | 'published';

const AdminRoadmapsPage = () => {
  const { roadmaps, loading, error, deleteRoadmap } = useRoadmapsAdmin();
  const [filter, setFilter] = useState<StatusFilter>('all');

  const filteredRoadmaps = filter === 'all' ? roadmaps : roadmaps.filter((r) => r.status === filter);

  const publishedCount = roadmaps.filter((r) => r.status === 'published').length;
  const draftCount = roadmaps.filter((r) => r.status === 'draft').length;

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete roadmap "${title}" and all its phases/nodes? This cannot be undone.`)) return;
    await deleteRoadmap(id);
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
        title="Roadmaps Management"
        description="Manage interview prep roadmaps"
        path="/admin/roadmaps"
        noIndex
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Roadmaps</h1>
          <p className="text-dark-text-muted mt-1">
            {roadmaps.length} total &middot; {publishedCount} published &middot; {draftCount} drafts
          </p>
        </div>
        <Link
          to="/admin/roadmaps/new"
          className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium transition-colors"
        >
          New Roadmap
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-dark-text-muted text-sm">Total Roadmaps</p>
          <p className="text-3xl font-bold text-white mt-1">{roadmaps.length}</p>
        </div>
        <div className="card">
          <p className="text-dark-text-muted text-sm">Published</p>
          <p className="text-3xl font-bold text-green-400 mt-1">{publishedCount}</p>
        </div>
        <div className="card">
          <p className="text-dark-text-muted text-sm">Drafts</p>
          <p className="text-3xl font-bold text-yellow-400 mt-1">{draftCount}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'published', 'draft'] as StatusFilter[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-dark-card text-dark-text-secondary hover:text-white'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Roadmaps List */}
      {filteredRoadmaps.length === 0 ? (
        <div className="text-center py-12 text-dark-text-muted">
          <p>No {filter === 'all' ? '' : filter} roadmaps yet.</p>
          <Link to="/admin/roadmaps/new" className="text-primary hover:underline text-sm mt-2 inline-block">
            Create your first roadmap
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRoadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              className="card flex items-center justify-between"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-medium truncate">{roadmap.title}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                      roadmap.status === 'published'
                        ? 'bg-green-400/10 text-green-400'
                        : 'bg-yellow-400/10 text-yellow-400'
                    }`}
                  >
                    {roadmap.status}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 capitalize ${getRoadmapDifficultyColor(roadmap.difficulty_level)}`}>
                    {roadmap.difficulty_level}
                  </span>
                  {roadmap.is_featured && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-dark-text-muted">
                  <span>{roadmap.total_patterns} patterns</span>
                  {roadmap.estimated_duration && <span>{roadmap.estimated_duration}</span>}
                  <span>Order: {roadmap.display_order}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Link
                  to={`/admin/roadmaps/edit/${roadmap.id}`}
                  className="px-3 py-1.5 text-sm text-dark-text-secondary hover:text-white bg-dark-border rounded-lg transition-colors"
                >
                  Edit
                </Link>
                <Link
                  to={`/admin/roadmaps/${roadmap.id}/manage`}
                  className="px-3 py-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Manage Phases
                </Link>
                <button
                  onClick={() => handleDelete(roadmap.id, roadmap.title)}
                  className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRoadmapsPage;
