import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLStickyBox} from './esl-sticky-box';

/**
 * Tag declaration interface of {@link ESLStickyBox} element
 * Used for TSX declaration
 */
export interface ESLStickyBoxTagShape extends ESLBaseElementShape<ESLStickyBox> {
  /** Allowed children */
  children?: any;
}
