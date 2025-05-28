import type {ESLToggleableTagShape} from '../../esl-toggleable/core/esl-toggleable.shape';
import type {ESLPopup} from './esl-popup';
import type {AlignmentType, PositionOriginType, PositionType} from './esl-popup-position';

/**
 * Tag declaration interface of {@link ESLPopup} element
 * Used for TSX declaration
 */
export interface ESLPopupTagShape<T extends ESLPopup = ESLPopup> extends ESLToggleableTagShape<T> {
  /** Alignment of the popup relative to the tether */
  'alignment-tether'?: AlignmentType;
  /** Classname of popups arrow element */
  'arrow-class'?: string;
  /** Popup behavior if it does not fit in the window ('fit' by default) */
  behavior?: string;
  /** Target to container element {@link ESLTraversingQuery} to define bounds of popups visibility (window by default) */
  container?: string;
  /** Disable hiding the popup depending on the visibility of the activator */
  'disable-activator-observation'?: boolean;
  /** Safe margins on the edges of the popup. */
  'margin-tether'?: number;
  /** Offset of the tether relative to the position on the trigger */
  'offset-placement'?: number;
  /** Offset from the trigger element */
  'offset-trigger'?: string;
  /**
   * Popup position relative to the trigger.
   * Currently supported: 'top', 'bottom', 'left', 'right' position types ('top' by default)
   */
  position?: PositionType;
  /** clarification of the popup position, whether it should start on the outside of trigger or the inside of trigger ('outer' by default) */
  'position-origin'?: PositionOriginType;

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
