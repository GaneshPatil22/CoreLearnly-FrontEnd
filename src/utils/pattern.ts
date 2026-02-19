import type { PatternDifficulty, PhaseLevel, RoadmapDifficulty } from '../types';

export function getDifficultyColor(difficulty: PatternDifficulty): string {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-400/10 text-green-400';
    case 'medium':
      return 'bg-yellow-400/10 text-yellow-400';
    case 'hard':
      return 'bg-red-400/10 text-red-400';
  }
}

export function getPhaseColor(level: PhaseLevel): string {
  switch (level) {
    case 'beginner':
      return 'bg-green-400/10 text-green-400 border-green-400/20';
    case 'intermediate':
      return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20';
    case 'advanced':
      return 'bg-red-400/10 text-red-400 border-red-400/20';
  }
}

export function getPhaseBorderColor(level: PhaseLevel): string {
  switch (level) {
    case 'beginner':
      return 'border-green-400/40';
    case 'intermediate':
      return 'border-yellow-400/40';
    case 'advanced':
      return 'border-red-400/40';
  }
}

export function getRoadmapDifficultyColor(difficulty: RoadmapDifficulty): string {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-400/10 text-green-400';
    case 'intermediate':
      return 'bg-yellow-400/10 text-yellow-400';
    case 'advanced':
      return 'bg-red-400/10 text-red-400';
    case 'mixed':
      return 'bg-blue-400/10 text-blue-400';
  }
}

export function getPhaseGradient(level: PhaseLevel): string {
  switch (level) {
    case 'beginner':
      return 'from-green-400/[0.03]';
    case 'intermediate':
      return 'from-yellow-400/[0.03]';
    case 'advanced':
      return 'from-red-400/[0.03]';
  }
}

export function getPhaseStrokeColor(level: PhaseLevel): string {
  switch (level) {
    case 'beginner':
      return '#4ade80';
    case 'intermediate':
      return '#facc15';
    case 'advanced':
      return '#f87171';
  }
}

export function getPhaseGlowColor(level: PhaseLevel): string {
  switch (level) {
    case 'beginner':
      return '0 0 20px rgba(74, 222, 128, 0.3)';
    case 'intermediate':
      return '0 0 20px rgba(250, 204, 21, 0.3)';
    case 'advanced':
      return '0 0 20px rgba(248, 113, 113, 0.3)';
  }
}
