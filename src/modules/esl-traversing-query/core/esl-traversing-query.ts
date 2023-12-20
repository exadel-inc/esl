import {isElement} from '../../esl-utils/dom/api';
import {isVisible} from '../../esl-utils/dom/visible';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {tuple, wrap, uniq} from '../../esl-utils/misc/array';
import {unwrapParenthesis} from '../../esl-utils/misc/format';
import {findAll, findChildren, findNext, findParent, findClosest, findPrev} from '../../esl-utils/dom/traversing';

type ProcessorDescriptor = [string?, string?];
type ElementProcessor = (base: Element, sel: string) => Element | Element[] | null;
type CollectionProcessor = (els: Element[], sel: string) => Element[];

/**
 * Traversing Query utility to find element via extended selector query
 * Extended query supports
 * - plain CSS selectors
 * - relative selectors (selectors that don't start from a plain selector will use passed base Element as a root)
 * - ::next and ::prev sibling pseudo-selectors
 * - ::parent, ::closest and ::child pseudo-selectors
 * - ::find pseudo-selector
 * - ::first, ::last and :nth(#) limitation pseudo-selectors
 * - ::filter, ::not filtration pseudo-selectors
 *
 * @example
 * - `#id .class [attr]` - find by CSS selector in a current document
 * - ` ` - get current base element
 * - `::next` - get next sibling element
 * - `::prev` - get previous sibling element
 * - `::parent` - get base element parent
 * - `::parent(#id .class [attr])` - find the closest parent matching passed selector
 * - `::closest(#id .class [attr])` - find the closest ancestor including base element that matches passed selector
 * - `::child(#id .class [attr])` - find direct child element(s) that match passed selector
 * - `::find(#id .class [attr])` - find child element(s) that match passed selector
 * - `::find(buttons, a)::not([hidden])` - find all buttons and anchors that are not have hidden attribute
 * - `::find(buttons, a)::filter(:first-child)` - find all buttons and anchors that are first child in container
 * - `::parent::child(some-tag)` - find direct child element(s) that match tag 'some-tag' in the parent
 * - `#id .class [attr]::parent` - find parent of element matching selector '#id .class [attr]' in document
 * - `::find(.row)::last::parent` - find parent of the last element matching selector '.row' from the base element subtree
 */
@ExportNs('TraversingQuery')
export class ESLTraversingQuery {
  private static ELEMENT_PROCESSORS: Record<string, ElementProcessor> = {
    '::find': findAll,
    '::next': findNext,
    '::prev': findPrev,
    '::child': findChildren,
    '::parent': findParent,
    '::closest': findClosest
  };
  private static COLLECTION_PROCESSORS: Record<string, CollectionProcessor> = {
    '::first': (list: Element[]) => list.slice(0, 1),
    '::last': (list: Element[]) => list.slice(-1),
    '::nth': (list: Element[], sel?: string) => {
      const index = sel ? +sel : NaN;
      return wrap(list[index - 1]);
    },
    '::not': (list: Element[], sel?: string) => list.filter((el) => !el.matches(sel || '')),
    '::visible': (list: Element[]) => list.filter((el) => isElement(el) && isVisible(el)),
    '::filter': (list: Element[], sel?: string) => list.filter((el) => el.matches(sel || ''))
  };

  /**
   * @returns RegExp that selects all known processors in query string
   * e.g. /(::parent|::closest|::child|::next|::prev)/
   */
  private static get PROCESSORS_REGEX(): RegExp {
    const keys = Object.keys(this.ELEMENT_PROCESSORS).concat(Object.keys(this.COLLECTION_PROCESSORS));
    return new RegExp(`(${keys.join('|')})`, 'g');
  }

  private static isCollectionProcessor([name]: ProcessorDescriptor): boolean {
    return !!name && (name in this.COLLECTION_PROCESSORS);
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

  /** Split multiple queries separated by comma (respects query brackets) */
  // This can be solved by RegEx /(?<!\([^\)]*),(?![^\(]*\))/g)/, when the WebKit browser implements this feature
  public static splitQueries(str: string): string[] {
    let last = 0;
    let stack = 0;
    const result = [];
    for (let i = 0; i < str.length; i++) {
      if (str[i] === '(') stack++;
      if (str[i] === ')') stack = Math.max(0, stack - 1);
      if (str[i] === ',' && !stack) {
        result.push(str.substring(last, i).trim());
        last = i + 1;
      }
    }
    result.push(str.substring(last).trim());
    return result;
  }

  protected static traverse(query: string, findFirst: boolean, base?: Element | null, scope: Element | Document = document): Element[] {
    const found: Element[] = [];
    for (const part of ESLTraversingQuery.splitQueries(query)) {
      const els = this.traverseQuery(part, findFirst, base, scope);
      if (findFirst && els.length) return [els[0]];
      found.push(...els);
    }
    return uniq(found);
  }

  protected static traverseQuery(query: string, findFirst: boolean, base?: Element | null, scope: Element | Document = document): Element[] {
    const parts = query.split(this.PROCESSORS_REGEX).map((term) => term.trim());
    const rootSel = parts.shift();
    const baseCollection = base ? [base] : [];
    const initial: Element[] = rootSel ? Array.from(scope.querySelectorAll(rootSel)) : baseCollection;
    return this.traverseChain(initial, tuple(parts), findFirst);
  }

  /** @returns first matching element reached via {@link ESLTraversingQuery} rules */
  static first(query: string, base?: Element | null, scope?: Element | Document): Element | null {
    return ESLTraversingQuery.traverse(query, true, base, scope)[0] || null;
  }
  /** @returns Array of all matching elements reached via {@link ESLTraversingQuery} rules */
  static all(query: string, base?: Element | null, scope?: Element | Document): Element[] {
    return ESLTraversingQuery.traverse(query, false, base, scope);
  }
}

declare global {
  export interface ESLLibrary {
    TraversingQuery: typeof ESLTraversingQuery;
  }
}
