/**
 * ESL Query Breakpoint Registry
 * @version 1.0.0
 * @author Yuliya Adamskaya
 *
 * Breakpoint Registry is used to provide custom breakpoints for ESL Query
 */
import {ExportNs} from '../../esl-utils/environment/export-ns';

class ScreenBreakpoint {
  public min: number;
  public max: number;

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  get mediaQuery(): string {
    return `(min-width: ${this.min}px) and (max-width: ${this.max}px)`;
  }

  get mediaQueryGE(): string {
    return `(min-width: ${this.min}px)`;
  }

  get mediaQueryLE(): string {
    return `(max-width: ${this.max}px)`;
  }
}

interface BreakpointsMapping {
  [key: string]: ScreenBreakpoint
}

// Default breakpoints provided in registry
const registry: BreakpointsMapping = {
  xs: new ScreenBreakpoint(1, 767),
  sm: new ScreenBreakpoint(768, 991),
  md: new ScreenBreakpoint(992, 1199),
  lg: new ScreenBreakpoint(1200, 1599),
  xl: new ScreenBreakpoint(1600, 999999)
};

const BP_NAME_REGEXP = /^[a-z]+/i;

@ExportNs('MediaBreakpoints')
export abstract class ESLMediaBreakpoints {
  /**
   * Add or replace breakpoint shortcut that could be used inside of ESLMediaQuery
   * @param name - name of shortcut
   * @param minWidth - min width for breakpoint
   * @param maxWidth - max width for breakpoint
   */
  public static addCustomBreakpoint(name: string, minWidth: number, maxWidth: number): ScreenBreakpoint {
    name = name.toLowerCase();
    if (BP_NAME_REGEXP.test(name)) {
      const current = registry[name];
      registry[name] = new ScreenBreakpoint(minWidth, maxWidth);
      return current;
    }
    throw new Error('Shortcut should consist only from Latin characters. Length should be at least one character.');
  }

  /**
   * @return known breakpoint shortcut instance
   */
  public static getBreakpoint(name: string): ScreenBreakpoint {
    return registry[(name || '').toLowerCase()];
  }

  /**
   * @returns all available breakpoints shortcuts
   */
  public static getAllBreakpointsNames() {
    return Object.keys(registry);
  }

  /**
   * Replaces known breakpoints shortcuts to the real media queries
   * @param query - original query string
   */
  public static apply(query: string) {
    const breakpoints = Object.keys(registry);
    const breakpointRegex = new RegExp(`@([+-]?)(${breakpoints.join('|')})\\b`, 'ig');

    return query.replace(breakpointRegex, (match, sign, bp) => {
      const shortcut = ESLMediaBreakpoints.getBreakpoint(bp);
      switch (sign) {
        case '+':
          return shortcut.mediaQueryGE;
        case '-':
          return shortcut.mediaQueryLE;
        default:
          return shortcut.mediaQuery;
      }
    });
  }
}

export default ESLMediaBreakpoints;
