// Support for ES5 bundle target
import '@exadel/esl/polyfills/es5-target-shim';
// Builtin polyfills
import '@exadel/esl/polyfills/polyfills.es6';
// Validate environment
import '@exadel/esl/polyfills/polyfills.validate';

// With Namespace
import '@exadel/esl/modules/lib';
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
  ESLRelatedTarget,
  ESLOpenState
} from '@exadel/esl/modules/all';

import {ESLRandomText} from '@exadel/esl/modules/esl-random-text/core';

import '@exadel/esl/modules/esl-media/providers/iframe-provider';
import '@exadel/esl/modules/esl-media/providers/html5/audio-provider';
import '@exadel/esl/modules/esl-media/providers/html5/video-provider';
import '@exadel/esl/modules/esl-media/providers/youtube-provider';
import '@exadel/esl/modules/esl-media/providers/brightcove-provider';

import './esl-media-demo/test-media';

import {ESLDemoAutofocus} from './autofocus/autofocus-mixin';
import {ESLDemoBackLink} from './back-link/back-link';
import {ESLDemoMarquee} from './landing/landing';
import {ESLDemoSearchBox} from './navigation/header/header-search';
import {ESLDemoSearchPageWrapper} from './search/search';
import {ESLDemoSidebar} from './navigation/navigation';
import {ESLDemoAnchorLink} from './anchor/anchor-link';
import {ESLDemoBanner} from './banner/banner';
import {ESLDemoSwipeArea, ESLDemoWheelArea} from './esl-events-demo/esl-events-demo';

ESLVSizeCSSProxy.observe();

// Register Demo components
ESLDemoAutofocus.register();
ESLDemoSidebar.register();
ESLDemoMarquee.register();
ESLDemoSearchBox.register();
ESLDemoSearchPageWrapper.register();
ESLDemoAnchorLink.register();
ESLDemoBackLink.register();
ESLDemoBanner.register();
ESLDemoSwipeArea.register();
ESLDemoWheelArea.register();

// Test Content
ESLRandomText.register('lorem-ipsum');

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

// Register ESL Mixins
ESLRelatedTarget.register();
ESLOpenState.register();

// Share component loading
import (/* webpackChunkName: 'common/esl-share' */'./esl-share/esl-share');

if (document.querySelector('uip-root')) {
  // Init UI Playground
  import (
    /* webpackPrefetch: true */
    /* webpackChunkName: "playground" */
    '@exadel/ui-playground/esm/registration.js'
  ).then(({init}) => init());
}
