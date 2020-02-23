// HTMLElement ES6 extends shim
import '@polyfills/es5-target-shim';
// Builtin polyfills
import '@polyfills/polyfills'

// import { BreakpointRegistry, SmartQuery, SmartRuleList } from '@components/smart-query/smart-query';
import { SmartImage } from '@components/smart-image/smart-image';
import { SmartMedia } from '@components/smart-media/smart-media';
import { SmartPopup, SmartPopupTrigger } from '@components/smart-popup/smart-popup';
import { SmartCarousel, SmartCarouselDots, SmartCarouselLinkPlugin, SmartCarouselAutoplayPlugin} from '@components/smart-carousel/smart-carousel';

if (!('customElements' in window)) {
  throw new Error('Browser is not support customElements, load polyfills before');
}

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
