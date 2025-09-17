import type {ESLPopupTagShape} from '../../esl-popup/core/esl-popup.shape';
import type {ESLSharePopup} from './esl-share-popup';

/**
 * Tag declaration interface of ESL Share Popup element
 * Used for TSX declaration
 */
export interface ESLSharePopupTagShape extends ESLPopupTagShape<ESLSharePopup> {
  /** Allowed children */
  children?: any;
}

declare global {
  export interface ESLIntrinsicElements {
    /** {@link ESLSharePopup} custom tag */
    'esl-share-popup': ESLSharePopupTagShape;
  }
}
