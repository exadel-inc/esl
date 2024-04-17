import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {isBot, isSafari} from '../../../esl-utils/environment/device-detector';

/**
 * DPR preprocessor. Used to replace DPR shortcuts.
 * @author Alexey Stsefanovich (ala'n)
 *
 * @implements IMediaQueryPreprocessor statically
 */
@ExportNs('ScreenDPR')
export class ESLScreenDPR {
  protected static readonly VALUE_REGEXP = /(\d(\.\d)?)x/;

  /** Option to exclude dpr greater then 2 for bots */
  public static ignoreBotsDpr = false;

  public static toDPI(dpr: number): string {
    return (96 * dpr).toFixed(1);
  }

  public static process(match: string): string | undefined {
    if (!ESLScreenDPR.VALUE_REGEXP.test(match)) return;
    const dpr = parseFloat(match);
    if (dpr < 0 || isNaN(dpr)) return;
    if (ESLScreenDPR.ignoreBotsDpr && isBot && dpr > 1) return 'not all';
    if (isSafari) return `(-webkit-min-device-pixel-ratio: ${dpr})`;
    return `(min-resolution: ${ESLScreenDPR.toDPI(dpr)}dpi)`;
  }
}

declare global {
  export interface ESLLibrary {
    ScreenDPR: typeof ESLScreenDPR;
  }
}
