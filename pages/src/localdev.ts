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
  ESLPopupPlaceholder,
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
  ESLTooltip,
  ESLAnimate,
  ESLShareList,
  ESLShareConfig,
  ESLRelatedTarget
} from '../../src/modules/all';

import '../../src/modules/esl-media/providers/iframe-provider';
import '../../src/modules/esl-media/providers/html5/audio-provider';
import '../../src/modules/esl-media/providers/html5/video-provider';
import '../../src/modules/esl-media/providers/youtube-provider';
import '../../src/modules/esl-media/providers/brightcove-provider';

import {ESLShareCopyAction} from '../../src/modules/esl-share/actions/copy-action';
import {ESLShareMailAction} from '../../src/modules/esl-share/actions/mail-action';
import {ESLShareMediaAction} from '../../src/modules/esl-share/actions/media-action';
import {ESLSharePrintAction} from '../../src/modules/esl-share/actions/print-action';
import {ESLShareFetchConfigProvider} from '../../src/modules/esl-share/config-providers/fetch-provider';

import {
  ESLCarousel,
  ESLCarouselPlugins
} from '../../src/modules/draft/all';

import './esl-media-demo/test-media';
import './esl-media-demo/test-media-source';

import {ESLDemoBackLink} from './back-link/back-link';
import {ESLDemoMarquee} from './landing/landing';
import {ESLDemoSearchBox} from './navigation/header/header-search';
import {ESLDemoSearchPageWrapper} from './search/search';
import {ESLDemoSidebar} from './navigation/navigation';
import {ESLDemoAnchorLink} from './anchor/anchor-link';

ESLVSizeCSSProxy.observe();

// Register Demo components
ESLDemoSidebar.register();
ESLDemoMarquee.register();
ESLDemoSearchBox.register();
ESLDemoSearchPageWrapper.register();
ESLDemoAnchorLink.register();
ESLDemoBackLink.register();

// Register ESL Components
ESLImage.register();
ESLMedia.register();

ESLToggleableDispatcher.init();
ESLToggleable.register();
ESLPopup.register();
ESLPopupPlaceholder.register();

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

ESLCarousel.register();
ESLCarouselPlugins.Dots.register();
ESLCarouselPlugins.Link.register();
ESLCarouselPlugins.Touch.register();
ESLCarouselPlugins.Autoplay.register();

ESLShareCopyAction.register();
ESLShareMailAction.register();
ESLShareMediaAction.register();
ESLSharePrintAction.register();
ESLShareConfig.use(ESLShareFetchConfigProvider, {
  url: '/assets/share/config.json'
});
ESLShareList.register();

// Register ESL Mixins
ESLRelatedTarget.register();
