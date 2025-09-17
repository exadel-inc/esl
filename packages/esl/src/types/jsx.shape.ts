import type {ESLA11yGroupTagShape} from '../esl-a11y-group/core';
import type {ESLAlertShape} from '../esl-alert/core';
import type {ESLAnchornavTagShape} from '../esl-anchornav/core';
import type {ESLAnimateShape} from '../esl-animate/core';
import type {ESLCarouselShape, ESLCarouselNavDotsShape} from '../esl-carousel/core';
import type {ESLNoteTagShape, ESLFootnotesTagShape} from '../esl-footnotes/core';
import type {ESLSelectTagShape} from '../esl-forms/esl-select/core';
import type {ESLSelectListTagShape} from '../esl-forms/esl-select-list/core';
import type {ESLImageTagShape} from '../esl-image/core';
import type {ESLMediaTagShape} from '../esl-media/core';
import type {ESLPanelTagShape} from '../esl-panel/core';
import type {ESLPanelGroupTagShape} from '../esl-panel-group/core';
import type {ESLPopupTagShape} from '../esl-popup/core';
import type {ESLRandomTextShape} from '../esl-random-text/core';
import type {ESLScrollbarTagShape} from '../esl-scrollbar/core';
import type {ESLShareTagShape, ESLShareButtonTagShape, ESLShareListTagShape, ESLSharePopupTagShape} from '../esl-share/core';
import type {ESLTabTagShape, ESLTabsTagShape} from '../esl-tab/core';
import type {ESLToggleableTagShape, ESLToggleableDispatcherTagShape} from '../esl-toggleable/core';
import type {ESLTooltipTagShape} from '../esl-tooltip/core';
import type {ESLTriggerTagShape} from '../esl-trigger/core';

/** JSX ESL custom elements declarations **/
export interface ESLIntrinsicElements {
  /** {@link ESLA11yGroup} custom tag */
  'esl-a11y-group': ESLA11yGroupTagShape;
  /** {@link ESLAlert} custom tag */
  'esl-alert': ESLAlertShape;
  /** {@link ESLAnchornav} custom tag */
  'esl-anchornav': ESLAnchornavTagShape;
  /** {@link ESLAnimate} custom tag */
  'esl-animate': ESLAnimateShape;
  /** {@link ESLAnimate} custom tag */
  'esl-carousel': ESLCarouselShape;
  /** {@link ESLCarouselNavDots} custom tag */
  'esl-carousel-dots': ESLCarouselNavDotsShape;
  /** {@link ESLFootnotes} custom tag */
  'esl-footnotes': ESLFootnotesTagShape;
  /** {@link ESLNote} custom tag */
  'esl-note': ESLNoteTagShape;
  /** {@link ESLSelect} custom tag */
  'esl-select': ESLSelectTagShape;
  /** {@link ESLSelectList} custom tag */
  'esl-select-list': ESLSelectListTagShape;
  /** {@link ESLImage} custom tag */
  'esl-image': ESLImageTagShape;
  /** {@link ESLMedia} custom tag */
  'esl-media': ESLMediaTagShape;
  /** {@link ESLPanel} custom tag */
  'esl-panel': ESLPanelTagShape;
  /** {@link ESLPanelGroup} custom tag */
  'esl-panel-group': ESLPanelGroupTagShape;
  /** {@link ESLPopup} custom tag */
  'esl-popup': ESLPopupTagShape;
  /** {@link ESLRandomTextShape} custom tag */
  'esl-random-text': ESLRandomTextShape;
  /** {@link ESLScrollbar} custom tag */
  'esl-scrollbar': ESLScrollbarTagShape;
  /** {@link ESLShare} custom tag */
  'esl-share': ESLShareTagShape;
  /** {@link ESLShareButton} custom tag */
  'esl-share-button': ESLShareButtonTagShape;
  /** {@link ESLShareList} custom tag */
  'esl-share-list': ESLShareListTagShape;
  /** {@link ESLSharePopup} custom tag */
  'esl-share-popup': ESLSharePopupTagShape;
  /** {@link ESLTab} custom tag */
  'esl-tab': ESLTabTagShape;
  /** {@link ESLTabs} custom tag */
  'esl-tabs': ESLTabsTagShape;
  /** {@link ESLToggleable} custom tag */
  'esl-toggleable': ESLToggleableTagShape;
  /** {@link ESLToggleableDispatcher} custom tag */
  'esl-toggleable-dispatcher': ESLToggleableDispatcherTagShape;
  /** {@link ESLTooltip} custom tag */
  'esl-tooltip': ESLTooltipTagShape;
  /** {@link ESLTrigger} custom tag */
  'esl-trigger': ESLTriggerTagShape;
}

// Default JSX namespace extension
declare global {
  namespace JSX {
    interface IntrinsicElements extends ESLIntrinsicElements {}
  }
}
