import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {MediaQueryCondition} from '../conditions/media-query-condition';

const registry = new Map<string, ESLScreenBreakpoint>();

/**
 * ESL Screen Breakpoints registry
 * @author Yuliya Adamskaya, Alexey Stsefanovich (ala'n)
 *
 * Screen Breakpoint registry is used to provide custom breakpoints for {@link ESLMediaQuery}
 *
 * @implements IMediaQueryPreprocessor statically
 */
@ExportNs('ScreenBreakpoints')
export abstract class ESLScreenBreakpoints {
  protected static readonly BP_REGEXP = /^([+-]?)([a-z]+)/i;
  protected static readonly BP_NAME_REGEXP = /^[a-z]+/i;

  /**
   * Add or replace breakpoint shortcut that can be used inside ESLMediaQuery
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
    throw new Error('The shortcut should consist only of Latin characters and be at least one character long.');
  }

  /** Removes screen breakpoint */
  public static remove(name: string): boolean {
    return registry.delete(name.toLowerCase());
  }

  /** @returns known breakpoint shortcut instance */
  public static get(name: string): ESLScreenBreakpoint | undefined {
    return registry.get((name || '').toLowerCase());
  }

  /** All available breakpoints names */
  public static get names(): string[] {
    return Array.from(registry.keys());
  }

  public static getMedia(term: string): string | undefined {
    const [, sign, bp] = ESLScreenBreakpoints.BP_REGEXP.exec(term) || [];
    const shortcut = ESLScreenBreakpoints.get(bp);
    if (!shortcut) return;
    if (sign === '+') return shortcut.mediaQueryGE;
    if (sign === '-') return shortcut.mediaQueryLE;
    return shortcut.mediaQuery;
  }

  /** @returns breakpoints shortcut replacement */
  public static process(term: string): MediaQueryCondition | undefined {
    const media = ESLScreenBreakpoints.getMedia(term);
    return media ? new MediaQueryCondition(media) : undefined;
  }
}

/** ESL Screen Breakpoint description */
export class ESLScreenBreakpoint {
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

  public toString(): string {
    return `[${this.name}]: ${this.min} to ${this.max}`;
  }
}

// Defaults
ESLScreenBreakpoints.add('xs', 1, 767);
ESLScreenBreakpoints.add('sm', 768, 991);
ESLScreenBreakpoints.add('md', 992, 1199);
ESLScreenBreakpoints.add('lg', 1200, 1599);
ESLScreenBreakpoints.add('xl', 1600, 999999);

declare global {
  export interface ESLLibrary {
    ScreenBreakpoints: typeof ESLScreenBreakpoints;
  }
}
