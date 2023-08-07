import type {ESLToggleableTagShape} from '../../esl-toggleable/core/esl-toggleable.shape';
import type {ESLModal, ScrollLockStrategies} from './esl-modal';

/**
 * Tag declaration interface of {@link ESLModal} element
 * Used for TSX declaration
 */
export interface ESLModalTagShape extends ESLToggleableTagShape<ESLModal> {
  /** Disable modal backdrop */
  'no-backdrop'?: boolean;
  /** Provides modal movement to body before its opening */
  'inject-to-body'?: boolean;
  /** Defines a scroll lock strategy when the modal is open (default 'pseudo') */
  'scroll-lock-strategy'?: ScrollLockStrategies;
}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      /** {@link ESLModal} custom tag */
      'esl-modal': ESLModalTagShape;
    }
  }
}
