import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLToggleableDispatcher} from './esl-toggleable-dispatcher';

/**
 * Tag declaration interface of {@link ESLToggleableDispatcher} element
 * Used for JSX declaration
 */
export interface ESLToggleableDispatcherTagShape extends ESLBaseElementShape<ESLToggleableDispatcher> {
  /** Children are not allowed for ESLToggleableDispatcher */
  children?: [];
}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      'esl-toggleable-dispatcher': ESLToggleableDispatcherTagShape;
    }
  }
}
