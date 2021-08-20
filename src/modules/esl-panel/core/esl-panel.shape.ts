import type {ESLToggleableShape} from '../../esl-toggleable/core/esl-toggleable.shape';

/**
 * Tag declaration interface of {@link ESLPanel} element
 * Used for JSX declaration
 */
export interface ESLPanelShape extends ESLToggleableShape {
  /** Define class(es) to be added for active state ('open' by default) */
  'active-class'?: string;
  /** Define class(es) to be added during animation ('animate' by default) */
  'animate-class'?: string;
  /** Define class(es) to be added during animation after next render ('post-animate' by default) */
  'post-animate-class'?: string;

  /** Define time to clear animation common params (max-height style + classes) ('auto' by default) */
  'fallback-duration'?: string | number;
}
