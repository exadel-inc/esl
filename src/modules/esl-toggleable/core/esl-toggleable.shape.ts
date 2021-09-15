import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLToggleable} from './esl-toggleable';

/**
 * Tag declaration interface of {@link ESLToggleable} element
 * Used for JSX declaration
 */
export interface ESLToggleableTagShape<T extends ESLToggleable = ESLToggleable> extends ESLBaseElementShape<T> {
  /** Define CSS class to add on the body element */
  'body-class'?: string;
  /** Define CSS class to add when the Toggleable is active */
  'active-class'?: string;

  /** Define Toggleable group meta information to organize groups */
  'group-name'?: string;

  /** Define selector to mark inner close triggers */
  'close-trigger'?: string;

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
