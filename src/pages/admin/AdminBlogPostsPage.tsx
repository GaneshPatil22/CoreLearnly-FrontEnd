import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlogAdmin } from '../../hooks/admin/useBlogAdmin';
import { formatBlogDate } from '../../utils/blog';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';

type StatusFilter = 'all' | 'draft' | 'published';

const AdminBlogPostsPage = () => {
  const { posts, loading, error, deletePost } = useBlogAdmin();
  const [filter, setFilter] = useState<StatusFilter>('all');

  const filteredPosts = filter === 'all' ? posts : posts.filter((p) => p.status === filter);

  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deletePost(id);
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
        title="Blog Posts"
        description="Manage blog posts"
        path="/admin/blog"
        noIndex
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-dark-text-muted mt-1">
            {posts.length} total &middot; {publishedCount} published &middot; {draftCount} drafts
          </p>
        </div>
        <Link
          to="/admin/blog/new"
          className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium transition-colors"
        >
          New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-dark-text-muted text-sm">Total Posts</p>
          <p className="text-3xl font-bold text-white mt-1">{posts.length}</p>
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

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 text-dark-text-muted">
          <p>No {filter === 'all' ? '' : filter} posts yet.</p>
          <Link to="/admin/blog/new" className="text-primary hover:underline text-sm mt-2 inline-block">
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="card flex items-center justify-between"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-medium truncate">{post.title}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                      post.status === 'published'
                        ? 'bg-green-400/10 text-green-400'
                        : 'bg-yellow-400/10 text-yellow-400'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-dark-text-muted">
                  <span>{post.category}</span>
                  <span>{post.read_time_minutes} min read</span>
                  <span>{formatBlogDate(post.created_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Link
                  to={`/admin/blog/edit/${post.id}`}
                  className="px-3 py-1.5 text-sm text-dark-text-secondary hover:text-white bg-dark-border rounded-lg transition-colors"
                >
                  Edit
                </Link>
                {post.status === 'published' && (
                  <Link
                    to={`/blog/${post.slug}`}
                    target="_blank"
                    className="px-3 py-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    View
                  </Link>
                )}
                <button
                  onClick={() => handleDelete(post.id, post.title)}
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

export default AdminBlogPostsPage;
