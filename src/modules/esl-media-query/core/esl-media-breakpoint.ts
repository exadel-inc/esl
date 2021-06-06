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
  public static get breakpointsNames() {
    const keys: string[] = [];
    registry.forEach((value, key) => keys.push(key));
    return keys;
  }

  /** Apply known screen breakpoints shortcuts */
  public static apply(str: string) {
    return str.replace(this.matcher, this.replacer.bind(this));
  }

  /** @returns breakpoints matcher regexp */
  public static get matcher() {
    return new RegExp(`@([+-]?)(${this.breakpointsNames.join('|')})\\b`, 'ig');
  }

  /** @returns breakpoints shortcut replacer */
  public static replacer(match: string, sign: string, bp: string) {
    const shortcut = this.for(bp) as ESLScreenBreakpoint;
    if (sign === '+') return shortcut.mediaQueryGE;
    if (sign === '-') return shortcut.mediaQueryLE;
    return shortcut.mediaQuery;
  }
}
