import {tuple, wrap} from '../misc/array';

type PseudoProcessor = (base: Element, sel: string, multiple?: boolean) => Element | Element[] | null;
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
  static closestBy(node: Node, predicate: (node: Node) => boolean, skipSelf = false): Node | null {
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

  static find(base: Element, sel: string, multiple: true): Element[];
  static find(base: Element, sel: string, multiple: false): Element | null;
  static find(base: Element, sel: string, multiple = false): Element[] | Element | null {
    if (!sel) return multiple ? [base] : base;
    return multiple ? Array.from(base.querySelectorAll(sel)): base.querySelector(sel);
  }

  static findChild(base: Element, sel: string, multiple: true): Element[];
  static findChild(base: Element, sel: string, multiple: false): Element | null;
  static findChild(base: Element, sel: string, multiple = false): Element[] | Element | null {
    const children = Array.from(base.children).filter((el: Element) => !sel || el.matches(sel));
    return multiple ? children : children[0];
  }

  static PROCESSORS: Record<string, PseudoProcessor> = {
    '::next': TraversingUtil.findNext,
    '::prev': TraversingUtil.findPrev,
    '::parent': TraversingUtil.findParent,
    '::find': TraversingUtil.find,
    '::child': TraversingUtil.findChild
  };

  static POST_PROCESSORS: Record<string, (els: Element[], sel?:string) => Element[]> = {
    '::first': (list: Element[]) => list.slice(0, 1),
    '::last': (list: Element[]) => list.slice(-1),
    '::nth': (list: Element[], sel?: string) => {
      const i = sel ? +sel: NaN;
      if (isNaN(i) || i >= list.length || i < 0) return [];
      return [ list[i] ];
    }
  };

  static PROCESSOR_KEYS = Object.keys(TraversingUtil.PROCESSORS).concat(Object.keys(TraversingUtil.POST_PROCESSORS));
  // /(::parent|::child|::next|::prev)/
  static PROCESSOR_REGEX = new RegExp(`(${TraversingUtil.PROCESSOR_KEYS.join('|')})`, 'g');

  static traverse(collection: Element[], processors: ProcessorDescriptor[], findFirst: boolean): Element[] {
    if (!processors.length || !collection.length) return collection;
    const [[name, selString], ...rest] = processors;
    if (!name) return [];
    const sel = (selString || '').replace(/^\(/, '').replace(/\)$/, '');
    if (name in TraversingUtil.POST_PROCESSORS) return TraversingUtil.POST_PROCESSORS[name](collection, sel);
    let result: Element[] = [];
    for(const target of collection) {
      const processedItem: Element[] = wrap(TraversingUtil.PROCESSORS[name](target, sel, true));
      const resultItem: Element[] = TraversingUtil.traverse(processedItem, rest, findFirst);
      if (resultItem.length && findFirst) return resultItem;
      result = result.concat(resultItem);
    }
    return result;
  }

  static query(query: string, base?: Element): Element | null {
    const parts = query.split(TraversingUtil.PROCESSOR_REGEX).map((term) => term.trim());
    const rootSel = parts.shift();
    const initial: Element[] = rootSel ? Array.from(document.querySelectorAll(rootSel)) : (base ? [base] : []);
    const processors: ProcessorDescriptor[] = tuple(parts);
    const result = TraversingUtil.traverse(initial, processors, true);
    return result[0] || null;
  }
  static queryAll(query: string, base?: Element): Element[] {
    const parts = query.split(TraversingUtil.PROCESSOR_REGEX).map((term) => term.trim());
    const rootSel = parts.shift();
    const initial: Element[] = rootSel ? Array.from(document.querySelectorAll(rootSel)) : (base ? [base] : []);
    const processors: ProcessorDescriptor[] = tuple(parts);
    return TraversingUtil.traverse(initial, processors, false);
  }
}
