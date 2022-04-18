// Support for ES5 bundle target
import '../../src/polyfills/es5-target-shim';
// Builtin polyfills
import '../../src/polyfills/polyfills.es6';
// Validate environment
import '../../src/polyfills/polyfills.validate';

// With Namespace
import '../../src/modules/lib';
// Config
import './common/breakpoints';

import {
  ESLVSizeCSSProxy,
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
  ESLSortable,
  ESLToggleableDispatcher,
  ESLSelect,
  ESLSelectList,
  ESLNote,
  ESLFootnotes,
  ESLTooltip,
  ESLAnimate
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

import './esl-media-demo/test-media';
import './esl-media-demo/test-media-source';

import {ESLDemoSidebar} from './navigation/navigation';
import {ESLDemoMarquee} from './landing/landing';
import {ESLDemoSearchBox} from './navigation/header/header-search';

ESLVSizeCSSProxy.observe();

// Register Demo components
ESLDemoSidebar.register();
ESLDemoMarquee.register();
ESLDemoSearchBox.register();

// Register ESL Components

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
ESLAlert.init({
  closeOnOutsideAction: true
});

ESLSelectList.register();
ESLSelect.register();

ESLFootnotes.register();
ESLNote.register();
ESLTooltip.register();

ESLAnimate.register();

ESLSortable.register();

ESLCarousel.register();
ESLCarouselPlugins.Dots.register();
ESLCarouselPlugins.Link.register();
ESLCarouselPlugins.Touch.register();
ESLCarouselPlugins.Autoplay.register();
