// Support for ES5 bundle target
import './../../polyfills/es5-target-shim';
// Builtin polyfills
import './../../polyfills/polyfills.es6';
// Validate environment
import './../../polyfills/polyfills.validate';

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
} from '../../modules/all';

import {
  ESLCarousel,
  CarouselPlugins
} from '../../modules/beta/all';

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
