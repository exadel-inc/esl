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
  ESLNoteIgnore,
  ESLFootnotes,
  ESLTooltip,
  ESLAnimate,
  ESLAnimateMixin,
  ESLShare,
  ESLRelatedTarget
} from '../../src/modules/all';

import '../../src/modules/esl-media/providers/iframe-provider';
import '../../src/modules/esl-media/providers/html5/audio-provider';
import '../../src/modules/esl-media/providers/html5/video-provider';
import '../../src/modules/esl-media/providers/youtube-provider';
import '../../src/modules/esl-media/providers/brightcove-provider';

import '../../src/modules/esl-share/actions/copy-action';
import '../../src/modules/esl-share/actions/external-action';
import '../../src/modules/esl-share/actions/media-action';
import '../../src/modules/esl-share/actions/native-action';
import '../../src/modules/esl-share/actions/print-action';

import './esl-media-demo/test-media';
import './esl-media-demo/test-media-source';

import {ESLDemoBackLink} from './back-link/back-link';
import {ESLDemoMarquee} from './landing/landing';
import {ESLDemoSearchBox} from './navigation/header/header-search';
import {ESLDemoSearchPageWrapper} from './search/search';
import {ESLDemoSidebar} from './navigation/navigation';
import {ESLDemoAnchorLink} from './anchor/anchor-link';
import {ESLDemoBanner} from './banner/banner';

ESLVSizeCSSProxy.observe();

// Register Demo components
ESLDemoSidebar.register();
ESLDemoMarquee.register();
ESLDemoSearchBox.register();
ESLDemoSearchPageWrapper.register();
ESLDemoAnchorLink.register();
ESLDemoBackLink.register();
ESLDemoBanner.register();

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
ESLNoteIgnore.register();
ESLTooltip.register();

ESLAnimate.register();
ESLAnimateMixin.register();

ESLShare.config(() => fetch('/assets/share/config.json').then((response) => response.json()));
ESLShare.register();

// Register ESL Mixins
ESLRelatedTarget.register();
