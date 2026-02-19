export interface NodePosition {
  x: number;
  y: number;
  index: number;
}

// Desktop: S-curve zigzag pattern
// Cycle: center(50%) → right(82%) → center(50%) → left(18%)
const DESKTOP_X_POSITIONS = [50, 82, 50, 18];
const DESKTOP_Y_SPACING = 140;

// Mobile: gentle wobble
const MOBILE_X_POSITIONS = [40, 60];
const MOBILE_Y_SPACING = 120;

export function computeNodePositions(
  nodeCount: number,
  isMobile: boolean,
  startY: number = 80,
): NodePosition[] {
  const xPositions = isMobile ? MOBILE_X_POSITIONS : DESKTOP_X_POSITIONS;
  const ySpacing = isMobile ? MOBILE_Y_SPACING : DESKTOP_Y_SPACING;

  return Array.from({ length: nodeCount }, (_, i) => ({
    x: xPositions[i % xPositions.length],
    y: startY + i * ySpacing,
    index: i,
  }));
}

export function buildPathD(positions: NodePosition[], containerWidth: number): string {
  if (positions.length < 2) return '';

  const toAbsX = (pct: number) => (pct / 100) * containerWidth;

  const points = positions.map((p) => ({
    x: toAbsX(p.x),
    y: p.y,
  }));

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const midY = (curr.y + next.y) / 2;

    // Cubic bezier: control points at midY to create smooth S-curve
    d += ` C ${curr.x} ${midY}, ${next.x} ${midY}, ${next.x} ${next.y}`;
  }

  return d;
}

export function getTotalPathHeight(
  nodeCount: number,
  isMobile: boolean,
  startY: number = 80,
): number {
  const ySpacing = isMobile ? MOBILE_Y_SPACING : DESKTOP_Y_SPACING;
  return startY + (nodeCount - 1) * ySpacing + 80; // 80px padding at bottom
}
