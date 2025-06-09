import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {isSafari} from '../../../esl-utils/environment/device-detector';
import {MediaQueryCondition} from '../conditions/media-query-condition';

/**
 * DPR preprocessor. Used to replace DPR shortcuts.
 * @author Alexey Stsefanovich (ala'n)
 *
 * @implements IMediaQueryPreprocessor statically
 */
@ExportNs('ScreenDPR')
export class ESLScreenDPR {
  protected static readonly VALUE_REGEXP = /(\d(\.\d)?)x/;

  public static toDPI(dpr: number): string {
    return (96 * dpr).toFixed(1);
  }

  public static getMedia(match: string): string | undefined {
    const dpr = parseFloat(match);
    if (dpr < 0 || isNaN(dpr)) return 'not all';
    if (isSafari) return `(-webkit-min-device-pixel-ratio: ${dpr})`;
    return `(min-resolution: ${ESLScreenDPR.toDPI(dpr)}dpi)`;
  }

  public static process(match: string): MediaQueryCondition | undefined {
    if (!ESLScreenDPR.VALUE_REGEXP.test(match)) return;
    const media = ESLScreenDPR.getMedia(match);
    return media ? new MediaQueryCondition(media) : undefined;
  }
}

declare global {
  export interface ESLLibrary {
    ScreenDPR: typeof ESLScreenDPR;
  }
}
