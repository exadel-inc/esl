import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLFootnotes} from './esl-footnotes';

/**
 * Tag declaration interface of ESL Footnotes element
 * Used for TSX declaration
 */
export interface ESLFootnotesTagShape extends ESLBaseElementShape<ESLFootnotes> {
  /** Label for 'return to note' button title */
  'back-to-note-label'?: string;

  /** Grouping note instances with identical content enable/disable */
  'grouping'?: string;

  /** Target element {@link ESLTraversingQuery} to define scope */
  'scope-target'?: string;

  /** Children are not allowed for ESLShare */
  children?: never[];
}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      /** {@link ESLFootnotes} custom tag */
      'esl-footnotes': ESLFootnotesTagShape;
    }
  }
}
