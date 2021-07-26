import {DeviceDetector} from '../esl-utils/environment/device-detector';
import {ESLMediaQuery} from './core/esl-media-query';
import {ESLScreenDPR} from './core/esl-screen-dpr';
import {ESLMediaShortcuts} from './core/esl-media-shortcuts';
import {ESLScreenBreakpoint} from './core/esl-screen-breakpoint';

// Basic replacers
ESLMediaQuery.addReplacer(ESLScreenDPR);
ESLMediaQuery.addReplacer(ESLScreenBreakpoint);
ESLMediaQuery.addReplacer(ESLMediaShortcuts);

// Touch check
ESLMediaShortcuts.add('touch', DeviceDetector.isTouchDevice);

// Basic device type shortcuts
ESLMediaShortcuts.add('bot', DeviceDetector.isBot);
ESLMediaShortcuts.add('mobile', DeviceDetector.isMobile);
ESLMediaShortcuts.add('desktop', !DeviceDetector.isMobile);

// Basic browser shortcuts
ESLMediaShortcuts.add('ie', DeviceDetector.isIE);
ESLMediaShortcuts.add('edge', DeviceDetector.isEdgeHTML);
ESLMediaShortcuts.add('gecko', DeviceDetector.isGecko);
ESLMediaShortcuts.add('blink', DeviceDetector.isBlink);
ESLMediaShortcuts.add('safari', DeviceDetector.isSafari);
