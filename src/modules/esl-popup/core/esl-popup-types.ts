import type {ESLToggleableActionParams} from '../../esl-toggleable/core';
import type {PositionType, PositionOriginType} from './esl-popup-position';

export interface ESLPopupActionParams extends ESLToggleableActionParams {
  /** popup position relative to trigger */
  position?: PositionType;
  /** clarification of the popup position, whether it should start on the outside of trigger or the inside of trigger */
  positionOrigin?: PositionOriginType;
  /** popup behavior if it does not fit in the window */
  behavior?: string;
  /** Disable hiding the popup depending on the visibility of the activator */
  disableActivatorObservation?: boolean;
  /** Margins on the edges of the arrow. */
  marginArrow?: number;
  /** Offset of the arrow as a percentage of the popup edge (0% - at the left edge, 100% - at the right edge, for RTL it is vice versa) */
  offsetArrow?: string;
  /** Offset in pixels from the trigger element */
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

/** @deprecated alias, use {@link ESLPopupActionParams} instead, will be removed in v5.0.0 */
export type PopupActionParams = ESLPopupActionParams;

export type ProxiedParams = Required<ESLPopupActionParams>;

/** List of ESLPopupActionParams keys */
export const KEYSOF_POPUP_ACTION_PARAMS: string[] = [
  'position',
  'positionOrigin',
  'behavior',
  'disableActivatorObservation',
  'marginArrow',
  'offsetArrow',
  'offsetTrigger',
  'offsetContainer',
  'intersectionMargin',
  'container',
  'containerEl',
  'extraClass',
  'extraStyle'] as const;
