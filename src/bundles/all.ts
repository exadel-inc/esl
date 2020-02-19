// HTMLElement ES6 extends shim
import '@helpers/es5-support/es6-htmlelement-shim';

// Builtin polyfills
import '@helpers/builtin-polyfills/array-polyfills';
import '@helpers/builtin-polyfills/object-polyfills';
import '@helpers/builtin-polyfills/closest-polyfills';

import { BreakpointRegistry, SmartQuery, SmartRuleList } from '@components/smart-query/smart-query';
import { SmartImage } from '@components/smart-image/smart-image';
import { SmartMedia } from '@components/smart-media/smart-media';
import { SmartPopup, SmartPopupTrigger } from '@components/smart-popup/smart-popup';
import { SmartCarousel, SmartCarouselDots, SmartCarouselLinkPlugin, SmartCarouselAutoplayPlugin} from '@components/smart-carousel/smart-carousel';

// TODO separate config
// BreakpointRegistry.addCustomBreakpoint('xxs', 300, 600); // Definition
// BreakpointRegistry.addCustomBreakpoint('xl', 1600, 2000); // Redefinition

// Default definition
SmartImage.register();
// or SmartImage.register('my-image');

SmartMedia.register();

SmartCarousel.register();
SmartCarouselDots.register();
SmartCarouselLinkPlugin.register();
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
  SmartMedia,
  SmartCarousel,
  SmartCarouselDots,
  SmartCarouselAutoplayPlugin
};
