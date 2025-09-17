import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLToggleableDispatcher} from './esl-toggleable-dispatcher';

/**
 * Tag declaration interface of {@link ESLToggleableDispatcher} element
 * Used for TSX declaration
 */
export interface ESLToggleableDispatcherTagShape extends ESLBaseElementShape<ESLToggleableDispatcher> {
  /** Children are not allowed for ESLToggleableDispatcher */
  children?: never[];
}

declare global {
  export interface ESLIntrinsicElements {
    /** {@link ESLToggleableDispatcher} custom tag */
    'esl-toggleable-dispatcher': ESLToggleableDispatcherTagShape;
  }
}
