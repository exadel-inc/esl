import type {ESLAnchorData} from './esl-anchornav';

/** {@link ESLAnchornav} hierarchy builder function */
export type ESLAnchornavHierarchyBuilder = (flatAnchors: ESLAnchorData[]) => ESLAnchorData[];

/**
 * Builds hierarchy based on data-level attribute.
 * Anchors with smaller level values become parents of following anchors with larger values.
 * @param flatAnchors - flat list of anchors in DOM order
 * @returns hierarchical anchors list (roots only)
 */
export function buildHierarchyByLevel(flatAnchors: ESLAnchorData[]): ESLAnchorData[] {
  const roots: ESLAnchorData[] = [];
  const stack: ESLAnchorData[] = [];

  for (const anchor of flatAnchors) {
    const levelAttr = anchor.$anchor.dataset.level;
    anchor.level = levelAttr !== undefined ? parseInt(levelAttr, 10) : 0;
    anchor.children = [];
    anchor.parent = null;

    // Find parent in stack
    while (stack.length > 0 && (stack[stack.length - 1].level ?? 0) >= (anchor.level ?? 0)) {
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

