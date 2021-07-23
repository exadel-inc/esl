import {ExportNs} from '../../esl-utils/environment/export-ns';

const registry = new Map<string, ESLScreenBreakpoint>();

/**
 * ESL Screen Breakpoint Registry
 * @author Yuliya Adamskaya, Alexey Stsefanovich (ala'n)
 *
 * Breakpoint Registry is used to provide custom breakpoints for ESL Query
 */
@ExportNs('ScreenBreakpoint')
export class ESLScreenBreakpoint {
  public static readonly BP_REGEXP = /^([+-]?)([a-z]+)/i;
  public static readonly BP_NAME_REGEXP = /^[a-z]+/i;

  protected constructor(
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

  /**
   * Add or replace breakpoint shortcut that could be used inside of ESLMediaQuery
   * @param name - name of shortcut
   * @param minWidth - min width for breakpoint
   * @param maxWidth - max width for breakpoint
   */
  public static add(name: string, minWidth: number, maxWidth: number): ESLScreenBreakpoint | undefined {
    name = name.toLowerCase();
    if (ESLScreenBreakpoint.BP_NAME_REGEXP.test(name)) {
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

  /** All available breakpoints shortcuts */
  public static get names() {
    const keys: string[] = [];
    registry.forEach((value, key) => keys.push(key));
    return keys;
  }

  /** @returns breakpoints shortcut replacer */
  public static replacer(term: string) {
    const [, sign, bp] = term.match(ESLScreenBreakpoint.BP_REGEXP) || [];
    const shortcut = ESLScreenBreakpoint.for(bp);
    if (shortcut && sign === '+') return shortcut.mediaQueryGE;
    if (shortcut && sign === '-') return shortcut.mediaQueryLE;
    if (shortcut) return shortcut.mediaQuery;
  }
}

ESLScreenBreakpoint.add('xs', 1, 767);
ESLScreenBreakpoint.add('sm', 768, 991);
ESLScreenBreakpoint.add('md', 992, 1199);
ESLScreenBreakpoint.add('lg', 1200, 1599);
ESLScreenBreakpoint.add('xl', 1600, 999999);
