import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {DeviceDetector} from '../../../esl-utils/environment/device-detector';

/**
 * DPR preprocessor. Used to replace DPR shortcuts.
 * @author Alexey Stsefanovich (ala'n)
 *
 * @implements IMediaQueryPreprocessor statically
 */
@ExportNs('ScreenDPR')
export class ESLScreenDPR {
  protected static readonly VALUE_REGEXP = /(\d(\.\d)?)x/;

  /** Option to exclude dpr > 2 for bots */
  public static ignoreBotsDpr = false;

  public static toDPI(dpr: number) {
    return (96 * dpr).toFixed(1);
  }

  public static process(match: string) {
    if (!ESLScreenDPR.VALUE_REGEXP.test(match)) return;
    const dpr = parseFloat(match);
    if (dpr < 0 || isNaN(dpr)) return;
    if (ESLScreenDPR.ignoreBotsDpr && DeviceDetector.isBot && dpr > 1) return 'not all';
    if (DeviceDetector.isSafari) return `(-webkit-min-device-pixel-ratio: ${dpr})`;
    return `(min-resolution: ${ESLScreenDPR.toDPI(dpr)}dpi)`;
  }
}
