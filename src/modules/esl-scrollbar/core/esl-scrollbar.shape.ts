import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLScrollbar} from './esl-scrollbar';

/**
 * Tag declaration interface of ESL Scrollbar
 * Used for JSX declaration
 */
export interface ESLScrollbarTagShape extends ESLBaseElementShape<ESLScrollbar> {
  /** Define ESL Traversing Query for container element to observe with ESL Scrollbar */
  target?: string;

  /** Marker to make scrollbar oriented horizontally */
  horizontal?: boolean;

  /** thumb inner element class. 'scrollbar-thumb' by default. */
  'thumb-class'?: string;
  /** track inner element class. 'scrollbar-track' by default. */
  'track-class'?: string;

  /** Children are not allowed for ESLScrollbar*/
  children?: [];
}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      /** {@link ESLScrollbar} custom tag */
      'esl-scrollbar': ESLScrollbarTagShape;
    }
  }
}
