import {tuple, wrap, uniq} from '../../esl-utils/misc/array';
import {unwrapParenthesis} from '../../esl-utils/misc/format';
import {TraversingUtils} from '../../esl-utils/dom/traversing';

type ProcessorDescriptor = [string?, string?];
type ElementProcessor = (base: Element, sel: string) => Element | Element[] | null;
type CollectionProcessor = (els: Element[], sel: string) => Element[];

/**
 * Traversing Query utility to find element via extended selector query
 * Extended query supports
 * - plain CSS selectors
 * - relative selectors (selectors that don't start from a plain selector will use passed base Element as a root)
 * - ::next and ::prev sibling pseudo-selectors
 * - ::parent and ::child pseudo-selectors
 * - ::find pseudo-selector
 * - ::first, ::last and :nth(#) limitation pseudo-selectors
 *
 * @example "#id .class [attr]" - find by CSS selector in a current document
 * @example "" - get current base element
 * @example "::next" - get next sibling element
 * @example "::prev" - get previous sibling element
 * @example "::parent" - get base element parent
 * @example "::parent(#id .class [attr])" - find the closest parent matching passed selector
 * @example "::child(#id .class [attr])" - find direct child element(s) that match passed selector
 * @example "::find(#id .class [attr])" - find child element(s) that match passed selector
 * @example "::parent::child(some-tag)" - find direct child element(s) that match tag 'some-tag' in the parent
 * @example "#id .class [attr]::parent" - find parent of element matching selector '#id .class [attr]' in document
 * @example "::find(.row)::last::parent" - find parent of the last element matching selector '.row' from the base element subtree
 */
export class TraversingQuery {
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

  private static isCollectionProcessor([name]: ProcessorDescriptor) {
    return name && (name in this.COLLECTION_PROCESSORS);
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

  private static traverseChain(collection: Element[], processors: ProcessorDescriptor[], findFirst: boolean): Element[] {
    if (!processors.length || !collection.length) return collection;
    const [processor, ...rest] = processors;
    if (this.isCollectionProcessor(processor)) {
      const processedItem = this.processCollection(collection, processor);
      return this.traverseChain(processedItem, rest, findFirst);
    }
    const result: Element[] = [];
    for (const target of collection) {
      const processedItem = this.processElement(target, processor);
      const resultCollection: Element[] = this.traverseChain(processedItem, rest, findFirst);
      if (!resultCollection.length) continue;
      if (findFirst) return resultCollection.slice(0, 1);
      result.push(...resultCollection);
    }
    return uniq(result);
  }

  static traverse(query: string, findFirst: boolean, base?: Element) {
    const parts = query.split(this.PROCESSORS_REGEX).map((term) => term.trim());
    const rootSel = parts.shift();
    const baseCollection = base ? [base] : [];
    const initial: Element[] = rootSel ? Array.from(document.querySelectorAll(rootSel)) : baseCollection;
    return this.traverseChain(initial, tuple(parts), findFirst);
  }

  /** @return first matching element reached via {@class TraversingQuery} rules */
  static first(query: string, base?: Element): Element | null {
    return TraversingQuery.traverse(query, true, base)[0] || null;
  }
  /** @return Array of all matching elements reached via {@class TraversingQuery} rules */
  static all(query: string, base?: Element): Element[] {
    return TraversingQuery.traverse(query, false, base);
  }
}
