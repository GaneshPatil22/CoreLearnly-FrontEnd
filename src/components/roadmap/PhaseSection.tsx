import { getPhaseGradient } from '../../utils/pattern';
import PhaseGateBanner from './PhaseGateBanner';
import WindingPathSegment from './WindingPathSegment';
import type { PhaseLevel, UserPatternProgress } from '../../types';
import type { RoadmapNodeWithPatterns } from '../../hooks/useRoadmap';

interface PhaseSectionProps {
  phaseNumber: number;
  title: string;
  description: string;
  level: PhaseLevel;
  nodes: RoadmapNodeWithPatterns[];
  isLoggedIn: boolean;
  progress: UserPatternProgress[];
  selectedNodeId: string | null;
  onNodeClick: (nodeId: string) => void;
  isMobile: boolean;
}

const PhaseSection = ({
  phaseNumber,
  title,
  description,
  level,
  nodes,
  isLoggedIn,
  progress,
  selectedNodeId,
  onNodeClick,
  isMobile,
}: PhaseSectionProps) => {
  return (
    <div className={`bg-gradient-to-b ${getPhaseGradient(level)} to-transparent rounded-2xl`}>
      <PhaseGateBanner
        phaseNumber={phaseNumber}
        title={title}
        description={description}
        level={level}
        nodeCount={nodes.length}
        patternCount={nodes.reduce((sum, n) => sum + n.patterns.length, 0)}
      />
      <WindingPathSegment
        nodes={nodes}
        phaseLevel={level}
        isLoggedIn={isLoggedIn}
        progress={progress}
        selectedNodeId={selectedNodeId}
        onNodeClick={onNodeClick}
        isMobile={isMobile}
      />
    </div>
  );
};

export default PhaseSection;
