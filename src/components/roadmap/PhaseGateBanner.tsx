import { motion } from 'framer-motion';
import { getPhaseColor } from '../../utils/pattern';
import type { PhaseLevel } from '../../types';

const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

interface PhaseGateBannerProps {
  phaseNumber: number;
  title: string;
  description: string;
  level: PhaseLevel;
  nodeCount: number;
  patternCount: number;
}

const PhaseGateBanner = ({ phaseNumber, title, description, level, nodeCount, patternCount }: PhaseGateBannerProps) => {
  return (
    <motion.div
      className="flex flex-col items-center py-6 relative"
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20, scale: 0.95 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
    >
      {/* Gradient divider line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-dark-border to-transparent mb-6" />

      {/* Phase number badge */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${getPhaseColor(level)}`}>
        <span className="text-sm font-bold">{phaseNumber}</span>
      </div>

      {/* Title & level badge */}
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-white font-bold text-lg">{title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getPhaseColor(level)}`}>
          {level}
        </span>
      </div>

      {/* Description */}
      <p className="text-dark-text-muted text-sm text-center max-w-md">{description}</p>

      {/* Stats */}
      <div className="flex items-center gap-3 mt-2">
        <span className="text-xs text-dark-text-muted">
          {nodeCount} {nodeCount === 1 ? 'node' : 'nodes'}
        </span>
        <span className="text-xs text-dark-text-muted">&middot;</span>
        <span className="text-xs text-dark-text-muted">
          {patternCount} {patternCount === 1 ? 'pattern' : 'patterns'}
        </span>
      </div>

      {/* Gradient divider line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-dark-border to-transparent mt-6" />
    </motion.div>
  );
};

export default PhaseGateBanner;
