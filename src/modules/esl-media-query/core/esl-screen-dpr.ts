import {ExportNs} from '../../esl-utils/environment/export-ns';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';

@ExportNs('ScreenDPR')
export class ESLScreenDPR {
  public static readonly VALUE_REGEXP = /(\d(\.\d)?)x/;

  /** Option to exclude dpr > 2 for bots */
  public static ignoreBotsDpr = false;

  public static replace(match: string) {
    if (!ESLScreenDPR.VALUE_REGEXP.test(match)) return;
    const dpr = parseFloat(match);
    if (dpr < 0 || isNaN(dpr)) return;
    if (ESLScreenDPR.ignoreBotsDpr && DeviceDetector.isBot && dpr > 1) return 'not all';
    if (DeviceDetector.isSafari) return `(-webkit-min-device-pixel-ratio: ${dpr})`;
    return `(min-resolution: ${ESLScreenDPR.toDPI(dpr)}dpi)`;
  }

  public static toDPI(dpr: number) {
    return (96 * dpr).toFixed(1);
  }
}
