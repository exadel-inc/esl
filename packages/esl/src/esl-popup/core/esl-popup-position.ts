import {Rect} from '../../esl-utils/dom/rect';

import type {Point} from '../../esl-utils/dom/point';

export type DimensionNameType = 'width' | 'height';

export type PlacementType = 'top' | 'left' | 'bottom' | 'right';
export type AlignmentType = '' | 'start' | 'end';
export type PositionType = '' | PlacementType | AlignmentType | `${PlacementType} ${AlignmentType}`;
export type PositionOriginType = 'inner' | 'outer';
export type PlacedAtType = PlacementType | `${PlacementType}-inner`;

export interface PopupPositionValue {
  placedAt: PlacedAtType;
  popup: Rect;
  arrow: Point;
}

export interface IntersectionRatioRect {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

export interface PopupPositionConfig {
  placement: PlacementType;
  alignment?: AlignmentType;
  hasInnerOrigin: boolean;
  behavior: string;
  marginTether: number;
  offsetTetherRatio: number;
  offsetPlacement: number;
  intersectionRatio: IntersectionRatioRect;
  arrow: Rect;
  element: Rect;
  inner: Rect;
  outer: Rect;
  trigger: Rect;
  isRTL: boolean;
}

interface PopupAlignmentConfig {
  isHorizontal: boolean;
  start: 'x' | 'y';
  end: 'right' | 'bottom';
  isOutAtStart: boolean;
  isOutAtEnd: boolean;
  isWider: boolean;
}

/**
 * Checks that the position along the horizontal axis
 * @param position - name of position
 */
export function isOnHorizontalAxis(position: PositionType | PlacementType): boolean {
  return ['left', 'right'].includes(position.split(/\s+/)[0]);
}

/**
 * Checks whether the specified position corresponds to the starting side
 * @param position - name of position
 */
function isStartingSide(placement: PlacementType): boolean {
  return ['left', 'top'].includes(placement);
}

/**
 * Gets the name of the dimension along the axis of the specified position
 * @param position - name of position
 * @param alter - should it be the opposite dimension?
 */
function getDimensionName(position: PositionType, alter: boolean = false): DimensionNameType {
  const isHorizontal = isOnHorizontalAxis(position);
  return (alter ? !isHorizontal : isHorizontal) ? 'width' : 'height';
}

/**
 * Gets the name of the position where the arrow should be placed
 * @param cfg - popup position config
 * @param isOpposite - should it be the opposite position?
 */
function getPlacedAt(cfg: PopupPositionConfig, isOpposite: boolean = false): PlacedAtType {
  const position = isOpposite ? getOppositePlacement(cfg.placement) : cfg.placement;
  return `${position}${cfg.hasInnerOrigin ? '-inner' : ''}`;
}

/**
 * Calculates the position of the popup on the major axis
 * @param cfg - popup position config
 */
function calcPopupPositionByMajorAxis(cfg: PopupPositionConfig): number {
  const {placement, inner, element, hasInnerOrigin} = cfg;
  const coord = inner[placement];
  const size = element[getDimensionName(placement)];
  return isStartingSide(placement)
    ? (hasInnerOrigin ? coord : coord - size)
    : (hasInnerOrigin ? coord - size : coord);
}

/**
 * Calculates the position of the popup on the minor axis
 * @param cfg - popup position config
 */
function calcPopupPositionByMinorAxis(cfg: PopupPositionConfig): number {
  const {placement, arrow, offsetTetherRatio, marginTether} = cfg;
  const dimensionName = getDimensionName(placement, true);
  return calcTetherPlacement(cfg) - arrow[dimensionName] / 2 - marginTether - calcUsableSizeForArrow(cfg, dimensionName) * offsetTetherRatio;
}

/**
 * Gets the coordinate for tether placement based on the alignment and placement.
 * @param cfg - popup position config
 */
function getTetherPlacementCoord(cfg: PopupPositionConfig): 'y' | 'x' | 'bottom' | 'right' | 'cy' | 'cx' {
  if (cfg.alignment === 'start') return isOnHorizontalAxis(cfg.placement) ? 'y' : 'x';
  if (cfg.alignment === 'end') return isOnHorizontalAxis(cfg.placement) ? 'bottom' : 'right';
  return isOnHorizontalAxis(cfg.placement) ? 'cy' : 'cx';
}

/**
 * Calculates the tether placement coordinate on the minor axis.
 * @param cfg - popup position config
 */
function calcTetherPlacement(cfg: PopupPositionConfig): number {
  return cfg.trigger[getTetherPlacementCoord(cfg)] + cfg.offsetPlacement;
}

/**
 * Calculates Rect for given popup position config.
 * @param cfg - popup position config
 * */
function calcPopupBasicRect(cfg: PopupPositionConfig): Rect {
  const {width, height} = cfg.element;
  const coordForMajor = calcPopupPositionByMajorAxis(cfg);
  const coordForMinor = calcPopupPositionByMinorAxis(cfg);
  return isOnHorizontalAxis(cfg.placement)
    ? new Rect(coordForMajor, coordForMinor, width, height)
    : new Rect(coordForMinor, coordForMajor, width, height);
}

/**
 * Calculates position for all sub-parts of popup for given popup position config.
 * @param cfg - popup position config
 * */
function calcBasicPosition(cfg: PopupPositionConfig): PopupPositionValue {
  const popup = calcPopupBasicRect(cfg);
  const arrow = {
    x: calcArrowPosition(cfg, 'width'),
    y: calcArrowPosition(cfg, 'height'),
  };
  return {arrow, popup, placedAt: getPlacedAt(cfg)};
}

/**
 * Gets opposite placement.
 * @param placement - name of placement
 * */
function getOppositePlacement(placement: PlacementType): PlacementType {
  return ({
    top: 'bottom',
    left: 'right',
    right: 'left',
    bottom: 'top'
  }[placement] || placement) as PlacementType;
}

/**
 * Checks and updates popup and arrow positions to fit on major axis.
 * @param cfg - popup position config
 * @param value - current popup's position value
 * @returns updated popup position value
 * */
function fitOnMajorAxis(cfg: PopupPositionConfig, value: PopupPositionValue): PopupPositionValue {
  if (!['fit', 'fit-major'].includes(cfg.behavior)) return value;

  const {placement, hasInnerOrigin, outer} = cfg;
  const intersectionRatio = cfg.intersectionRatio[hasInnerOrigin ? getOppositePlacement(placement) : placement] || 0;
  const valueToCheck = hasInnerOrigin ? cfg.inner : value.popup;
  const isComingOut = isStartingSide(placement)
    ? valueToCheck[placement] < outer[placement]
    : outer[placement] < valueToCheck[placement];
  const isRequireAdjusting = hasInnerOrigin
    ? intersectionRatio === 0 && isComingOut
    : intersectionRatio > 0 || isComingOut;

  return isRequireAdjusting ? adjustAlongMajorAxis(cfg, value) : value;
}

/**
 * Updates popup and arrow positions to fit on major axis.
 * @param cfg - popup position config
 * @param value - current popup's position value
 * @returns updated popup position value
 * */
function adjustAlongMajorAxis(cfg: PopupPositionConfig, value: PopupPositionValue): PopupPositionValue {
  const oppositeConfig = {...cfg, placement: getOppositePlacement(cfg.placement)};
  const {x, y, width, height} = value.popup;
  const adjustedCoord = calcPopupPositionByMajorAxis(oppositeConfig);
  const popup = isOnHorizontalAxis(cfg.placement)
    ? new Rect(adjustedCoord, y, width, height)
    : new Rect(x, adjustedCoord, width, height);
  return {...value, popup, placedAt: getPlacedAt(cfg, true)};
}

/**
 * Calculates adjust for popup position to fit container bounds
 * @param cfg - popup position config
 * @param diffCoord - distance between the popup and the outer (container) bounding
 * @param arrowCoord - coordinate of the arrow
 * @param isStart - should it rely on the starting side?
 * @returns adjustment value for the coordinates of the arrow and the popup
 */
function adjustAlignmentBySide(cfg: PopupPositionConfig, diffCoord: number, arrowCoord: number, isStart: boolean): number {
  let arrowAdjust = 0;

  if (isStart ? diffCoord < 0 : diffCoord > 0) {
    arrowAdjust = diffCoord;
    const newCoord = arrowCoord + arrowAdjust;
    const dimension = getDimensionName(cfg.placement, true);
    const arrowLimit = cfg.marginTether + (isStart ? 0 : calcUsableSizeForArrow(cfg, dimension));
    if (isStart ? newCoord < arrowLimit : newCoord > arrowLimit) {
      arrowAdjust -= newCoord - arrowLimit;
    }
  }

  return arrowAdjust;
}

/**
 * Sets up the configuration for adjusting position along the minor axis
 * @param cfg - popup position config
 * @param popup - current popup's position value
 * @returns configuration for adjusting position along the minor axis
 */
function setupAlignmentBySide(cfg: PopupPositionConfig, popup: Rect): PopupAlignmentConfig {
  const isHorizontal = isOnHorizontalAxis(cfg.placement);
  const start = isHorizontal ? 'y' : 'x';
  const end = isHorizontal ? 'bottom' : 'right';
  const dimension = getDimensionName(cfg.placement, true);
  const isOutAtStart = popup[start] < cfg.outer[start];
  const isOutAtEnd = popup[end] > cfg.outer[end];
  const isWider = cfg.outer[dimension] < cfg.element[dimension];

  return {isHorizontal, start, end, isOutAtStart, isOutAtEnd, isWider};
}

/**
 * Updates popup and arrow positions to fit on minor axis.
 * @param cfg - popup position config
 * @param value - current popup's position value
 * @returns updated popup position value
 * */
function fitOnMinorAxis(cfg: PopupPositionConfig, value: PopupPositionValue): PopupPositionValue {
  if (!['fit', 'fit-minor'].includes(cfg.behavior)) return value;

  const {popup, arrow} = value;
  const {isHorizontal, start, end, isOutAtStart, isOutAtEnd, isWider} = setupAlignmentBySide(cfg, popup);

  // nothing to do when there is no outing
  if (!isOutAtStart && !isOutAtEnd) return value;
  // start-side adjusting happens if there is only start-side outing or LTR content direction
  const isStarting = isOutAtStart && (!isOutAtEnd || !cfg.isRTL);

  // the side for calculating the distance between the popup and the outer (container) bounding should be:
  // - when the popup is wider than the container the diff side should depend on the text direction
  //   (start side for LTR, end side for RTL)
  // - else we should choose start side if start-side outing or end side if end-side outing
  const diffSide = (isWider ? !cfg.isRTL : isStarting) ? start : end;
  const diff = popup[diffSide] - cfg.outer[diffSide];
  const shift = adjustAlignmentBySide(cfg, diff, arrow[start], isStarting);
  arrow[start] += shift;
  return {
    ...value,
    popup: isHorizontal ? popup.shift(0, -shift) : popup.shift(-shift, 0),
    arrow
  };
}

/**
 * Calculates the usable size available for the arrow
 * @param cfg - popup position config
 * @param dimensionName - the name of dimension (height or width)
 */
function calcUsableSizeForArrow(cfg: PopupPositionConfig, dimensionName: DimensionNameType): number {
  return cfg.element[dimensionName] - cfg.arrow[dimensionName] - 2 * cfg.marginTether;
}

/**
 * Calculates the position of the arrow on the minor axis
 * @param cfg - popup position config
 * @param dimensionName - the name of dimension (height or width)
 */
function calcArrowPosition(cfg: PopupPositionConfig, dimensionName: DimensionNameType): number {
  return cfg.marginTether + calcUsableSizeForArrow(cfg, dimensionName) * cfg.offsetTetherRatio;
}

/**
 * Calculates popup and arrow popup positions.
 * @param cfg - popup position config
 * */
export function calcPopupPosition(cfg: PopupPositionConfig): PopupPositionValue {
  return fitOnMinorAxis(cfg, fitOnMajorAxis(cfg, calcBasicPosition(cfg)));
}
