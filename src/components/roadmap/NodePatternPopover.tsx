import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getDifficultyColor } from '../../utils/pattern';
import type { DSAPattern, UserPatternProgress } from '../../types';
import { useLinkPrefix } from '../../hooks/useDashboardContext';

interface NodePatternPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  nodeTitle: string;
  patterns: DSAPattern[];
  progress: UserPatternProgress[];
  isLoggedIn: boolean;
  onToggleProgress: (patternId: string) => void;
}

const NodePatternPopover = ({
  isOpen,
  onClose,
  nodeTitle,
  patterns,
  progress,
  isLoggedIn,
  onToggleProgress,
}: NodePatternPopoverProps) => {
  const linkPrefix = useLinkPrefix();

  const completedIds = new Set(
    progress.filter((p) => p.is_completed).map((p) => p.pattern_id),
  );
  const completedCount = patterns.filter((p) => completedIds.has(p.id)).length;
  const progressPercent = patterns.length > 0 ? Math.round((completedCount / patterns.length) * 100) : 0;

  // Close on Escape or scroll
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleScroll = () => onClose();
    document.addEventListener('keydown', handleKey);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />

          {/* Toast card */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm mx-4 mb-4 md:mb-0 bg-dark-card border border-dark-border rounded-2xl p-5 shadow-2xl"
          >
            {/* Drag handle (mobile hint) */}
            <div className="w-10 h-1 bg-dark-border rounded-full mx-auto mb-4 md:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">{nodeTitle}</h3>
              <button
                onClick={onClose}
                className="text-dark-text-muted hover:text-white transition-colors p-1 -mr-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress bar */}
            {isLoggedIn && patterns.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-dark-text-muted mb-1.5">
                  <span>{completedCount}/{patterns.length} completed</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-dark-bg rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Pattern list */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {patterns.map((pattern) => {
                const isCompleted = completedIds.has(pattern.id);
                return (
                  <div
                    key={pattern.id}
                    className="flex items-center gap-2.5 bg-dark-bg rounded-lg px-3 py-2.5"
                  >
                    {isLoggedIn && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleProgress(pattern.id); }}
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
                      onClick={onClose}
                    >
                      <span className="text-sm text-white font-medium">{pattern.title}</span>
                    </Link>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full capitalize shrink-0 ${getDifficultyColor(pattern.difficulty)}`}>
                      {pattern.difficulty}
                    </span>
                  </div>
                );
              })}
            </div>

            {patterns.length === 0 && (
              <p className="text-dark-text-muted text-sm text-center py-4">No patterns linked to this node yet.</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NodePatternPopover;
