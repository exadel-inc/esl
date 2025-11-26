/**
 * Resolves offset value for given axis.
 * @param offset - Offset value or object containing axis-specific offsets
 * @param axis - Axis for which to resolve the offset ('x' or 'y')
 * @returns Resolved offset value for the specified axis
 */
export function resolveOffset(
  offset: number | {x?: number, y?: number} | undefined,
  axis: 'x' | 'y'
): number {
  if (typeof offset === 'number') return offset;
  return offset?.[axis] || 0;
}

/**
 * Gets the document's scrolling element.
 * @returns Scrolling element
 */
export function getDocScrollingEl(): Element {
  return document.scrollingElement || document.documentElement;
}
