// HTMLElement ES6 extends shim
import '@helpers/es5-support/es6-htmlelement-shim';

// Builtin polyfills
import '@helpers/builtin-polyfills/array-polyfills';
import '@helpers/builtin-polyfills/object-polyfills';
import '@helpers/builtin-polyfills/closest-polyfills';

import { BreakpointRegistry, SmartQuery, SmartRuleList } from '@components/smart-query/smart-query';
import { SmartImage } from '@components/smart-image/smart-image';
import { SmartVideo } from '@components/smart-video/smart-video';
import { SmartPopup, SmartPopupTrigger } from '@components/smart-popup/smart-popup';
import { SmartCarousel, SmartCarouselDots, SmartCarouselAutoplayPlugin} from '@components/smart-carousel/smart-carousel';

// TODO separate config
// BreakpointRegistry.addCustomBreakpoint('xxs', 300, 600); // Definition
// BreakpointRegistry.addCustomBreakpoint('xl', 1600, 2000); // Redefinition

// Default definition
SmartImage.register();
// or SmartImage.register('my-image');

SmartVideo.register();

SmartCarousel.register();
SmartCarouselDots.register();
SmartCarouselAutoplayPlugin.register();

SmartPopup.register();
SmartPopupTrigger.register();

export {
  BreakpointRegistry,
  SmartQuery,
  SmartRuleList,
  SmartImage,
  SmartPopup,
  SmartPopupTrigger,
  SmartVideo,
  SmartCarousel,
  SmartCarouselDots,
  SmartCarouselAutoplayPlugin
};
