import type {ESLToggleableTagShape} from '../../esl-toggleable/core/esl-toggleable.shape';
import type {ESLPopup} from './esl-popup';
import type {PositionType} from './esl-popup-position';

/**
 * Tag declaration interface of {@link ESLPopup} element
 * Used for TSX declaration
 */
export interface ESLPopupTagShape<T extends ESLPopup = ESLPopup> extends ESLToggleableTagShape<T> {
  /** Classname of popups arrow element */
  'arrow-class'?: string;
  /** Popup behavior if it does not fit in the window ('fit' by default) */
  behavior?: string;
  /** Target to container element {@link ESLTraversingQuery} to define bounds of popups visibility (window by default) */
  container?: string;
  /** Disable hiding the popup depending on the visibility of the activator */
  'disable-activator-observation'?: boolean;
  /** Margins on the edges of the arrow. */
  'margin-arrow'?: string;
  /** Offset of the arrow as a percentage of the popup edge (0% - at the left edge, 100% - at the right edge, for RTL it is vice versa) */
  'offset-arrow'?: string;
  /** Offset from the trigger element */
  'offset-trigger'?: string;
  /**
   * Popup position relative to the trigger.
   * Currently supported: 'top', 'bottom', 'left', 'right' position types ('top' by default)
   */
  position?: PositionType;
  /** clarification of the popup position, whether it should start on the outside of trigger or the inside of trigger ('outer' by default) */
  'position-origin'?: 'inner' | 'outer';

  /** Default params to merge into passed action params */
  'default-params'?: string;

  /** Allowed children */
  children?: any;
}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      /** {@link ESLPopup} custom tag */
      'esl-popup': ESLPopupTagShape;
    }
  }
}
