import type {ESLBaseElementShape} from '../../../esl-base-element/core/esl-base-element.shape';
import type {ESLSelectList} from './esl-select-list';

/**
 * Tag declaration interface of {@link ESLSelectList} element
 * Used for TSX declaration
 */
export interface ESLSelectListTagShape extends ESLBaseElementShape<ESLSelectList> {
  /** Define label to select all options text ('Select All' by default) */
  'select-all-label'?: string;

  /** Define state marker */
  disabled?: boolean;

  /** Define marker for selecting items to be pinned to the top of the list */
  'pin-selected'?: boolean;

  /** Allowed children */
  children?: any;
}
