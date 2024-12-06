import type {ESLPopupTagShape} from '../../esl-popup/core/esl-popup.shape';
import type {ESLTooltip} from './esl-tooltip';

/**
 * Tag declaration interface of {@link ESLTooltip} element
 * Used for TSX declaration
 */
export interface ESLTooltipTagShape<T extends ESLTooltip = ESLTooltip> extends ESLPopupTagShape<T> {}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      /** {@link ESLTooltip} custom tag */
      'esl-tooltip': ESLTooltipTagShape;
    }
  }
}
