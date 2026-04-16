import {buildHierarchyByLevel} from '../core/esl-anchornav.hierarchy';
import type {ESLAnchorData} from '../core/esl-anchornav';

describe('esl-anchornav: buildHierarchyByLevel', () => {
  const createAnchorData = (id: string, title: string, level?: number): ESLAnchorData => ({
    id,
    title,
    data: level !== undefined ? {level: String(level)} : {},
    $anchor: document.createElement('div')
  });

  describe('Flat structure (no hierarchy)', () => {
    test('should return all anchors as roots when no levels defined', () => {
      const anchors = [
        createAnchorData('a1', 'Anchor 1'),
        createAnchorData('a2', 'Anchor 2'),
        createAnchorData('a3', 'Anchor 3')
      ];

      const result = buildHierarchyByLevel(anchors);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('a1');
      expect(result[1].id).toBe('a2');
      expect(result[2].id).toBe('a3');
      result.forEach((anchor) => {
        expect(anchor.children).toEqual([]);
        expect(anchor.parent).toBeNull();
      });
    });

    test('should return all anchors as roots when all have same level', () => {
      const anchors = [
        createAnchorData('a1', 'Anchor 1', 0),
        createAnchorData('a2', 'Anchor 2', 0),
        createAnchorData('a3', 'Anchor 3', 0)
      ];

      const result = buildHierarchyByLevel(anchors);

      expect(result).toHaveLength(3);
      result.forEach((anchor) => {
        expect(anchor.children).toEqual([]);
        expect(anchor.parent).toBeNull();
      });
    });

    test('should handle empty array', () => {
      const result = buildHierarchyByLevel([]);
      expect(result).toEqual([]);
    });
  });

  describe('Simple hierarchy (2 levels)', () => {
    test('should build parent-child relationship', () => {
      const anchors = [
        createAnchorData('parent1', 'Parent 1', 0),
        createAnchorData('child1', 'Child 1', 1),
        createAnchorData('child2', 'Child 2', 1)
      ];

      const result = buildHierarchyByLevel(anchors);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('parent1');
      expect(result[0].children).toHaveLength(2);
      expect(result[0].children![0].id).toBe('child1');
      expect(result[0].children![1].id).toBe('child2');
      expect(result[0].children![0].parent).toBe('parent1');
      expect(result[0].children![1].parent).toBe('parent1');
    });

    test('should handle multiple root-level items with children', () => {
      const anchors = [
        createAnchorData('root1', 'Root 1', 0),
        createAnchorData('child1-1', 'Child 1.1', 1),
        createAnchorData('root2', 'Root 2', 0),
        createAnchorData('child2-1', 'Child 2.1', 1)
      ];

      const result = buildHierarchyByLevel(anchors);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('root1');
      expect(result[0].children).toHaveLength(1);
      expect(result[0].children![0].id).toBe('child1-1');
      expect(result[1].id).toBe('root2');
      expect(result[1].children).toHaveLength(1);
      expect(result[1].children![0].id).toBe('child2-1');
    });
  });

  describe('Deep hierarchy (3+ levels)', () => {
    test('should build 3-level hierarchy', () => {
      const anchors = [
        createAnchorData('h1', 'Heading 1', 0),
        createAnchorData('h2', 'Heading 2', 1),
        createAnchorData('h3', 'Heading 3', 2),
        createAnchorData('h4', 'Heading 4', 2),
        createAnchorData('h5', 'Heading 5', 1)
      ];

      const result = buildHierarchyByLevel(anchors);

      expect(result).toHaveLength(1);
      const root = result[0];
      expect(root.id).toBe('h1');
      expect(root.children).toHaveLength(2);

      // First child (level 1)
      expect(root.children![0].id).toBe('h2');
      expect(root.children![0].children).toHaveLength(2);
      expect(root.children![0].children![0].id).toBe('h3');
      expect(root.children![0].children![1].id).toBe('h4');

      // Second child (level 1)
      expect(root.children![1].id).toBe('h5');
      expect(root.children![1].children).toHaveLength(0);
    });

    test('should handle complex nested structure', () => {
      const anchors = [
        createAnchorData('s1', 'Section 1', 0),
        createAnchorData('s1.1', 'Subsection 1.1', 1),
        createAnchorData('s1.1.1', 'Sub-subsection 1.1.1', 2),
        createAnchorData('s1.2', 'Subsection 1.2', 1),
        createAnchorData('s2', 'Section 2', 0),
        createAnchorData('s2.1', 'Subsection 2.1', 1)
      ];

      const result = buildHierarchyByLevel(anchors);

      expect(result).toHaveLength(2);

      // Section 1
      expect(result[0].id).toBe('s1');
      expect(result[0].children).toHaveLength(2);
      expect(result[0].children![0].id).toBe('s1.1');
      expect(result[0].children![0].children).toHaveLength(1);
      expect(result[0].children![0].children![0].id).toBe('s1.1.1');
      expect(result[0].children![1].id).toBe('s1.2');

      // Section 2
      expect(result[1].id).toBe('s2');
      expect(result[1].children).toHaveLength(1);
      expect(result[1].children![0].id).toBe('s2.1');
    });
  });

  describe('Edge cases', () => {
    test('should handle children without parent (orphaned children)', () => {
      const anchors = [
        createAnchorData('orphan1', 'Orphan 1', 1),
        createAnchorData('orphan2', 'Orphan 2', 2)
      ];

      const result = buildHierarchyByLevel(anchors);

      // Orphans become roots
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('orphan1');
      expect(result[0].children).toHaveLength(1);
      expect(result[0].children![0].id).toBe('orphan2');
    });

    test('should handle level jumps (skipping levels)', () => {
      const anchors = [
        createAnchorData('root', 'Root', 0),
        createAnchorData('skip', 'Skip to level 3', 3)
      ];

      const result = buildHierarchyByLevel(anchors);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('root');
      expect(result[0].children).toHaveLength(1);
      expect(result[0].children![0].id).toBe('skip');
      expect(result[0].children![0].parent).toBe('root');
    });

    test('should handle decreasing then increasing levels', () => {
      const anchors = [
        createAnchorData('l0-1', 'Level 0-1', 0),
        createAnchorData('l1-1', 'Level 1-1', 1),
        createAnchorData('l2-1', 'Level 2-1', 2),
        createAnchorData('l0-2', 'Level 0-2', 0),
        createAnchorData('l1-2', 'Level 1-2', 1)
      ];

      const result = buildHierarchyByLevel(anchors);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('l0-1');
      expect(result[0].children![0].id).toBe('l1-1');
      expect(result[0].children![0].children![0].id).toBe('l2-1');
      expect(result[1].id).toBe('l0-2');
      expect(result[1].children![0].id).toBe('l1-2');
    });

    test('should handle mixed levels (some with, some without)', () => {
      const anchors = [
        createAnchorData('root', 'Root', 0),
        createAnchorData('no-level', 'No Level'),
        createAnchorData('child', 'Child', 1)
      ];

      const result = buildHierarchyByLevel(anchors);

      // Elements without level get default level 0, so 'no-level' becomes a root
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('root');
      expect(result[0].children).toHaveLength(0);
      expect(result[1].id).toBe('no-level');
      expect(result[1].children).toHaveLength(1);
      expect(result[1].children![0].id).toBe('child');
    });
  });

  describe('Parent references', () => {
    test('should set correct parent IDs', () => {
      const anchors = [
        createAnchorData('p1', 'Parent 1', 0),
        createAnchorData('c1', 'Child 1', 1),
        createAnchorData('gc1', 'Grandchild 1', 2)
      ];

      const result = buildHierarchyByLevel(anchors);

      expect(result[0].parent).toBeNull();
      expect(result[0].children![0].parent).toBe('p1');
      expect(result[0].children![0].children![0].parent).toBe('c1');
    });

    test('should maintain parent chain in complex structure', () => {
      const anchors = [
        createAnchorData('a', 'A', 0),
        createAnchorData('b', 'B', 1),
        createAnchorData('c', 'C', 2),
        createAnchorData('d', 'D', 3),
        createAnchorData('e', 'E', 1)
      ];

      buildHierarchyByLevel(anchors);

      expect(anchors[0].parent).toBeNull();
      expect(anchors[1].parent).toBe('a');
      expect(anchors[2].parent).toBe('b');
      expect(anchors[3].parent).toBe('c');
      expect(anchors[4].parent).toBe('a');
    });
  });

  describe('Children arrays', () => {
    test('should initialize empty children arrays', () => {
      const anchors = [
        createAnchorData('a', 'A', 0)
      ];

      const result = buildHierarchyByLevel(anchors);

      expect(result[0].children).toBeDefined();
      expect(result[0].children).toEqual([]);
    });

    test('should not share children arrays between anchors', () => {
      const anchors = [
        createAnchorData('a', 'A', 0),
        createAnchorData('b', 'B', 0)
      ];

      const result = buildHierarchyByLevel(anchors);

      result[0].children!.push(createAnchorData('test', 'Test', 1));
      expect(result[1].children).toHaveLength(0);
    });
  });

  describe('Real-world scenarios', () => {
    test('should handle typical documentation structure', () => {
      const anchors = [
        createAnchorData('intro', 'Introduction', 0),
        createAnchorData('getting-started', 'Getting Started', 0),
        createAnchorData('installation', 'Installation', 1),
        createAnchorData('npm', 'NPM', 2),
        createAnchorData('yarn', 'Yarn', 2),
        createAnchorData('usage', 'Usage', 1),
        createAnchorData('api', 'API Reference', 0),
        createAnchorData('methods', 'Methods', 1),
        createAnchorData('properties', 'Properties', 1)
      ];

      const result = buildHierarchyByLevel(anchors);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('intro');
      expect(result[0].children).toHaveLength(0);

      expect(result[1].id).toBe('getting-started');
      expect(result[1].children).toHaveLength(2);
      expect(result[1].children![0].id).toBe('installation');
      expect(result[1].children![0].children).toHaveLength(2);

      expect(result[2].id).toBe('api');
      expect(result[2].children).toHaveLength(2);
    });
  });
});

