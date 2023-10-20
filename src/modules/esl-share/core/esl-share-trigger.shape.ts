import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLSharePopupTrigger} from './esl-share-trigger';

/**
 * Tag declaration interface of ESLSharePopupTrigger element
 * Used for TSX declaration
 */
export interface ESLShareTriggerTagShape extends ESLBaseElementShape<ESLSharePopupTrigger> {
  /** Allowed children */
  children?: any;
}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      /** {@link ESLSharePopupTrigger} custom tag */
      'esl-share-trigger': ESLShareTriggerTagShape;
    }
  }
}
