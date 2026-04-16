import type {ESLAnchorData} from './esl-anchornav';

/** {@link ESLAnchornav} hierarchy builder function */
export type ESLAnchornavHierarchyBuilder = (flatAnchors: ESLAnchorData[]) => ESLAnchorData[];

/**
 * Builds hierarchy based on level property from anchor data.
 * Anchors with smaller level values become parents of following anchors with larger values.
 * Uses `data.level` property from the anchor's data object (set via `esl-anchor="level: X"` attribute).
 * @param flatAnchors - flat list of anchors in DOM order
 * @returns hierarchical anchors list (roots only)
 */
export function buildHierarchyByLevel(flatAnchors: ESLAnchorData[]): ESLAnchorData[] {
  const roots: ESLAnchorData[] = [];
  const stack: ESLAnchorData[] = [];

  for (const anchor of flatAnchors) {
    anchor.children = [];
    anchor.parent = null;

    // Find parent in stack
    while (stack.length > 0 && (stack[stack.length - 1].data.level ?? 0) >= (anchor.data.level ?? 0)) {
      stack.pop();
    }

    if (stack.length === 0) {
      // Root level
      roots.push(anchor);
    } else {
      // Child level
      const parent = stack[stack.length - 1];
      parent.children!.push(anchor);
      anchor.parent = parent.id;
    }

    stack.push(anchor);
  }

  return roots;
}
