import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLSortable} from './esl-sortable';

/**
 * Tag declaration interface of {@link ESLSortable} element
 * Used for TSX declaration
 */
export interface ESLSortableShape extends ESLBaseElementShape<ESLSortable> {
  /**
   *
   */
  horizontal?: boolean;

  /**
   *
   */
  animation?: string;

  /**
   *
   */
  duration?: number;

  /**
   *
   */
  group?: string;
}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      /** {@link Sortable} custom tag */
      'esl-sortable': ESLSortableShape;
    }
  }
}
