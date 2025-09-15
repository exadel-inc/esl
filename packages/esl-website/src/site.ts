// With Namespace
import '@exadel/esl/modules/lib';
// Config
import './common/breakpoints';

import {
  ESLVSizeCSSProxy,
  ESLImageContainerMixin,
  ESLMedia,
  ESLMediaControlMixin,
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
  ESLDragToScrollMixin,
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
  ESLOpenState,
  ESLCarousel,
  ESLCarouselNavDots,
  ESLCarouselNavMixin,
  ESLCarouselTouchMixin,
  ESLCarouselWheelMixin,
  ESLCarouselKeyboardMixin,
  ESLCarouselRelateToMixin,
  ESLCarouselAutoplayMixin,
  ESLCarouselAutoplayProgressMixin,
  ESLCarouselClassBehaviourMixin,
  ESLLazyTemplate,
  ESLLineClamp
} from '@exadel/esl/modules/all';

import {ESLRandomText} from '@exadel/esl/modules/esl-random-text/core';

import '@exadel/esl/modules/esl-media/providers/iframe-provider';
import '@exadel/esl/modules/esl-media/providers/html5/audio-provider';
import '@exadel/esl/modules/esl-media/providers/html5/video-provider';
import '@exadel/esl/modules/esl-media/providers/youtube-provider';
import '@exadel/esl/modules/esl-media/providers/brightcove-provider';

import {ESLDemoAutofocus} from './autofocus/autofocus-mixin';
import {ESLDemoBackLink} from './back-link/back-link';
import {ESLDemoMarquee, ESLDemoMarqueeOwl} from './landing/landing';
import {ESLDemoSearchBox} from './navigation/header/header-search';
import {ESLDemoSearchPageWrapper} from './search/search';
import {ESLDemoSidebar} from './navigation/navigation';
import {ESLDemoAnchorLink} from './anchor/anchor-link';
import {ESLDemoBanner} from './banner/banner';
import {ESLDemoSwipeArea, ESLDemoWheelArea} from './esl-events-demo/esl-events-demo';
import {ESLDemoPopupGame} from './esl-popup/esl-d-popup-game';
import {ESLDemoNewLabel} from './landing/newsline/newsline';
import {ESLDemoDistanceToViewportAlert} from './esl-lazy-template-demo/distance-to-viewport-alert';

if (!CSS.supports('(height: 100dvh) or (width: 100dvw)')) ESLVSizeCSSProxy.observe();

// Register Demo components
ESLDemoAutofocus.register();
ESLDemoSidebar.register();
ESLDemoMarquee.register();
ESLDemoMarqueeOwl.register();
ESLDemoSearchBox.register();
ESLDemoSearchPageWrapper.register();
ESLDemoAnchorLink.register();
ESLDemoBackLink.register();
ESLDemoBanner.register();
ESLDemoSwipeArea.register();
ESLDemoWheelArea.register();
ESLDemoPopupGame.register();
ESLDemoNewLabel.register();
ESLDemoDistanceToViewportAlert.register();

// Test Content
ESLRandomText.register('lorem-ipsum');

// Register ESL Components
ESLImageContainerMixin.register();
ESLMedia.register();

ESLMediaControlMixin.register();

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
ESLDragToScrollMixin.register();

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

ESLCarousel.register();
ESLCarouselNavDots.register();
ESLCarouselNavMixin.register();
ESLCarouselTouchMixin.register();
ESLCarouselKeyboardMixin.register();
ESLCarouselRelateToMixin.register();
ESLCarouselAutoplayMixin.register();
ESLCarouselAutoplayProgressMixin.register();
ESLCarouselWheelMixin.register();
ESLCarouselClassBehaviourMixin.register();

ESLAnimate.register();
ESLAnimateMixin.register();

// Register ESL Mixins
ESLRelatedTarget.register();
ESLOpenState.register();
ESLLazyTemplate.register();

ESLLineClamp.DEFAULT_MASK = '@xs|@sm|@md|@lg|@xl';
ESLLineClamp.register();

// Share component loading
import(/* webpackChunkName: 'common/esl-share' */'./esl-share/esl-share');

// Anchornav component loading
import(/* webpackChunkName: 'common/esl-anchornav' */'./esl-anchornav/esl-anchornav');

if (document.querySelector('uip-root')) {
  // Init UI Playground
  import(/* webpackChunkName: "common/playground" */'./playground/ui-playground');
}
