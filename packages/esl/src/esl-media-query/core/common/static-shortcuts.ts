import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {MediaQueryStaticCondition} from '../conditions/media-query-static';

const shortcuts = new Map<string, MediaQueryStaticCondition>();

/**
 * Static shortcuts' preprocessor. Used to store dynamic boolean shortcuts.
 * @author Alexey Stsefanovich (ala'n)
 *
 * @implements IMediaQueryPreprocessor statically
 */
@ExportNs('StaticShortcuts')
export class ESLStaticShortcuts {
  /**
   * Add mapping
   * @param shortcut - term to find in query
   * @param value - media query string or boolean result (that represents `all` or `not all` conditions)
   */
  public static set(shortcut: string, value: boolean): void {
    const name = shortcut.toLowerCase();
    if (shortcuts.has(name)) {
      shortcuts.get(name)!.matches = value;
    } else {
      shortcuts.set(name, new MediaQueryStaticCondition(name));
      shortcuts.get(name)!.matches = value;
    }
  }

  /** Replaces shortcut to registered result */
  public static process(match: string): MediaQueryStaticCondition | undefined {
    if (shortcuts.has(match)) return shortcuts.get(match);
  }
}
