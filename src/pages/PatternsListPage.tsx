import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePatterns } from '../hooks/usePatterns';
import { formatBlogDate } from '../utils/blog';
import { getDifficultyColor } from '../utils/pattern';
import { buildBreadcrumbSchema, buildPatternListSchema } from '../utils/jsonld';
import { PATTERN_CATEGORIES } from '../types';
import type { PatternCategory, PatternDifficulty } from '../types';
import SEO from '../components/common/SEO';
import JsonLd from '../components/common/JsonLd';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useLinkPrefix } from '../hooks/useDashboardContext';

const PatternsListPage = () => {
  const { patterns, loading, error } = usePatterns();
  const linkPrefix = useLinkPrefix();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<PatternCategory | 'All'>('All');
  const [activeDifficulty, setActiveDifficulty] = useState<PatternDifficulty | 'All'>('All');

  const filteredPatterns = useMemo(() => {
    return patterns.filter((pattern) => {
      const matchesSearch =
        !search ||
        pattern.title.toLowerCase().includes(search.toLowerCase()) ||
        pattern.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        pattern.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        activeCategory === 'All' || pattern.category === activeCategory;

      const matchesDifficulty =
        activeDifficulty === 'All' || pattern.difficulty === activeDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [patterns, search, activeCategory, activeDifficulty]);

  return (
    <div className="min-h-screen py-24">
      <SEO
        title="DSA Pattern Library"
        description="Curated collection of Data Structures & Algorithms patterns with template code, complexity analysis, and detailed explanations for interview preparation."
        path="/patterns"
        keywords="DSA patterns, two pointers, sliding window, dynamic programming, coding interview patterns, algorithm templates, data structures patterns"
      />
      <JsonLd data={buildPatternListSchema()} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: 'Home', url: 'https://corelearnly.com/' },
        { name: 'DSA Patterns', url: 'https://corelearnly.com/patterns' },
      ])} />

      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            DSA <span className="text-gradient">Pattern Library</span>
          </h1>
          <p className="text-dark-text-secondary text-lg max-w-2xl mx-auto mb-4">
            Master the most common coding interview patterns with template code, when-to-use guides, and complexity analysis.
          </p>
          <Link
            to={`${linkPrefix}/roadmap`}
            className="text-primary hover:underline text-sm inline-flex items-center gap-1"
          >
            View Interview Prep Roadmap
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
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
              placeholder="Search patterns..."
              className="w-full bg-dark-card border border-dark-border rounded-xl pl-12 pr-4 py-3 text-white placeholder-dark-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </motion.div>

        {/* Difficulty Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="flex flex-wrap justify-center gap-2 mb-4"
        >
          {(['All', 'easy', 'medium', 'hard'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setActiveDifficulty(d === 'All' ? 'All' : d)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                activeDifficulty === d
                  ? 'bg-primary text-white'
                  : 'bg-dark-card text-dark-text-secondary hover:text-white border border-dark-border'
              }`}
            >
              {d}
            </button>
          ))}
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
          {PATTERN_CATEGORIES.map((cat) => (
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
        ) : filteredPatterns.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-dark-text-muted text-lg">
              {search || activeCategory !== 'All' || activeDifficulty !== 'All'
                ? 'No patterns match your search.'
                : 'No patterns published yet. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatterns.map((pattern, index) => (
              <motion.div
                key={pattern.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Link
                  to={`${linkPrefix}/patterns/${pattern.slug}`}
                  className="block group"
                >
                  <article className="card hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                    {pattern.cover_image_url && (
                      <div className="relative overflow-hidden rounded-lg mb-4 -mt-1 -mx-1">
                        <img
                          src={pattern.cover_image_url}
                          alt={pattern.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {pattern.category}
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${getDifficultyColor(pattern.difficulty)}`}>
                        {pattern.difficulty}
                      </span>
                      <span className="text-xs text-dark-text-muted ml-auto">
                        {pattern.read_time_minutes} min read
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-white group-hover:text-primary transition-colors mb-2">
                      {pattern.title}
                    </h2>
                    <p className="text-dark-text-muted text-sm line-clamp-3 flex-1">
                      {pattern.excerpt}
                    </p>
                    {(pattern.time_complexity || pattern.space_complexity) && (
                      <div className="flex items-center gap-4 mt-3 text-xs text-dark-text-muted">
                        {pattern.time_complexity && <span>Time: {pattern.time_complexity}</span>}
                        {pattern.space_complexity && <span>Space: {pattern.space_complexity}</span>}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-border">
                      <span className="text-xs text-dark-text-muted">
                        {pattern.published_at ? formatBlogDate(pattern.published_at) : ''}
                      </span>
                      {pattern.tags.length > 0 && (
                        <div className="flex gap-1">
                          {pattern.tags.slice(0, 2).map((tag) => (
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

export default PatternsListPage;
