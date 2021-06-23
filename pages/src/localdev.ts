// Support for ES5 bundle target
import '../../src/polyfills/es5-target-shim';
// Builtin polyfills
import '../../src/polyfills/polyfills.es6';
// Validate environment
import '../../src/polyfills/polyfills.validate';

import './common/test-media';
import './common/test-media-source';

// With Namespace
import '../../src/modules/lib';

import {
  ESLImage,
  ESLMedia,
  ESLToggleable,
  ESLPopup,
  ESLPanel,
  ESLPanelGroup,
  ESLTrigger,
  ESLA11yGroup,
  ESLTabs,
  ESLTab,
  ESLScrollbar,
  ESLAlert,
  ESLToggleableDispatcher,
  ESLSelect,
  ESLSelectList,
  ESLNote,
  ESLFootnotes,
  ESLTooltip
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

ESLToggleableDispatcher.init();
ESLToggleable.register();
ESLPopup.register();

ESLPanelGroup.register();
ESLPanel.register();

ESLTrigger.register();
ESLTab.register();

ESLA11yGroup.register();
ESLTabs.register();

ESLScrollbar.register();
ESLAlert.register();
ESLAlert.init();

ESLSelectList.register();
ESLSelect.register();

ESLFootnotes.register();
ESLNote.register();
ESLTooltip.register();

ESLCarousel.register();
ESLCarouselPlugins.Dots.register();
ESLCarouselPlugins.Link.register();
ESLCarouselPlugins.Touch.register();
ESLCarouselPlugins.Autoplay.register();
