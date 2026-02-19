import { useState, useEffect, useCallback } from 'react';
import PhaseSection from './PhaseSection';
import NodePatternPopover from './NodePatternPopover';
import PathEndMarker from './PathEndMarker';
import type { RoadmapPhaseWithNodes } from '../../hooks/useRoadmap';
import type { UserPatternProgress } from '../../types';

interface GamifiedPathProps {
  phases: RoadmapPhaseWithNodes[];
  isLoggedIn: boolean;
  progress: UserPatternProgress[];
  onToggleProgress: (patternId: string) => void;
}

const GamifiedPath = ({
  phases,
  isLoggedIn,
  progress,
  onToggleProgress,
}: GamifiedPathProps) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Find selected node's data
  const selectedNode = (() => {
    if (!selectedNodeId) return null;
    for (const phase of phases) {
      for (const node of phase.nodes) {
        if (node.id === selectedNodeId) return node;
      }
    }
    return null;
  })();

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodeId((prev) => prev === nodeId ? null : nodeId);
  }, []);

  const handleClosePopover = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const totalNodes = phases.reduce((acc, p) => acc + p.nodes.length, 0);

  if (totalNodes === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-dark-text-muted text-lg">Roadmap coming soon! Check back later.</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-2xl mx-auto pb-[30vh]">
      {phases.map((phase, index) => (
        <PhaseSection
          key={phase.id}
          phaseNumber={index + 1}
          title={phase.title}
          description={phase.description}
          level={phase.phase_level}
          nodes={phase.nodes}
          isLoggedIn={isLoggedIn}
          progress={progress}
          selectedNodeId={selectedNodeId}
          onNodeClick={handleNodeClick}
          isMobile={isMobile}
        />
      ))}

      <PathEndMarker />

      {/* Pattern popover */}
      {selectedNode && (
        <NodePatternPopover
          isOpen={!!selectedNodeId}
          onClose={handleClosePopover}
          nodeTitle={selectedNode.title}
          patterns={selectedNode.patterns}
          progress={progress}
          isLoggedIn={isLoggedIn}
          onToggleProgress={onToggleProgress}
        />
      )}
    </div>
  );
};

export default GamifiedPath;
