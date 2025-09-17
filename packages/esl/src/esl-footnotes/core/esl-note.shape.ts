import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLNote} from './esl-note';

/**
 * Tag declaration interface of ESL Note element
 * Used for TSX declaration
 */
export interface ESLNoteTagShape extends ESLBaseElementShape<ESLNote> {
  /** Target to container element {@link ESLTraversingQuery} to define bounds of tooltip visibility (window by default) */
  'container'?: string;

  /** Media query to specify that footnotes must ignore this note. Default: `not all` */
  'ignore'?: string;

  /** Tooltip content */
  'html'?: string;

  /**
   * Note label in stand-alone mode (detached from footnotes),
   * in the connected state it is a numeric index that is calculated automatically
   */
  'standalone-label'?: string;

  /** Define click event tracking media query */
  'track-click'?: boolean | string;
  /** Define hover event tracking media query */
  'track-hover'?: boolean | string;

  /** Allowed children */
  children?: any;
}

declare global {
  export interface ESLIntrinsicElements {
    /** {@link ESLNote} custom tag */
    'esl-note': ESLNoteTagShape;
  }
}
