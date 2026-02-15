import type { PatternDifficulty, PhaseLevel } from '../types';

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
