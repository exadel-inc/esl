import {tuple, wrap} from '../misc/array';
import {unwrapParenthesis} from '../misc/format';

type PseudoProcessor = (base: Element, sel: string) => Element | Element[] | null;
type ProcessorDescriptor = [string, string];

export abstract class TraversingUtil {
  /**
   * Check that {@param nodeA} and {@param nodeB} is from the same tree path.
   */
  static isRelative(nodeA: Node | null, nodeB: Node | null) {
    return nodeA && nodeB && (nodeA.contains(nodeB) || nodeB.contains(nodeA));
  }

  /**
   * Find closest parent node of {@param node} by {@param predicate}.
   * {@param skipSelf} to skip initial node
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
   * Build finder that find first matching element in the element chain declared by {@param next}
   */
  static buildIterableFinder(next: (el: Element) => Element | null) {
    return function (base: Element, sel: string): Element | null {
      for (let target: Element | null = next(base); target; target = next(target)) {
        if (!sel || target.matches(sel)) return target;
      }
      return null;
    };
  }

  /** @return first matching next sibling or null*/
  static findNext = TraversingUtil.buildIterableFinder((el) => el.nextElementSibling);
  /** @return first matching previous sibling or null*/
  static findPrev = TraversingUtil.buildIterableFinder((el) => el.previousElementSibling);
  /** @return first matching parent or null*/
  static findParent = TraversingUtil.buildIterableFinder((el) => el.parentElement);

  /** @return Array of all matching elements in subtree or empty array*/
  static findAll(base: Element, sel: string): Element[] {
    return sel ? Array.from(base.querySelectorAll(sel)) : [base];
  }
  /** @return Array of all matching children or empty array*/
  static findChildren(base: Element, sel: string): Element[] {
    return Array.from(base.children).filter((el: Element) => !sel || el.matches(sel));
  }

  /** @return first matching element reached via {@class TraversingQuery}*/
  static query(query: string, base?: Element): Element | null {
    return TraversingQuery.traverseQuery(query, true, base)[0] || null;
  }
  /** @return Array of all matching elements reached via {@class TraversingQuery}*/
  static queryAll(query: string, base?: Element): Element[] {
    return TraversingQuery.traverseQuery(query, false, base);
  }
}

/**
 * Traversing Query utility to find element via extended selector query
 * Extended query supports
 * - plain CSS selectors
 * - relative selector (selector that have no "root" part with the plain CSS selector will use base Element as a root)
 * - ::next and ::prev sibling pseudo-selectors
 * - ::parent & ::child pseudo-selectors
 * - ::find pseudo-selector
 * - ::first, ::last and :nth(#) limitation pseudo-selectors
 *
 * @example "#id .class [attr]" - find by CSS selector in current document
 * @example "" - get current base element
 * @example "::next" - get next sibling element
 * @example "::prev" - get previous sibling element
 * @example "::parent" - get base element parent
 * @example "::parent(#id .class [attr])" - find closest parent matching passed selector
 * @example "::child(#id .class [attr])" - find direct child element(s) that match passed selector
 * @example "::find(#id .class [attr])" - find child element(s) that match passed selector
 * @example "::parent::child(some-tag)" - find direct child element(s) that match tag 'some-tag' in the parent
 * @example "#id .class [attr]::parent" - find parent of element matching selector '#id .class [attr]' in document
 * @example "::find(.row)::last::parent" - find parent of the last element matching selector '.row' from the base element subtree
 */
class TraversingQuery {
  private static PROCESSORS: Record<string, PseudoProcessor> = {
    '::find': TraversingUtil.findAll,
    '::next': TraversingUtil.findNext,
    '::prev': TraversingUtil.findPrev,
    '::parent': TraversingUtil.findParent,
    '::child': TraversingUtil.findChildren
  };
  private static COLLECTION_PROCESSORS: Record<string, (els: Element[], sel?:string) => Element[]> = {
    '::first': (list: Element[]) => list.slice(0, 1),
    '::last': (list: Element[]) => list.slice(-1),
    '::nth': (list: Element[], sel?: string) => {
      const i = (sel ? +sel: NaN) - 1;
      if (isNaN(i) || i >= list.length || i < 0) return [];
      return [ list[i] ];
    }
  };

  /**
   * @return RegExp that selects all known processors in query string
   * e.g. /(::parent|::child|::next|::prev)/
   */
  private static get PROCESSOR_REGEX() {
    const keys = Object.keys(this.PROCESSORS).concat(Object.keys(this.COLLECTION_PROCESSORS));
    return new RegExp(`(${keys.join('|')})`, 'g');
  }

  private static traverse(collection: Element[], processors: ProcessorDescriptor[], findFirst: boolean): Element[] {
    if (!processors.length || !collection.length) return collection;
    const [[name, sel], ...rest] = processors;
    if (name in this.COLLECTION_PROCESSORS) {
      const processedItem: Element[] = this.COLLECTION_PROCESSORS[name](collection, sel);
      return this.traverse(processedItem, rest, findFirst);
    }
    const result: Element[] = [];
    for (const target of collection) {
      const processedItem: Element[] = wrap(this.PROCESSORS[name](target, sel));
      const resultCollection: Element[] = this.traverse(processedItem, rest, findFirst);
      if (!resultCollection.length) continue;
      if (findFirst) return resultCollection;
      resultCollection.forEach((item) => (result.indexOf(item) === -1) && result.push(item));
    }
    return result;
  }
  static traverseQuery(query: string, findFirst: boolean, base?: Element) {
    const parts = query.split(this.PROCESSOR_REGEX).map((term) => term.trim());
    const rootSel = parts.shift();
    const baseCollection = base ? [base] : [];
    const initial: Element[] = rootSel ? Array.from(document.querySelectorAll(rootSel)) : baseCollection;
    const processors: ProcessorDescriptor[] = tuple(parts).map(([name, selString]) => {
      const sel = unwrapParenthesis(selString || '');
      return [name || '', sel];
    });
    return this.traverse(initial, processors, findFirst);
  }
}
