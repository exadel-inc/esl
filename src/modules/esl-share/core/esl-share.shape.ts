import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLShare} from './esl-share';

/**
 * Tag declaration interface of ESL Share element
 * Used for TSX declaration
 */
export interface ESLShareTagShape extends ESLBaseElementShape<ESLShare> {
  /** Define the list of social networks or groups of them to display (all by default) */
  list?: string;
  /** Define share buttons rendering mode */
  mode?: string;
  /** Define URL to share (current page URL by default) */
  'share-url'?: string;
  /** Define title to share (current document title by default) */
  'share-title'?: string;

  /** Children are not allowed for ESLShare */
  children?: never[];
}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      /** {@link ESLShare} custom tag */
      'esl-share': ESLShareTagShape;
    }
  }
}
