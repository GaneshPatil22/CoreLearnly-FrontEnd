import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBlogPosts } from '../hooks/useBlog';
import { formatBlogDate } from '../utils/blog';
import { BLOG_CATEGORIES } from '../types';
import type { BlogCategory } from '../types';
import SEO from '../components/common/SEO';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BlogListPage = () => {
  const { posts, loading, error } = useBlogPosts();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<BlogCategory | 'All'>('All');

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !search ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        activeCategory === 'All' || post.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, search, activeCategory]);

  return (
    <div className="min-h-screen py-24">
      <SEO
        title="Blog"
        description="Technical articles on DSA, System Design, AI, and interview preparation. Learn from in-depth tutorials and guides."
        path="/blog"
      />

      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The <span className="text-gradient">Blog</span>
          </h1>
          <p className="text-dark-text-secondary text-lg max-w-2xl mx-auto">
            Deep dives into DSA, system design, AI, and everything you need to crack technical interviews.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-xl mx-auto mb-8"
        >
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full bg-dark-card border border-dark-border rounded-xl pl-12 pr-4 py-3 text-white placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'All'
                ? 'bg-primary text-white'
                : 'bg-dark-card text-dark-text-secondary hover:text-white border border-dark-border'
            }`}
          >
            All
          </button>
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-dark-card text-dark-text-secondary hover:text-white border border-dark-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-dark-text-muted text-lg">
              {search || activeCategory !== 'All'
                ? 'No articles match your search.'
                : 'No articles published yet. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="block group"
                >
                  <article className="card hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                    {post.cover_image_url && (
                      <div className="relative overflow-hidden rounded-lg mb-4 -mt-1 -mx-1">
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-dark-text-muted">
                        {post.read_time_minutes} min read
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-white group-hover:text-primary transition-colors mb-2">
                      {post.title}
                    </h2>
                    <p className="text-dark-text-muted text-sm line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-border">
                      <span className="text-xs text-dark-text-muted">
                        {post.published_at ? formatBlogDate(post.published_at) : ''}
                      </span>
                      {post.tags.length > 0 && (
                        <div className="flex gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-dark-text-muted bg-dark-bg px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;
