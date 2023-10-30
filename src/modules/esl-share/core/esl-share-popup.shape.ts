import type {ESLTooltipTagShape} from '../../esl-tooltip/core/esl-tooltip.shape';
import type {ESLSharePopup} from './esl-share-popup';

/**
 * Tag declaration interface of ESL Share Popup element
 * Used for TSX declaration
 */
export interface ESLSharePopupTagShape extends ESLTooltipTagShape<ESLSharePopup> {
  /** Allowed children */
  children?: any;
}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      /** {@link ESLSharePopup} custom tag */
      'esl-share-popup': ESLSharePopupTagShape;
    }
  }
}
