import {tuple, wrap} from '../misc/array';
import {unwrapParenthesis} from '../misc/format';

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

  /** @return first matching element reached via {@class TraversingQuery}*/
  static query(query: string, base?: Element): Element | null {
    return TraversingQuery.traverseQuery(query, true, base)[0] || null;
  }
  /** @return Array of all matching elements reached via {@class TraversingQuery}*/
  static queryAll(query: string, base?: Element): Element[] {
    return TraversingQuery.traverseQuery(query, false, base);
  }
}

type ProcessorDescriptor = [string?, string?];
type ElementProcessor = (base: Element, sel: string) => Element | Element[] | null;
type CollectionProcessor = (els: Element[], sel: string) => Element[];

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
  private static ELEMENT_PROCESSORS: Record<string, ElementProcessor> = {
    '::find': TraversingUtils.findAll,
    '::next': TraversingUtils.findNext,
    '::prev': TraversingUtils.findPrev,
    '::child': TraversingUtils.findChildren,
    '::parent': TraversingUtils.findParent
  };
  private static COLLECTION_PROCESSORS: Record<string, CollectionProcessor> = {
    '::first': (list: Element[]) => list.slice(0, 1),
    '::last': (list: Element[]) => list.slice(-1),
    '::nth': (list: Element[], sel?: string) => {
      const index = sel ? +sel : NaN;
      return wrap(list[index - 1]);
    }
  };

  /**
   * @return RegExp that selects all known processors in query string
   * e.g. /(::parent|::child|::next|::prev)/
   */
  private static get PROCESSORS_REGEX() {
    const keys = Object.keys(this.ELEMENT_PROCESSORS).concat(Object.keys(this.COLLECTION_PROCESSORS));
    return new RegExp(`(${keys.join('|')})`, 'g');
  }

  private static processElement(el: Element, [name, selString]: ProcessorDescriptor): Element[] {
    const sel = unwrapParenthesis(selString || '');
    if (!name || !(name in this.ELEMENT_PROCESSORS)) return [];
    return wrap(this.ELEMENT_PROCESSORS[name](el, sel));
  }
  private static processCollection(els: Element[], [name, selString]: ProcessorDescriptor): Element[] {
    const sel = unwrapParenthesis(selString || '');
    if (!name || !(name in this.COLLECTION_PROCESSORS)) return [];
    return wrap(this.COLLECTION_PROCESSORS[name](els, sel));
  }
  private static isCollectionProcessor([name]: ProcessorDescriptor) {
    return name && (name in this.COLLECTION_PROCESSORS);
  }

  private static traverse(collection: Element[], processors: ProcessorDescriptor[], findFirst: boolean): Element[] {
    if (!processors.length || !collection.length) return collection;
    const [processor, ...rest] = processors;
    if (this.isCollectionProcessor(processor)) {
      const processedItem = this.processCollection(collection, processor);
      return this.traverse(processedItem, rest, findFirst);
    }
    const result: Element[] = [];
    for (const target of collection) {
      const processedItem = this.processElement(target, processor);
      const resultCollection: Element[] = this.traverse(processedItem, rest, findFirst);
      if (!resultCollection.length) continue;
      if (findFirst) return resultCollection;
      resultCollection.forEach((item) => (result.indexOf(item) === -1) && result.push(item));
    }
    return result;
  }

  static traverseQuery(query: string, findFirst: boolean, base?: Element) {
    const parts = query.split(this.PROCESSORS_REGEX).map((term) => term.trim());
    const rootSel = parts.shift();
    const baseCollection = base ? [base] : [];
    const initial: Element[] = rootSel ? Array.from(document.querySelectorAll(rootSel)) : baseCollection;
    return this.traverse(initial, tuple(parts), findFirst);
  }
}
