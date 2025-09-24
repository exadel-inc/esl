import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLA11yGroup} from './esl-a11y-group';

/**
 * Tag declaration interface of {@link ESLA11yGroup} element
 * Used for TSX declaration
 */
export interface ESLA11yGroupTagShape extends ESLBaseElementShape<ESLA11yGroup> {
  /** Define target elements multiple selector ({@link ESLTraversingQuery} syntax) */
  'targets'?: string;

  /** Enable activation target (via click event) on selection */
  'activate-selected'?: boolean;

  /** Children are not allowed for ESLA11yGroup */
  children?: never[];
}
