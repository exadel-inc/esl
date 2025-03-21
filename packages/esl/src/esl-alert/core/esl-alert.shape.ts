import type {ESLToggleableTagShape} from '../../esl-toggleable/core/esl-toggleable.shape';
import type {ESLAlert} from './esl-alert';

/**
 * Tag declaration interface of {@link ESLAlert} element
 * Used for TSX declaration
 */
export interface ESLAlertShape extends ESLToggleableTagShape<ESLAlert> {
  /**
   * Defines the scope (using {@link ESLTraversingQuery} syntax) element to listen for an activation event.
   * Parent element by default
   */
  target?: string;
}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      /** {@link ESLAlert} custom tag */
      'esl-alert': ESLAlertShape;
    }
  }
}
