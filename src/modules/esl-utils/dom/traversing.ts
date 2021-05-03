export abstract class TraversingUtils {
  /**
   * Check that {@param nodeA} and {@param nodeB} is from the same tree path.
   */
  static isRelative(nodeA: Node | null, nodeB: Node | null) {
    return nodeA && nodeB && (nodeA.contains(nodeB) || nodeB.contains(nodeA));
  }

  /**
   * Find closest parent node of {@param node} by {@param predicate}.
   * Optional {@param skipSelf} to skip initial node
   */
  static closestBy(node: Node | null, predicate: (node: Node) => boolean, skipSelf = false): Node | null {
    let current = skipSelf && node ? node.parentNode : node;
    while (current) {
      if (predicate(current)) return current;
      current = current.parentNode;
    }
    return null;
  }

  /**
   * Create function that find next dom element, that matches selector, in the sequence declared by {@param next} function
   */
  static createSequenceFinder(next: (el: Element) => Element | null) {
    return function (base: Element, sel: string): Element | null {
      for (let target: Element | null = next(base); target; target = next(target)) {
        if (!sel || target.matches(sel)) return target;
      }
      return null;
    };
  }

  /** @return first matching next sibling or null*/
  static findNext = TraversingUtils.createSequenceFinder((el) => el.nextElementSibling);
  /** @return first matching previous sibling or null*/
  static findPrev = TraversingUtils.createSequenceFinder((el) => el.previousElementSibling);
  /** @return first matching parent or null*/
  static findParent = TraversingUtils.createSequenceFinder((el) => el.parentElement);

  /** @return Array of all matching elements in subtree or empty array*/
  static findAll(base: Element, sel: string): Element[] {
    return sel ? Array.from(base.querySelectorAll(sel)) : [base];
  }
  /** @return Array of all matching children or empty array*/
  static findChildren(base: Element, sel: string): Element[] {
    return Array.from(base.children).filter((el: Element) => !sel || el.matches(sel));
  }
}
