import type {ESLTriggerTagShape} from '../../esl-trigger/core/esl-trigger.shape';
import type {ESLTab} from './esl-tab';

/**
 * Tag declaration interface of {@link ESLTab} element
 * Used for JSX declaration
 */
export interface ESLTabTagShape extends ESLTriggerTagShape<ESLTab> {
}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      'esl-tab': ESLTabTagShape;
    }
  }
}
