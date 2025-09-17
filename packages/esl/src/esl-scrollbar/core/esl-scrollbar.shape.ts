import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLScrollbar} from './esl-scrollbar';

/**
 * Tag declaration interface of ESL Scrollbar
 * Used for TSX declaration
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

  /** Disable continuous scroll when the mouse button is pressed on the scrollbar */
  'no-continuous-scroll'?: boolean;

  /** Children are not allowed for ESLScrollbar*/
  children?: never[];
}

declare global {
  export interface ESLIntrinsicElements {
    /** {@link ESLScrollbar} custom tag */
    'esl-scrollbar': ESLScrollbarTagShape;
  }
}
