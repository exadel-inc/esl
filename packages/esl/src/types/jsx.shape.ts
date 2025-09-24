import type {ESLA11yGroupTagShape} from '../esl-a11y-group/core';
import type {ESLAlertTagShape} from '../esl-alert/core';
import type {ESLAnchornavTagShape} from '../esl-anchornav/core';
import type {ESLAnimateTagShape} from '../esl-animate/core';
import type {ESLCarouselTagShape, ESLCarouselNavDotsTagShape} from '../esl-carousel/core';
import type {ESLNoteTagShape, ESLFootnotesTagShape} from '../esl-footnotes/core';
import type {ESLSelectTagShape} from '../esl-forms/esl-select/core';
import type {ESLSelectListTagShape} from '../esl-forms/esl-select-list/core';
import type {ESLImageTagShape} from '../esl-image/core';
import type {ESLMediaTagShape} from '../esl-media/core';
import type {ESLPanelTagShape} from '../esl-panel/core';
import type {ESLPanelGroupTagShape} from '../esl-panel-group/core';
import type {ESLPopupTagShape} from '../esl-popup/core';
import type {ESLRandomTextTagShape} from '../esl-random-text/core';
import type {ESLScrollbarTagShape} from '../esl-scrollbar/core';
import type {ESLShareTagShape, ESLShareButtonTagShape, ESLShareListTagShape, ESLSharePopupTagShape} from '../esl-share/core';
import type {ESLTabTagShape, ESLTabsTagShape} from '../esl-tab/core';
import type {ESLToggleableTagShape, ESLToggleableDispatcherTagShape} from '../esl-toggleable/core';
import type {ESLTooltipTagShape} from '../esl-tooltip/core';
import type {ESLTriggerTagShape} from '../esl-trigger/core';

/** JSX ESL custom elements declarations **/
export interface ESLIntrinsicElements {
  /** The {@link ESLA11yGroup} tag declaration */
  'esl-a11y-group': ESLA11yGroupTagShape;
  /** The {@link ESLAlert} tag declaration */
  'esl-alert': ESLAlertTagShape;
  /** The {@link ESLAnchornav} tag declaration */
  'esl-anchornav': ESLAnchornavTagShape;
  /** The {@link ESLAnimate} tag declaration */
  'esl-animate': ESLAnimateTagShape;
  /** The {@link ESLCarousel} tag declaration */
  'esl-carousel': ESLCarouselTagShape;
  /** The {@link ESLCarouselNavDots} tag declaration */
  'esl-carousel-dots': ESLCarouselNavDotsTagShape;
  /** The {@link ESLFootnotes} tag declaration */
  'esl-footnotes': ESLFootnotesTagShape;
  /** The {@link ESLNote} tag declaration */
  'esl-note': ESLNoteTagShape;
  /** The {@link ESLSelect} tag declaration */
  'esl-select': ESLSelectTagShape;
  /** The {@link ESLSelectList} tag declaration */
  'esl-select-list': ESLSelectListTagShape;
  /** The {@link ESLImage} tag declaration */
  'esl-image': ESLImageTagShape;
  /** The {@link ESLMedia} tag declaration */
  'esl-media': ESLMediaTagShape;
  /** The {@link ESLPanel} tag declaration */
  'esl-panel': ESLPanelTagShape;
  /** The {@link ESLPanelGroup} tag declaration */
  'esl-panel-group': ESLPanelGroupTagShape;
  /** The {@link ESLPopup} tag declaration */
  'esl-popup': ESLPopupTagShape;
  /** The {@link ESLRandomText} tag declaration */
  'esl-random-text': ESLRandomTextTagShape;
  /** The {@link ESLScrollbar} tag declaration */
  'esl-scrollbar': ESLScrollbarTagShape;
  /** The {@link ESLShare} tag declaration */
  'esl-share': ESLShareTagShape;
  /** The {@link ESLShareButton} tag declaration */
  'esl-share-button': ESLShareButtonTagShape;
  /** The {@link ESLShareList} tag declaration */
  'esl-share-list': ESLShareListTagShape;
  /** The {@link ESLSharePopup} tag declaration */
  'esl-share-popup': ESLSharePopupTagShape;
  /** The {@link ESLTab} tag declaration */
  'esl-tab': ESLTabTagShape;
  /** The {@link ESLTabs} tag declaration */
  'esl-tabs': ESLTabsTagShape;
  /** The {@link ESLToggleable} tag declaration */
  'esl-toggleable': ESLToggleableTagShape;
  /** The {@link ESLToggleableDispatcher} tag declaration */
  'esl-toggleable-dispatcher': ESLToggleableDispatcherTagShape;
  /** The {@link ESLTooltip} tag declaration */
  'esl-tooltip': ESLTooltipTagShape;
  /** The {@link ESLTrigger} tag declaration */
  'esl-trigger': ESLTriggerTagShape;
}

// Default JSX namespace extension
declare global {
  namespace JSX {
    interface IntrinsicElements extends ESLIntrinsicElements {}
  }
}
