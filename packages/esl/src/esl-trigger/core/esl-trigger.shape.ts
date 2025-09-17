import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLTrigger} from './esl-trigger';
import type {ESLBaseTrigger} from './esl-base-trigger';

/**
 * Tag declaration interface of {@link ESLTrigger} element
 * Used for TSX declaration
 */
export interface ESLTriggerTagShape<T extends ESLBaseTrigger = ESLTrigger> extends ESLBaseElementShape<T> {
  /** Define target Toggleable {@link ESLTraversingQuery} selector. `next` by default */
  'target'?: string;

  /** Define an action to pass to the Toggleable */
  'mode'?: 'show' | 'hide' | 'toggle';

  /** Define CSS classes to set on active state */
  'active-class'?: string;
  /** Define target element {@link ESLTraversingQuery} selector to set `active-class` */
  'active-class-target'?: string;

  /** Define selector for ignored inner elements */
  'ignore'?: string;

  /** Define click event tracking media query */
  'track-click'?: boolean | string;
  /** Define hover event tracking media query */
  'track-hover'?: boolean | string;

  /** Disallow handle ESC keyboard event to hide target element */
  'ignore-esc'?: boolean;

  /** Define selector of inner target element to place aria attributes */
  'a11y-target'?: string;

  /** Define value of aria-label for active state */
  'a11y-label-active'?: string;
  /** Define value of aria-label for inactive state */
  'a11y-label-inactive'?: string;

  /** Define show delay value */
  'show-delay'?: string | number;
  /** Define hide delay value */
  'hide-delay'?: string | number;
  /** Define show delay value override for hover */
  'hover-show-delay'?: string | number;
  /** Define hide delay value override for hover */
  'hover-hide-delay'?: string | number;

  /** Allowed children */
  children?: any;
}
