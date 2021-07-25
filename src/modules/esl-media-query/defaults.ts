import {DeviceDetector} from '../esl-utils/environment/device-detector';
import {ESLMediaQuery} from './core/esl-media-query';
import {ESLScreenDPR} from './core/esl-screen-dpr';
import {ESLScreenBreakpoint} from './core/esl-screen-breakpoint';

// Basic replacers
ESLMediaQuery.addReplacer(ESLScreenDPR);
ESLMediaQuery.addReplacer(ESLScreenBreakpoint);

// Touch check
ESLMediaQuery.addShortcut('touch', DeviceDetector.isTouchDevice);

// Basic device type shortcuts
ESLMediaQuery.addShortcut('bot', DeviceDetector.isBot);
ESLMediaQuery.addShortcut('mobile', DeviceDetector.isMobile);
ESLMediaQuery.addShortcut('desktop', !DeviceDetector.isMobile);

// Basic browser shortcuts
ESLMediaQuery.addShortcut('ie', DeviceDetector.isIE);
ESLMediaQuery.addShortcut('edge', DeviceDetector.isEdgeHTML);
ESLMediaQuery.addShortcut('gecko', DeviceDetector.isGecko);
ESLMediaQuery.addShortcut('blink', DeviceDetector.isBlink);
ESLMediaQuery.addShortcut('safari', DeviceDetector.isSafari);
