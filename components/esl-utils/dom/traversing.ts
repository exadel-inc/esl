import {tuple, wrap} from '../misc/array';

type PseudoProcessor = (base: Element, sel: string) => Element | Element[] | null;
type ProcessorDescriptor = [string?, string?];

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

  static buildIterableFinder(next: (el: Element) => Element | null) {
    return function (base: Element, sel: string): Element | null {
      for (let target: Element | null = next(base); target; target = next(target)) {
        if (!sel || target.matches(sel)) return target;
      }
      return null;
    };
  }
  static findNext = TraversingUtil.buildIterableFinder((el) => el.nextElementSibling);
  static findPrev = TraversingUtil.buildIterableFinder((el) => el.previousElementSibling);
  static findParent = TraversingUtil.buildIterableFinder((el) => el.parentElement);

  static findAll(base: Element, sel: string): Element[] {
    return sel ? Array.from(base.querySelectorAll(sel)): [base];
  }
  static findChildren(base: Element, sel: string): Element[]{
    return Array.from(base.children).filter((el: Element) => !sel || el.matches(sel));
  }

  static PROCESSORS: Record<string, PseudoProcessor> = {
    '::find': TraversingUtil.findAll,
    '::next': TraversingUtil.findNext,
    '::prev': TraversingUtil.findPrev,
    '::parent': TraversingUtil.findParent,
    '::child': TraversingUtil.findChildren
  };

  static POST_PROCESSORS: Record<string, (els: Element[], sel?:string) => Element[]> = {
    '::first': (list: Element[]) => list.slice(0, 1),
    '::last': (list: Element[]) => list.slice(-1),
    '::nth': (list: Element[], sel?: string) => {
      const i = (sel ? +sel: NaN) - 1;
      if (isNaN(i) || i >= list.length || i < 0) return [];
      return [ list[i] ];
    }
  };

  private static PROCESSOR_KEYS = Object.keys(TraversingUtil.PROCESSORS).concat(Object.keys(TraversingUtil.POST_PROCESSORS));
  // /(::parent|::child|::next|::prev)/
  private static PROCESSOR_REGEX = new RegExp(`(${TraversingUtil.PROCESSOR_KEYS.join('|')})`, 'g');

  private static traverse(collection: Element[], processors: ProcessorDescriptor[], findFirst: boolean = false): Element[] {
    if (!processors.length || !collection.length) return collection;
    const [[name, selString], ...rest] = processors;
    if (!name) return [];
    const sel = (selString || '').replace(/^\(/, '').replace(/\)$/, '');
    if (name in TraversingUtil.POST_PROCESSORS) return TraversingUtil.POST_PROCESSORS[name](collection, sel);
    const result: Element[] = [];
    for(const target of collection) {
      const processedItem: Element[] = wrap(TraversingUtil.PROCESSORS[name](target, sel));
      const resultCollection: Element[] = TraversingUtil.traverse(processedItem, rest, findFirst);
      if (!resultCollection.length) continue;
      if (findFirst) return resultCollection;
      resultCollection.forEach((item) => (result.indexOf(item) === -1) && result.push(item));
    }
    return result;
  }
  private static traverseQuery(query: string, base?: Element, findFirst = false) {
    const parts = query.split(TraversingUtil.PROCESSOR_REGEX).map((term) => term.trim());
    const rootSel = parts.shift();
    const baseCollection = base ? [base] : [];
    const initial: Element[] = rootSel ? Array.from(document.querySelectorAll(rootSel)) : baseCollection;
    const processors: ProcessorDescriptor[] = tuple(parts);
    return TraversingUtil.traverse(initial, processors, findFirst);
  }

  static query(query: string, base?: Element): Element | null {
    return TraversingUtil.traverseQuery(query, base, true)[0] || null;
  }
  static queryAll(query: string, base?: Element): Element[] {
    return TraversingUtil.traverseQuery(query, base, false);
  }
}
