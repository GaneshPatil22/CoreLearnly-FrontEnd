import { motion } from 'framer-motion';

export type NodeState = 'locked' | 'available' | 'in-progress' | 'completed';

interface RoadmapNodeCircleProps {
  state: NodeState;
  nodeNumber: number;
  label: string;
  patternCount: number;
  onClick: () => void;
  isSelected: boolean;
  style: React.CSSProperties;
}

const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

const RoadmapNodeCircle = ({
  state,
  nodeNumber,
  label,
  patternCount,
  onClick,
  isSelected,
  style,
}: RoadmapNodeCircleProps) => {
  const stateClasses: Record<NodeState, string> = {
    locked: 'ring-2 ring-dark-border bg-dark-card opacity-60 cursor-default',
    available: 'ring-2 ring-dark-border bg-dark-card cursor-pointer hover:ring-primary/50',
    'in-progress': 'ring-2 ring-primary bg-primary/10 cursor-pointer',
    completed: 'ring-2 ring-green-400 bg-green-400/20 cursor-pointer',
  };

  const selectedRing = isSelected ? 'ring-primary ring-4' : '';

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        ...style,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <motion.button
        onClick={state !== 'locked' ? onClick : undefined}
        className={`w-14 h-14 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${stateClasses[state]} ${selectedRing}`}
        whileHover={state !== 'locked' && !prefersReducedMotion ? { scale: 1.1 } : undefined}
        whileTap={state !== 'locked' && !prefersReducedMotion ? { scale: 0.95 } : undefined}
        style={state === 'completed' ? { boxShadow: '0 0 20px rgba(74, 222, 128, 0.3)' } : undefined}
        aria-label={`${label} - ${state}`}
      >
        {state === 'locked' && (
          <svg className="w-5 h-5 text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        )}
        {state === 'available' && (
          <span className="text-white font-bold text-sm">{nodeNumber}</span>
        )}
        {state === 'in-progress' && (
          <>
            <span className="text-primary font-bold text-sm">{nodeNumber}</span>
            {!prefersReducedMotion && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/40"
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </>
        )}
        {state === 'completed' && (
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {/* Pattern count badge */}
        {patternCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-dark-bg border border-dark-border flex items-center justify-center text-[10px] font-bold text-dark-text-secondary">
            {patternCount}
          </span>
        )}
      </motion.button>
      <span className="text-xs text-dark-text-muted mt-2 text-center max-w-[100px] leading-tight">
        {label}
      </span>
      {patternCount > 0 && (
        <span className="text-[10px] text-dark-text-muted">
          {patternCount} {patternCount === 1 ? 'pattern' : 'patterns'}
        </span>
      )}
    </div>
  );
};

export default RoadmapNodeCircle;
