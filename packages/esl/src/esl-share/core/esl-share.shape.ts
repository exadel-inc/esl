import type {ESLTriggerTagShape} from '../../esl-trigger/core/esl-trigger.shape';
import type {ESLShare} from './esl-share';

/**
* Tag declaration interface of {@link ESLShare} element
 * Used for TSX declaration
 */
export interface ESLShareTagShape<T extends ESLShare = ESLShare> extends ESLTriggerTagShape<T> {
  /** Define the list of social networks or groups of them to display at popup (all by default) */
  list?: string;
  /** Define URL to share (current page URL by default) */
  'share-url'?: string;
  /** Define title to share (current document title by default) */
  'share-title'?: string;
  /** Define JSON of params to pass into the popup */
  'popup-params'?: string;

  /** Allowed children */
  children?: any;
}

declare global {
  export interface ESLIntrinsicElements {
    /** {@link ESLShare} custom tag */
    'esl-share': ESLShareTagShape;
  }
}
