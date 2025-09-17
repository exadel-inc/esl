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

  /** Define CSS selector of the parent group (default: 'esl-panel-group')*/
  'panel-group-sel'?: string;
}

declare global {
  export interface ESLIntrinsicElements {
    /** {@link ESLPanel} custom tag */
    'esl-panel': ESLPanelTagShape;
  }
}
