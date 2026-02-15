import { useEffect, useMemo, createElement } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { common, createLowlight } from 'lowlight';
import { usePatternBySlug, usePatterns } from '../hooks/usePatterns';
import { usePatternProgress } from '../hooks/useRoadmap';
import { extractTableOfContents, formatBlogDate } from '../utils/blog';
import { getDifficultyColor } from '../utils/pattern';
import { buildPatternSchema, buildBreadcrumbSchema } from '../utils/jsonld';
import { isPatternAccessible, isPatternPreviewOnly } from '../config/featureFlags';
import { useAuth } from '../context/auth/AuthContext';
import TiptapContentRenderer from '../components/blog/TiptapContentRenderer';
import TableOfContents from '../components/blog/TableOfContents';
import SEO from '../components/common/SEO';
import JsonLd from '../components/common/JsonLd';
import { useLinkPrefix } from '../hooks/useDashboardContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { trackEvent } from '../utils/analytics';

const lowlight = createLowlight(common);

// Hast types for lowlight
interface HastText { type: 'text'; value: string }
interface HastElement {
  type: 'element';
  tagName: string;
  properties?: { className?: string[] };
  children?: HastNode[];
}
type HastNode = HastText | HastElement;

function hastChildrenToReact(children: HastNode[]): React.ReactNode[] {
  return children.map((node, i) => {
    if (node.type === 'text') return node.value;
    if (node.type === 'element') {
      const className = node.properties?.className?.join(' ');
      return createElement(
        node.tagName,
        { key: i, className },
        node.children ? hastChildrenToReact(node.children) : undefined,
      );
    }
    return null;
  });
}

const PatternDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { pattern, loading, error } = usePatternBySlug(slug);
  const { patterns: allPatterns } = usePatterns();
  const { user } = useAuth();
  const { progress, toggleProgress } = usePatternProgress();
  const linkPrefix = useLinkPrefix();

  const tocItems = useMemo(() => {
    if (!pattern) return [];
    return extractTableOfContents(pattern.content);
  }, [pattern]);

  useEffect(() => {
    if (pattern) {
      trackEvent('pattern_view', { pattern_slug: pattern.slug, pattern_title: pattern.title, pattern_category: pattern.category });
    }
  }, [pattern]);

  const relatedPatterns = useMemo(() => {
    if (!pattern || !allPatterns.length) return [];
    return allPatterns
      .filter((p) => p.id !== pattern.id && p.category === pattern.category)
      .slice(0, 3);
  }, [pattern, allPatterns]);

  const isCompleted = pattern ? progress.some((p) => p.pattern_id === pattern.id && p.is_completed) : false;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !pattern) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Pattern not found</h1>
          <p className="text-dark-text-muted mb-4">This pattern doesn't exist or has been removed.</p>
          <Link to={`${linkPrefix}/patterns`} className="text-primary hover:underline">
            Back to patterns
          </Link>
        </div>
      </div>
    );
  }

  const accessible = isPatternAccessible(pattern.access_level);
  const previewOnly = isPatternPreviewOnly(pattern.access_level);

  // Highlighted template code
  let highlightedCode: React.ReactNode = pattern.template_code;
  if (pattern.template_code) {
    try {
      const tree = pattern.template_language
        ? lowlight.highlight(pattern.template_language, pattern.template_code)
        : lowlight.highlightAuto(pattern.template_code);
      highlightedCode = hastChildrenToReact(tree.children as unknown as HastNode[]);
    } catch {
      highlightedCode = pattern.template_code;
    }
  }

  return (
    <div className="min-h-screen py-24">
      <SEO
        title={pattern.title}
        description={pattern.excerpt}
        path={`/patterns/${pattern.slug}`}
        image={pattern.cover_image_url || undefined}
        type="article"
        publishedTime={pattern.published_at || undefined}
        modifiedTime={pattern.updated_at}
        author={pattern.author_name}
        tags={pattern.tags}
      />
      <JsonLd data={buildPatternSchema(pattern)} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: 'Home', url: 'https://corelearnly.com/' },
        { name: 'DSA Patterns', url: 'https://corelearnly.com/patterns' },
        { name: pattern.title, url: `https://corelearnly.com/patterns/${pattern.slug}` },
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
              {pattern.category}
            </span>
            <span className={`text-sm font-medium px-3 py-1 rounded-full capitalize ${getDifficultyColor(pattern.difficulty)}`}>
              {pattern.difficulty}
            </span>
            <span className="text-sm text-dark-text-muted">
              {pattern.read_time_minutes} min read
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {pattern.title}
          </h1>
          <p className="text-lg text-dark-text-secondary mb-6">{pattern.excerpt}</p>
          <div className="flex items-center justify-center gap-4 text-sm text-dark-text-muted">
            <span>{pattern.author_name}</span>
            <span>&middot;</span>
            <span>{pattern.published_at ? formatBlogDate(pattern.published_at) : ''}</span>
          </div>
          {pattern.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {pattern.tags.map((tag) => (
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
        {pattern.cover_image_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <img
              src={pattern.cover_image_url}
              alt={pattern.title}
              className="w-full rounded-xl"
            />
          </motion.div>
        )}

        {/* Quick Reference Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <div className="card border-primary/20">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Reference</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pattern.when_to_use && (
                <div className="md:col-span-2">
                  <p className="text-xs font-medium text-dark-text-muted uppercase tracking-wider mb-1">When to Use</p>
                  <p className="text-dark-text-secondary text-sm">{pattern.when_to_use}</p>
                </div>
              )}
              {pattern.time_complexity && (
                <div>
                  <p className="text-xs font-medium text-dark-text-muted uppercase tracking-wider mb-1">Time Complexity</p>
                  <p className="text-white font-mono text-sm">{pattern.time_complexity}</p>
                </div>
              )}
              {pattern.space_complexity && (
                <div>
                  <p className="text-xs font-medium text-dark-text-muted uppercase tracking-wider mb-1">Space Complexity</p>
                  <p className="text-white font-mono text-sm">{pattern.space_complexity}</p>
                </div>
              )}
              {pattern.example_problems.length > 0 && (
                <div className="md:col-span-2">
                  <p className="text-xs font-medium text-dark-text-muted uppercase tracking-wider mb-1">Example Problems</p>
                  <div className="flex flex-wrap gap-2">
                    {pattern.example_problems.map((problem) => (
                      <span
                        key={problem}
                        className="text-xs text-dark-text-secondary bg-dark-bg px-2 py-1 rounded"
                      >
                        {problem}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Template Code */}
        {pattern.template_code && accessible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-white">Template Code</h2>
              <span className="text-xs text-dark-text-muted bg-dark-card border border-dark-border px-2 py-1 rounded">
                {pattern.template_language}
              </span>
            </div>
            <pre className="bg-[#111113] border border-dark-border rounded-lg p-4 overflow-x-auto">
              <code className="text-sm font-mono">{highlightedCode}</code>
            </pre>
          </motion.div>
        )}

        {/* Paywall CTA */}
        {!accessible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div className="card border-primary/30 text-center py-12">
              <svg className="w-12 h-12 text-primary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="text-xl font-bold text-white mb-2">
                {previewOnly ? 'Preview Only' : 'Premium Content'}
              </h3>
              <p className="text-dark-text-muted mb-6">
                {previewOnly
                  ? 'The full template code and detailed explanation are available to paid members.'
                  : 'This pattern is available exclusively to paid members.'}
              </p>
              <Link
                to="/apply"
                className="inline-block px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-lg font-medium transition-colors"
              >
                Get Full Access
              </Link>
            </div>
          </motion.div>
        )}

        {/* Detailed Explanation + ToC */}
        {accessible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="max-w-5xl mx-auto"
          >
            <div className="flex gap-12">
              <div className="flex-1 max-w-3xl reading-area">
                <TiptapContentRenderer content={pattern.content} />
              </div>
              {tocItems.length > 0 && (
                <aside className="hidden xl:block w-64 shrink-0">
                  <TableOfContents items={tocItems} />
                </aside>
              )}
            </div>
          </motion.div>
        )}

        {/* Progress Toggle */}
        {user && (
          <div className="max-w-3xl mx-auto mt-8">
            <button
              onClick={() => toggleProgress(pattern.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors w-full ${
                isCompleted
                  ? 'bg-green-400/10 border-green-400/30 text-green-400'
                  : 'bg-dark-card border-dark-border text-dark-text-secondary hover:text-white hover:border-dark-text-muted'
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isCompleted ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <circle cx="12" cy="12" r="9" strokeWidth={2} />
                )}
              </svg>
              <span className="text-sm font-medium">
                {isCompleted ? 'Completed — click to undo' : 'Mark as completed'}
              </span>
            </button>
          </div>
        )}

        {/* Back link */}
        <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-dark-border">
          <Link
            to={`${linkPrefix}/patterns`}
            className="text-primary hover:underline text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all patterns
          </Link>
        </div>

        {/* Related Patterns */}
        {relatedPatterns.length > 0 && (
          <div className="max-w-5xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Related Patterns</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPatterns.map((related) => (
                <Link
                  key={related.id}
                  to={`${linkPrefix}/patterns/${related.slug}`}
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
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-primary">{related.category}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${getDifficultyColor(related.difficulty)}`}>
                        {related.difficulty}
                      </span>
                    </div>
                    <h3 className="text-white font-medium group-hover:text-primary transition-colors">
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

export default PatternDetailPage;
