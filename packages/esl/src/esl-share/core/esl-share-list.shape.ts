import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLShareList} from './esl-share-list';

/**
 * Tag declaration interface of ESLShareList element
 * Used for TSX declaration
 */
export interface ESLShareListTagShape extends ESLBaseElementShape<ESLShareList> {
  /** Define the list of social networks or groups of them to display (all by default) */
  list?: string;
  /** Define URL to share (current page URL by default) */
  'share-url'?: string;
  /** Define title to share (current document title by default) */
  'share-title'?: string;

  /** Children are not allowed for ESLShareList */
  children?: never[];
}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      /** {@link ESLShareList} custom tag */
      'esl-share-list': ESLShareListTagShape;
    }
  }
}
