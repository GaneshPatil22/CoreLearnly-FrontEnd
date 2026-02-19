import { useRef, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { computeNodePositions, buildPathD, getTotalPathHeight } from './roadmapPath';
import RoadmapNodeCircle from './RoadmapNodeCircle';
import type { NodeState } from './RoadmapNodeCircle';
import { getPhaseStrokeColor } from '../../utils/pattern';
import type { PhaseLevel, UserPatternProgress } from '../../types';
import type { RoadmapNodeWithPatterns } from '../../hooks/useRoadmap';

const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

interface WindingPathSegmentProps {
  nodes: RoadmapNodeWithPatterns[];
  phaseLevel: PhaseLevel;
  isLoggedIn: boolean;
  progress: UserPatternProgress[];
  selectedNodeId: string | null;
  onNodeClick: (nodeId: string) => void;
  isMobile: boolean;
}

const CONTAINER_WIDTH = 672; // max-w-2xl

const WindingPathSegment = ({
  nodes,
  phaseLevel,
  isLoggedIn,
  progress,
  selectedNodeId,
  onNodeClick,
  isMobile,
}: WindingPathSegmentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const positions = useMemo(
    () => computeNodePositions(nodes.length, isMobile),
    [nodes.length, isMobile],
  );

  const containerHeight = useMemo(
    () => getTotalPathHeight(nodes.length, isMobile),
    [nodes.length, isMobile],
  );

  const pathD = useMemo(
    () => buildPathD(positions, isMobile ? window.innerWidth * 0.9 : CONTAINER_WIDTH),
    [positions, isMobile],
  );

  const strokeColor = getPhaseStrokeColor(phaseLevel);

  // Scroll-based path drawing animation
  // 'end 85%' means the path is fully drawn when the container bottom reaches
  // 85% down the viewport — achievable even for the last phase section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end 85%'],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const completedIds = useMemo(
    () => new Set(progress.filter((p) => p.is_completed).map((p) => p.pattern_id)),
    [progress],
  );

  const getNodeState = useCallback(
    (node: RoadmapNodeWithPatterns): NodeState => {
      if (!isLoggedIn) return 'available';
      const nodePatternIds = node.pattern_ids || [];
      if (nodePatternIds.length === 0) return 'available';
      const completedCount = nodePatternIds.filter((id) => completedIds.has(id)).length;
      if (completedCount === nodePatternIds.length) return 'completed';
      if (completedCount > 0) return 'in-progress';
      return 'available';
    },
    [isLoggedIn, completedIds],
  );

  if (nodes.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: containerHeight }}
    >
      {/* SVG path */}
      {pathD && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${isMobile ? window.innerWidth * 0.9 : CONTAINER_WIDTH} ${containerHeight}`}
          preserveAspectRatio="none"
        >
          {/* Base dashed path */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={2}
            strokeDasharray="8 6"
          />
          {/* Animated progress path */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            style={prefersReducedMotion ? { pathLength: 1 } : { pathLength }}
          />
        </svg>
      )}

      {/* Nodes */}
      {nodes.map((node, i) => {
        const pos = positions[i];
        if (!pos) return null;
        const state = getNodeState(node);

        return (
          <motion.div
            key={node.id}
            initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.5 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 * i, type: 'spring', stiffness: 200, damping: 20 }}
          >
            <RoadmapNodeCircle
              state={state}
              nodeNumber={i + 1}
              label={node.title}
              patternCount={node.patterns.length}
              onClick={() => onNodeClick(node.id)}
              isSelected={selectedNodeId === node.id}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}px`,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default WindingPathSegment;
