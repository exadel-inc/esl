import type {ESLBaseElementShape} from '../../../esl-base-element/core/esl-base-element.shape';
import type {ESLSelect} from './esl-select';

/**
 * Tag declaration interface of {@link ESLSelect} element
 * Used for TSX declaration
 */
export interface ESLSelectTagShape extends ESLBaseElementShape<ESLSelect> {
  /** Define placeholder text property */
  placeholder?: string;

  /** Define class(es) to mark not empty state */
  'has-value-class'?: string;

  /** Define class(es) for focused state. Select is also focused if the dropdown list is opened */
  'has-focus-class'?: string;

  /** Define class(es) for select dropdown */
  'dropdown-class'?: string;

  /** Define label to select all options text ('Select All' by default) */
  'select-all-label'?: string;

  /**
   * Define text to add when there is not enough space to show all selected options inline,
   * Supports `{rest}`, `{length}` and `{limit}` placeholders (`+ {rest} more...` by default)
   */
  'more-label-format'?: string;

  /** Define dropdown open marker */
  open?: boolean;

  /** Define state marker */
  disabled?: boolean;

  /** Define marker for selecting items to be pinned to the top of the list */
  'pin-selected'?: boolean;

  /** Allowed children */
  children?: any;
}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      /** {@link ESLSelect} custom tag */
      'esl-select': ESLSelectTagShape;
    }
  }
}
