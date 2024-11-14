import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLToggleable} from './esl-toggleable';

/**
 * Tag declaration interface of {@link ESLToggleable} element
 * Used for TSX declaration
 */
export interface ESLToggleableTagShape<T extends ESLToggleable = ESLToggleable> extends ESLBaseElementShape<T> {
  /** Define CSS class to add on the body element */
  'body-class'?: string;
  /** Define CSS class to add when the Toggleable is active */
  'active-class'?: string;

  /** Define CSS class (supports {@link CSSClassUtils}) to add on the related element */
  'container-active-class'?: string;
  /** Define selector for the closest parent element to add/remove `container-active-class` */
  'container-active-class-target'?: string;

  /** Open toggleable marker. Can be used to define initial state */
  'open'?: boolean;

  /**
   * Define focus behavior
   *  - 'none' - no focus management
   *  - 'grab' - focus on the first focusable element
   *  - 'chain' - focus on the first focusable element first and return focus to the activator after the last focusable element
   *  - 'loop' - focus on the first focusable element and loop through the focusable elements
   */
  'focus-behavior'?: 'none' | 'chain' | 'loop';

  /** Define Toggleable group meta information to organize groups */
  'group'?: string;

  /** Disallow automatic id creation when it's empty */
  'no-auto-id'?: boolean;
  /** Define selector to mark inner close triggers */
  'close-on'?: string;
  /** Enable close the Toggleable on ESC keyboard event */
  'close-on-esc'?: boolean;
  /** Enable close the Toggleable on a click/tap outside */
  'close-on-outside-action'?: boolean;

  /** Define selector of inner target element to place aria attributes */
  'a11y-target'?: string;

  /** Define JSON of initial params to pass to show/hide action on the start */
  'initial-params'?: string | number;
  /** Define JSON of default params to merge into passed action params */
  'default-params'?: string | number;
  /** Define JSON of hover params to pass from track hover listener */
  'track-hover-params'?: string | number;

  /** Allowed children */
  children?: any;
}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      /** {@link ESLToggleable} custom tag */
      'esl-toggleable': ESLToggleableTagShape;
    }
  }
}
