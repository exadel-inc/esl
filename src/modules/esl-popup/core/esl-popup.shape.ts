import type {ESLToggleableTagShape} from '../../esl-toggleable/core/esl-toggleable.shape';
import type {ESLPopup} from './esl-popup';
import type {PositionType} from './esl-popup-position';

/**
 * Tag declaration interface of {@link ESLPopup} element
 * Used for TSX declaration
 */
export interface ESLPopupShape extends ESLToggleableTagShape<ESLPopup> {
  /** Popup behavior if it does not fit in the window ('fit' by default) */
  behavior?: string;
  /**
   * Popup position relative to the trigger.
   * Currently supported: 'top', 'bottom', 'left', 'right' position types ('top' by default)
   */
  position?: PositionType;
}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      /** {@link ESLPopup} custom tag */
      'esl-popup': ESLPopupShape;
    }
  }
}
