/** Check that `nodeA` and `nodeB` are from the same tree path */
export const isRelativeNode = (nodeA: Node | null, nodeB: Node | null): boolean => {
  return !!(nodeA && nodeB) && (nodeA.contains(nodeB) || nodeB.contains(nodeA));
};

/** Create function that finds next dom element, that matches selector, in the sequence declared by `next` function */
export const createSequenceFinder = (next: (el: Element) => Element | null) => {
  return function (base: Element, sel: string): Element | null {
    for (let target: Element | null = next(base); target; target = next(target)) {
      if (!sel || target.matches(sel)) return target;
    }
    return null;
  };
};

/** Checks if element matches passed selector or exact predicate function */
export const isMatches = (el: Element, matcher?: string | ((el: Element) => boolean)): boolean => {
  if (typeof matcher === 'string') return el.matches(matcher);
  if (typeof matcher === 'function') return matcher(el);
  return false;
};

/** @returns first matching next sibling or null*/
export const findNext = createSequenceFinder((el) => el.nextElementSibling);
/** @returns first matching previous sibling or null*/
export const findPrev = createSequenceFinder((el) => el.previousElementSibling);
/** @returns first matching parent or null*/
export const findParent = createSequenceFinder((el) => el.parentElement);

/** @returns Array of all matching elements in subtree or empty array */
export const findAll = (base: Element, sel: string): Element[] => {
  return sel ? Array.from(base.querySelectorAll(sel)) : [base];
};
/** @returns Array of all matching children or empty array */
export const findChildren = (base: Element, sel: string): Element[] => {
  return Array.from(base.children).filter((el: Element) => !sel || el.matches(sel));
};

/**
 * Find closest parent node of `node` by `predicate`.
 * Optional `skipSelf` to skip initial node
 */
export const findClosestBy = (node: Node | null, predicate: (node: Node) => boolean, skipSelf = false): Node | null => {
  let current = skipSelf && node ? node.parentNode : node;
  while (current) {
    if (predicate(current)) return current;
    current = current.parentNode;
  }
  return null;
};

/**
 * Find looped next element within parent circle
 */
export const findNextLooped =
  createSequenceFinder((el) => el.nextElementSibling || (el.parentElement && el.parentElement.firstElementChild));

/**
 * Find looped previous element within parent circle (looped)
 */
export const findPrevLooped =
  createSequenceFinder((el) => el.previousElementSibling || (el.parentElement && el.parentElement.lastElementChild));

/** @deprecated Cumulative traversing utility set */
export abstract class TraversingUtils {
  static isRelative = isRelativeNode;
  static closestBy = findClosestBy;
  static createSequenceFinder = createSequenceFinder;

  static findNext = findNext;
  static findPrev = findPrev;
  static findParent = findParent;

  static findAll = findAll;
  static findChildren = findChildren;
}
