import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBlogPostBySlug, useBlogPosts } from '../hooks/useBlog';
import { extractTableOfContents, formatBlogDate } from '../utils/blog';
import { buildBlogPostingSchema, buildBreadcrumbSchema } from '../utils/jsonld';
import BlogContentSwitch from '../components/blog/BlogContentSwitch';
import TableOfContents from '../components/blog/TableOfContents';
import SEO from '../components/common/SEO';
import JsonLd from '../components/common/JsonLd';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { trackEvent } from '../utils/analytics';
import { useLinkPrefix } from '../hooks/useDashboardContext';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = useBlogPostBySlug(slug);
  const { posts: allPosts } = useBlogPosts();
  const linkPrefix = useLinkPrefix();

  const tocItems = useMemo(() => {
    if (!post) return [];
    return extractTableOfContents(post.content);
  }, [post]);

  useEffect(() => {
    if (post) {
      trackEvent('blog_post_view', { post_slug: post.slug, post_title: post.title, post_category: post.category });
    }
  }, [post]);

  const relatedPosts = useMemo(() => {
    if (!post || !allPosts.length) return [];
    return allPosts
      .filter((p) => p.id !== post.id && p.category === post.category)
      .slice(0, 3);
  }, [post, allPosts]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Post not found</h1>
          <p className="text-dark-text-muted mb-4">This article doesn't exist or has been removed.</p>
          <Link to={`${linkPrefix}/blog`} className="text-primary hover:underline">
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24">
      <SEO
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.cover_image_url || undefined}
        type="article"
        publishedTime={post.published_at || undefined}
        modifiedTime={post.updated_at}
        author={post.author_name}
        tags={post.tags}
      />
      <JsonLd data={buildBlogPostingSchema(post)} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: 'Home', url: 'https://corelearnly.com/' },
        { name: 'Blog', url: 'https://corelearnly.com/blog' },
        { name: post.title, url: `https://corelearnly.com/blog/${post.slug}` },
      ])} />

      <article className="section-container">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-sm text-dark-text-muted">
              {post.read_time_minutes} min read
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-lg text-dark-text-secondary mb-6">{post.excerpt}</p>
          <div className="flex items-center justify-center gap-4 text-sm text-dark-text-muted">
            <span>{post.author_name}</span>
            <span>&middot;</span>
            <span>{post.published_at ? formatBlogDate(post.published_at) : ''}</span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-dark-text-muted bg-dark-card border border-dark-border px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.header>

        {/* Cover Image */}
        {post.cover_image_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full rounded-xl"
            />
          </motion.div>
        )}

        {/* Content + ToC */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex gap-12">
            {/* Main Content */}
            <div className="flex-1 max-w-3xl reading-area">
              <BlogContentSwitch content={post.content} />
            </div>

            {/* Sidebar ToC (desktop only) */}
            {tocItems.length > 0 && (
              <aside className="hidden xl:block w-64 shrink-0">
                <TableOfContents items={tocItems} />
              </aside>
            )}
          </div>
        </motion.div>

        {/* Back link */}
        <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-dark-border">
          <Link
            to={`${linkPrefix}/blog`}
            className="text-primary hover:underline text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all articles
          </Link>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="max-w-5xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  to={`${linkPrefix}/blog/${related.slug}`}
                  className="block group"
                >
                  <div className="card hover:border-primary/50 transition-all duration-300">
                    {related.cover_image_url && (
                      <img
                        src={related.cover_image_url}
                        alt={related.title}
                        className="w-full h-36 object-cover rounded-lg mb-3"
                      />
                    )}
                    <span className="text-xs font-medium text-primary">{related.category}</span>
                    <h3 className="text-white font-medium mt-1 group-hover:text-primary transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-dark-text-muted text-sm mt-1 line-clamp-2">{related.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogPostPage;
