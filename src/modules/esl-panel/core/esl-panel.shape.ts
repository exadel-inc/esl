import type {ESLToggleableTagShape} from '../../esl-toggleable/core/esl-toggleable.shape';
import type {ESLPanel} from './esl-panel';

/**
 * Tag declaration interface of {@link ESLPanel} element
 * Used for TSX declaration
 */
export interface ESLPanelTagShape extends ESLToggleableTagShape<ESLPanel> {
  /** Define class(es) to be added for active state ('open' by default) */
  'active-class'?: string;
  /** Define class(es) to be added during animation ('animate' by default) */
  'animate-class'?: string;
  /** Define class(es) to be added during animation after next render ('post-animate' by default) */
  'post-animate-class'?: string;

  /** Define time to clear animation common params (max-height style + classes) ('auto' by default) */
  'fallback-duration'?: string | number;
}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      /** {@link ESLPanel} custom tag */
      'esl-panel': ESLPanelTagShape;
    }
  }
}
