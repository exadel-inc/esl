import {ExportNs} from '../../esl-utils/environment/export-ns';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';
import {ESLScreenBreakpoint} from './esl-media-breakpoint';

export type ESLShortcutReplacerFn = (match: string, prefix: string, name: string) => string | false | undefined;

export interface ESLShortcutReplacer {
  replacer: ESLShortcutReplacerFn;
}

const replacers: (ESLShortcutReplacer | ESLShortcutReplacerFn)[] = [];

@ExportNs('MediaShortcuts')
export class ESLMediaShortcuts {
  public static PATTERN_DEFAULT = /@(([+-]?)([a-z0-9.-]+))/gi;

  public static register(shortcut: string, replacement: boolean | string): ESLMediaShortcuts {
    return this.registerReplacer((match: string) => {
      if (match !== shortcut) return;
      if (typeof replacement === 'string') return replacement;
      return replacement ? 'all' : 'not all';
    });
  }
  public static registerReplacer(replacer: ESLShortcutReplacer | ESLShortcutReplacerFn): ESLMediaShortcuts {
    replacers.unshift(replacer);
    return this;
  }

  public static replace(term: string) {
    return term.replace(ESLMediaShortcuts.PATTERN_DEFAULT, (match: string, shortcut: string, prefix: string, name: string) => {
      for (const replacer of replacers) {
        const replacerFn = ('replacer' in replacer) ? replacer.replacer : replacer;
        const result = replacerFn(shortcut.toLowerCase(), prefix, name);
        if (typeof result === 'string') return result;
      }
      return match;
    });
  }
}

@ExportNs('MediaDPRShortcut')
export class ESLMediaDPRShortcut {
  public static ignoreBotsDpr = false;
  public static get matcher() { return /(\d(\.\d)?)x/; }
  public static replacer(match: string) {
    if (!ESLMediaDPRShortcut.matcher.test(match)) return;
    const dpr = parseFloat(match);
    if (dpr < 0 || isNaN(dpr)) return;
    if (ESLMediaDPRShortcut.ignoreBotsDpr && DeviceDetector.isBot && dpr > 1) return 'not all';
    if (DeviceDetector.isSafari) return `(-webkit-min-device-pixel-ratio: ${dpr})`;
    return `(min-resolution: ${(96 * dpr).toFixed(1)}dpi)`;
  }
}

ESLMediaShortcuts.registerReplacer(ESLScreenBreakpoint);
ESLMediaShortcuts.registerReplacer(ESLMediaDPRShortcut);

// Touch check
ESLMediaShortcuts.register('touch', DeviceDetector.isTouchDevice);

// Basic device type shortcuts
ESLMediaShortcuts.register('bot', DeviceDetector.isBot);
ESLMediaShortcuts.register('mobile', DeviceDetector.isMobile);
ESLMediaShortcuts.register('desktop', !DeviceDetector.isMobile);

// Basic browser shortcuts
ESLMediaShortcuts.register('ie', DeviceDetector.isIE);
ESLMediaShortcuts.register('edge', DeviceDetector.isEdgeHTML);
ESLMediaShortcuts.register('gecko', DeviceDetector.isGecko);
ESLMediaShortcuts.register('blink', DeviceDetector.isBlink);
ESLMediaShortcuts.register('safari', DeviceDetector.isSafari);
