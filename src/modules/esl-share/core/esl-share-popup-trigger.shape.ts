import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLSharePopupTrigger} from './esl-share-popup-trigger';

/**
 * Tag declaration interface of ESLSharePopupTrigger element
 * Used for TSX declaration
 */
export interface ESLSharePopupTriggerTagShape extends ESLBaseElementShape<ESLSharePopupTrigger> {
  /** Define the list of social networks or groups of them to display at popup (all by default) */
  list?: string;
  /** Define URL to share (current page URL by default) */
  'share-url'?: string;
  /** Define title to share (current document title by default) */
  'share-title'?: string;

  /** Allowed children */
  children?: any;
}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      /** {@link ESLSharePopupTrigger} custom tag */
      'esl-share-popup-trigger': ESLSharePopupTriggerTagShape;
    }
  }
}
