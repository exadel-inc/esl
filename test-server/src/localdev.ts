// With Namespace
import '../../src/modules/lib';
// Support for ES5 bundle target
import '../../src/polyfills/es5-target-shim';
// Builtin polyfills
import '../../src/polyfills/polyfills.es6';
// Validate environment
import '../../src/polyfills/polyfills.validate';

import './common/back-button';
import './common/test-media';
import './common/test-media-source';

import {
  ESLImage,
  ESLMedia,
  ESLPopup,
  ESLPanel,
  ESLPanelStack,
  ESLTrigger,
  ESLTriggersContainer,
  ESLTab,
  ESLTabsContainer,
  ESLScrollableTabs,
  ESLScrollbar
} from '../../src/modules/all';

import {
  ESLCarousel,
  CarouselPlugins
} from '../../src/modules/draft/all';

ESLImage.register();
ESLMedia.register();

ESLPopup.register();
ESLPanel.register();
ESLPanelStack.register();

ESLTrigger.register();
ESLTab.register();

ESLTriggersContainer.register();
ESLTabsContainer.register();
ESLScrollableTabs.register();

ESLScrollbar.register();

ESLCarousel.register();
CarouselPlugins.Dots.register();
CarouselPlugins.Link.register();
CarouselPlugins.Touch.register();
CarouselPlugins.Autoplay.register();
