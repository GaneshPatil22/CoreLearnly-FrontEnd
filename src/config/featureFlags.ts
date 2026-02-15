import type { AccessLevel } from '../types';

export const FEATURE_FLAGS = {
  PATTERNS_PAYWALL_ENABLED: false, // flip to true when paid tier launches
} as const;

export function isPatternAccessible(accessLevel: AccessLevel): boolean {
  if (!FEATURE_FLAGS.PATTERNS_PAYWALL_ENABLED) return true;
  return accessLevel === 'free';
}

export function isPatternPreviewOnly(accessLevel: AccessLevel): boolean {
  if (!FEATURE_FLAGS.PATTERNS_PAYWALL_ENABLED) return false;
  return accessLevel === 'preview';
}
