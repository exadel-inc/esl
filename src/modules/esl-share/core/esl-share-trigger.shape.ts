import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLShareTrigger} from './esl-share-trigger';

/**
 * Tag declaration interface of ESLShareTrigger element
 * Used for TSX declaration
 */
export interface ESLShareTriggerTagShape extends ESLBaseElementShape<ESLShareTrigger> {
  /** Allowed children */
  children?: any;
}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      /** {@link ESLShareTrigger} custom tag */
      'esl-share-trigger': ESLShareTriggerTagShape;
    }
  }
}
