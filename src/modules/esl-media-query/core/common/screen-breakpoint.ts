import {ExportNs} from '../../../esl-utils/environment/export-ns';

const registry = new Map<string, ESLScreenBreakpoint>();

/**
 * ESL Screen Breakpoint Registry
 * @author Yuliya Adamskaya, Alexey Stsefanovich (ala'n)
 *
 * Breakpoint Registry is used to provide custom breakpoints for ESL Query
 */
export class ESLScreenBreakpoint {  // TODO: split or not split
  constructor(
    public readonly name: string,
    public readonly min: number,
    public readonly max: number
  ) {}

  public get mediaQuery(): string {
    return `(min-width: ${this.min}px) and (max-width: ${this.max}px)`;
  }

  public get mediaQueryGE(): string {
    return `(min-width: ${this.min}px)`;
  }

  public get mediaQueryLE(): string {
    return `(max-width: ${this.max}px)`;
  }

  public toString() {
    return `[${this.name}]: ${this.min} to ${this.max}`;
  }
}

@ExportNs('ScreenBreakpoint')
export abstract class ESLScreenBreakpoints {
  public static readonly BP_REGEXP = /^([+-]?)([a-z]+)/i;
  public static readonly BP_NAME_REGEXP = /^[a-z]+/i;

  /**
   * Add or replace breakpoint shortcut that could be used inside of ESLMediaQuery
   * @param name - name of shortcut
   * @param minWidth - min width for breakpoint
   * @param maxWidth - max width for breakpoint
   */
  public static add(name: string, minWidth: number, maxWidth: number): ESLScreenBreakpoint | undefined {
    name = name.toLowerCase();
    if (ESLScreenBreakpoints.BP_NAME_REGEXP.test(name)) {
      const current = registry.get(name);
      registry.set(name, new ESLScreenBreakpoint(name, minWidth, maxWidth));
      return current;
    }
    throw new Error('Shortcut should consist only from Latin characters. Length should be at least one character.');
  }

  /** @return known breakpoint shortcut instance */
  public static for(name: string) {
    return registry.get((name || '').toLowerCase());
  }

  /** All available breakpoints names */
  public static get names() {
    const keys: string[] = [];
    registry.forEach((value, key) => keys.push(key));
    return keys;
  }

  /** @returns breakpoints shortcut replacement */
  public static replace(term: string) {
    const [, sign, bp] = term.match(ESLScreenBreakpoints.BP_REGEXP) || [];
    const shortcut = ESLScreenBreakpoints.for(bp);
    if (shortcut && sign === '+') return shortcut.mediaQueryGE;
    if (shortcut && sign === '-') return shortcut.mediaQueryLE;
    if (shortcut) return shortcut.mediaQuery;
  }
}

// Defaults
ESLScreenBreakpoints.add('xs', 1, 767);
ESLScreenBreakpoints.add('sm', 768, 991);
ESLScreenBreakpoints.add('md', 992, 1199);
ESLScreenBreakpoints.add('lg', 1200, 1599);
ESLScreenBreakpoints.add('xl', 1600, 999999);
