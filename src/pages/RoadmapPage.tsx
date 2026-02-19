import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRoadmapBySlug } from '../hooks/useRoadmaps';
import { useRoadmap, usePatternProgress } from '../hooks/useRoadmap';
import { buildBreadcrumbSchema, buildRoadmapSchema } from '../utils/jsonld';
import { useAuth } from '../context/auth/AuthContext';
import SEO from '../components/common/SEO';
import JsonLd from '../components/common/JsonLd';
import LoadingSpinner from '../components/common/LoadingSpinner';
import GamifiedPath from '../components/roadmap/GamifiedPath';
import { useLinkPrefix } from '../hooks/useDashboardContext';

const RoadmapPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { roadmap, loading: roadmapLoading, error: roadmapError } = useRoadmapBySlug(slug);
  const { phases, loading: phasesLoading, error: phasesError } = useRoadmap(roadmap?.id);
  const { user } = useAuth();
  const { progress, toggleProgress } = usePatternProgress();
  const linkPrefix = useLinkPrefix();

  const loading = roadmapLoading || phasesLoading;
  const error = roadmapError || phasesError;

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    if (!user || !phases.length) return null;
    let totalPatterns = 0;
    let completedPatterns = 0;
    const completedIds = new Set(progress.filter((p) => p.is_completed).map((p) => p.pattern_id));

    for (const phase of phases) {
      for (const node of phase.nodes) {
        for (const pattern of node.patterns) {
          totalPatterns++;
          if (completedIds.has(pattern.id)) completedPatterns++;
        }
      }
    }

    return totalPatterns > 0
      ? { total: totalPatterns, completed: completedPatterns, percent: Math.round((completedPatterns / totalPatterns) * 100) }
      : null;
  }, [user, phases, progress]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Roadmap not found'}</p>
          <Link to={`${linkPrefix}/roadmaps`} className="text-primary hover:underline text-sm">
            &larr; Back to Roadmaps
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24">
      <SEO
        title={roadmap.title}
        description={roadmap.description}
        path={`/roadmaps/${roadmap.slug}`}
        keywords="coding interview roadmap, DSA learning path, interview preparation guide, algorithm study plan, coding interview prep"
      />
      <JsonLd data={buildBreadcrumbSchema([
        { name: 'Home', url: 'https://corelearnly.com/' },
        { name: 'Roadmaps', url: 'https://corelearnly.com/roadmaps' },
        { name: roadmap.title, url: `https://corelearnly.com/roadmaps/${roadmap.slug}` },
      ])} />
      <JsonLd data={buildRoadmapSchema(roadmap)} />

      <div className="section-container">
        {/* Back link */}
        <Link
          to={`${linkPrefix}/roadmaps`}
          className="text-dark-text-muted hover:text-white text-sm inline-flex items-center gap-1 mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All Roadmaps
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {roadmap.title}
          </h1>
          <p className="text-dark-text-secondary text-lg max-w-2xl mx-auto mb-4">
            {roadmap.description}
          </p>
          <Link
            to={`${linkPrefix}/patterns`}
            className="text-primary hover:underline text-sm inline-flex items-center gap-1"
          >
            Browse all patterns
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {/* Overall Progress Bar */}
        {user && overallProgress && overallProgress.total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">Overall Progress</span>
                <span className="text-sm text-dark-text-muted">
                  {overallProgress.completed}/{overallProgress.total} patterns ({overallProgress.percent}%)
                </span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress.percent}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Login CTA */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="card border-primary/20 text-center py-4">
              <p className="text-dark-text-secondary text-sm">
                <Link to="/login" className="text-primary hover:underline">Login</Link> to track your progress across patterns.
              </p>
            </div>
          </motion.div>
        )}

        {/* Gamified Path */}
        <GamifiedPath
          phases={phases}
          isLoggedIn={!!user}
          progress={progress}
          onToggleProgress={toggleProgress}
        />
      </div>
    </div>
  );
};

export default RoadmapPage;
