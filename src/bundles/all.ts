// HTMLElement ES6 extends shim
import '@helpers/es5-support/es6-htmlelement-shim';

// Builtin polyfills
import '@helpers/builtin-polyfils/object-polyfils';
import '@helpers/builtin-polyfils/closest-polyfill';

import {
  BreakpointRegistry,
  SmartQuery,
  SmartRuleList
} from '@components/smart-query/smart-query';
import { SmartImage } from '@components/smart-image/smart-image';
import { SmartVideo } from '@components/smart-video/smart-video';
import { SmartPopup } from '@components/smart-popup/smart-popup';
import { SmartPopupTrigger } from '@components/smart-trigger/smart-popup-trigger';
import { SmartCarousel, SmartCarouselDots } from '@components/smart-carousel/smart-carousel';

// TODO separate config
// BreakpointRegistry.addCustomBreakpoint('xxs', 300, 600); // Definition
// BreakpointRegistry.addCustomBreakpoint('xl', 1600, 2000); // Redefinition

// Default definition
SmartImage.register('smart-image');

export {
  BreakpointRegistry,
  SmartQuery,
  SmartRuleList,
  SmartImage,
  SmartPopup,
  SmartPopupTrigger,
  SmartVideo,
  SmartCarousel,
  SmartCarouselDots
};
