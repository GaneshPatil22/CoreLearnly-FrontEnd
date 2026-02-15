import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoadmap, usePatternProgress } from '../hooks/useRoadmap';
import { getDifficultyColor, getPhaseColor, getPhaseBorderColor } from '../utils/pattern';
import { buildBreadcrumbSchema } from '../utils/jsonld';
import { isPatternAccessible, FEATURE_FLAGS } from '../config/featureFlags';
import { useAuth } from '../context/auth/AuthContext';
import SEO from '../components/common/SEO';
import JsonLd from '../components/common/JsonLd';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useLinkPrefix } from '../hooks/useDashboardContext';

const RoadmapPage = () => {
  const { phases, loading, error } = useRoadmap();
  const { user } = useAuth();
  const { progress, toggleProgress } = usePatternProgress();
  const linkPrefix = useLinkPrefix();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

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

  // Helper: get node completion status
  const getNodeStatus = (patternIds: string[]) => {
    if (!user) return 'none';
    const completedIds = new Set(progress.filter((p) => p.is_completed).map((p) => p.pattern_id));
    const completed = patternIds.filter((id) => completedIds.has(id)).length;
    if (completed === 0) return 'none';
    if (completed === patternIds.length) return 'all';
    return 'some';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24">
      <SEO
        title="Interview Prep Roadmap"
        description="Follow a structured learning path from beginner to advanced DSA patterns. Track your progress and master every coding interview pattern."
        path="/roadmap"
        keywords="coding interview roadmap, DSA learning path, interview preparation guide, algorithm study plan, coding interview prep"
      />
      <JsonLd data={buildBreadcrumbSchema([
        { name: 'Home', url: 'https://corelearnly.com/' },
        { name: 'Roadmap', url: 'https://corelearnly.com/roadmap' },
      ])} />

      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Interview Prep <span className="text-gradient">Roadmap</span>
          </h1>
          <p className="text-dark-text-secondary text-lg max-w-2xl mx-auto mb-4">
            Follow a structured path from fundamentals to advanced patterns. Each phase builds on the previous one.
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

        {/* Phases */}
        {phases.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-dark-text-muted text-lg">Roadmap coming soon! Check back later.</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {phases.map((phase, phaseIndex) => (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * phaseIndex }}
                className="relative"
              >
                {/* Connecting line */}
                {phaseIndex < phases.length - 1 && (
                  <div className={`absolute left-6 top-16 bottom-0 w-0.5 ${getPhaseBorderColor(phase.phase_level)} bg-current opacity-20`} />
                )}

                {/* Phase Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${getPhaseColor(phase.phase_level)}`}>
                    <span className="text-lg font-bold">{phaseIndex + 1}</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-white">{phase.title}</h2>
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getPhaseColor(phase.phase_level)}`}>
                        {phase.phase_level}
                      </span>
                    </div>
                    <p className="text-dark-text-muted text-sm">{phase.description}</p>
                  </div>
                </div>

                {/* Nodes */}
                <div className="ml-6 pl-8 border-l border-dark-border space-y-4 pb-12">
                  {phase.nodes.map((node, nodeIndex) => {
                    const isExpanded = expandedNodes.has(node.id);
                    const nodeStatus = getNodeStatus(node.pattern_ids);
                    const completedIds = new Set(progress.filter((p) => p.is_completed).map((p) => p.pattern_id));
                    const locked = FEATURE_FLAGS.PATTERNS_PAYWALL_ENABLED && !isPatternAccessible(node.access_level);

                    return (
                      <motion.div
                        key={node.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * phaseIndex + 0.05 * nodeIndex }}
                      >
                        <button
                          onClick={() => toggleNode(node.id)}
                          className="w-full text-left"
                        >
                          <div className={`card hover:border-primary/30 transition-all duration-300 ${
                            nodeStatus === 'all' ? 'border-green-400/30' : ''
                          }`}>
                            <div className="flex items-center gap-3">
                              {/* Status indicator */}
                              {user && (
                                <div className="shrink-0">
                                  {nodeStatus === 'all' ? (
                                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  ) : nodeStatus === 'some' ? (
                                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  ) : (
                                    <svg className="w-5 h-5 text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <circle cx="12" cy="12" r="9" strokeWidth={2} />
                                    </svg>
                                  )}
                                </div>
                              )}

                              {/* Lock icon */}
                              {locked && (
                                <svg className="w-4 h-4 text-dark-text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              )}

                              <div className="flex-1 min-w-0">
                                <h3 className="text-white font-medium text-sm">{node.title}</h3>
                                <p className="text-dark-text-muted text-xs mt-0.5">{node.description}</p>
                              </div>
                              <span className="text-xs text-dark-text-muted shrink-0">
                                {node.patterns.length} patterns
                              </span>
                              <svg
                                className={`w-4 h-4 text-dark-text-muted transition-transform shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </button>

                        {/* Expanded: show linked patterns */}
                        <AnimatePresence>
                          {isExpanded && node.patterns.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-4 mt-2 space-y-2">
                                {node.patterns.map((pattern) => {
                                  const isCompleted = completedIds.has(pattern.id);
                                  return (
                                    <div
                                      key={pattern.id}
                                      className="flex items-center gap-3 bg-dark-bg rounded-lg px-4 py-3"
                                    >
                                      {user && (
                                        <button
                                          onClick={(e) => { e.stopPropagation(); toggleProgress(pattern.id); }}
                                          className="shrink-0"
                                        >
                                          {isCompleted ? (
                                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                          ) : (
                                            <svg className="w-5 h-5 text-dark-text-muted hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <circle cx="12" cy="12" r="9" strokeWidth={2} />
                                            </svg>
                                          )}
                                        </button>
                                      )}
                                      <Link
                                        to={`${linkPrefix}/patterns/${pattern.slug}`}
                                        className="flex-1 min-w-0 hover:text-primary transition-colors"
                                      >
                                        <span className="text-sm text-white font-medium">{pattern.title}</span>
                                      </Link>
                                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize shrink-0 ${getDifficultyColor(pattern.difficulty)}`}>
                                        {pattern.difficulty}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapPage;
