import type {ESLToggleableActionParams} from '../../esl-toggleable/core';
import type {PositionType, PositionOriginType, AlignmentType} from './esl-popup-position';

export interface ESLPopupActionParams extends ESLToggleableActionParams {
  /** popup position relative to trigger */
  position?: PositionType;
  /** clarification of the popup position, whether it should start on the outside of trigger or the inside of trigger */
  positionOrigin?: PositionOriginType;
  /** popup behavior if it does not fit in the window */
  behavior?: string;
  /** Disable hiding the popup depending on the visibility of the activator */
  disableActivatorObservation?: boolean;
  /** Alignment of the popup relative to the tether */
  alignmentTether?: AlignmentType;
  /** Safe margins on the edges of the popup. */
  marginTether?: number;
  /** Offset of the tether relative to the position on the trigger */
  offsetPlacement?: number;
  /** Offset of the popup in pixels from the trigger element */
  offsetTrigger?: number;
  /**
   * Offset in pixels from the edges of the container (or window if the container is not defined)
   *  value as a number for equals x and y offsets
   *  value as an array for different x and y offsets
   */
  offsetContainer?: number | [number, number];
  /** Margin around the element that is used as the viewport for checking the visibility of the popup activator */
  intersectionMargin?: string;
  /** Target to container element to define bounds of popups visibility */
  container?: string;
  /** Container element that defines bounds of popups visibility (is not taken into account if the container attr is set on popup) */
  containerEl?: HTMLElement;

  /** Extra class to add to popup on activation */
  extraClass?: string;
  /** Extra styles to add to popup on activation */
  extraStyle?: string;
}

export type ProxiedParams = Required<ESLPopupActionParams>;

/** List of ESLPopup config keys */
export const ESL_POPUP_CONFIG_KEYS: (keyof ESLPopupActionParams)[] = [
  'position',
  'positionOrigin',
  'behavior',
  'disableActivatorObservation',
  'alignmentTether',
  'marginTether',
  'offsetPlacement',
  'offsetTrigger',
  'offsetContainer',
  'intersectionMargin',
  'container',
  'containerEl',
  'extraClass',
  'extraStyle'] as const;
