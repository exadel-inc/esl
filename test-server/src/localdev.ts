// Support for ES5 bundle target
import '../../src/polyfills/es5-target-shim';
// Builtin polyfills
import '../../src/polyfills/polyfills.es6';
// Validate environment
import '../../src/polyfills/polyfills.validate';

import './common/back-button';
import './common/test-media';
import './common/test-media-source';

// With Namespace
import '../../src/modules/lib';

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

import '../../src/modules/esl-media/providers/iframe-provider';
import '../../src/modules/esl-media/providers/html5/audio-provider';
import '../../src/modules/esl-media/providers/html5/video-provider';
import '../../src/modules/esl-media/providers/youtube-provider';
import '../../src/modules/esl-media/providers/brightcove-provider';

import {
  ESLCarousel,
  ESLCarouselPlugins
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
ESLCarouselPlugins.Dots.register();
ESLCarouselPlugins.Link.register();
ESLCarouselPlugins.Touch.register();
ESLCarouselPlugins.Autoplay.register();
