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
  /** Disable hiding the popup depending on the visibility of the activator */
  disableActivatorObservation?: boolean;
  /** Margins on the edges of the arrow. */
  marginArrow?: string;
  /** Offset of the arrow as a percentage of the popup edge (0% - at the left edge, 100% - at the right edge, for RTL it is vice versa) */
  offsetArrow?: string;
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
