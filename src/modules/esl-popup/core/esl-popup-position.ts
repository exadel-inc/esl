import {Rect} from '../../esl-utils/dom/rect';

import type {Point} from '../../esl-utils/dom/point';

export type DimensionNameType = 'width' | 'height';
export type PositionType = 'top' | 'bottom' | 'left' | 'right';
export type PositionOriginType = 'inner' | 'outer';
export type PlacedAtType = 'top' | 'bottom' | 'left' | 'right' | 'top-inner' | 'bottom-inner' | 'left-inner' | 'right-inner';

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
  position: PositionType;
  hasInnerOrigin: boolean;
  behavior: string;
  marginArrow: number;
  offsetArrowRatio: number;
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
export function isOnHorizontalAxis(position: PositionType): boolean {
  return ['left', 'right'].includes(position);
}

/**
 * Checks whether the specified position corresponds to the starting side
 * @param position - name of position
 */
function isStartingSide(position: PositionType): boolean {
  return ['left', 'top'].includes(position);
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
  const position = isOpposite ? getOppositePosition(cfg.position) : cfg.position;
  return `${position}${cfg.hasInnerOrigin ? '-inner' : ''}`;
}

/**
 * Calculates the position of the popup on the major axis
 * @param cfg - popup position config
 */
function calcPopupPositionByMajorAxis(cfg: PopupPositionConfig): number {
  const {position, inner, element, hasInnerOrigin} = cfg;
  const coord = inner[position];
  const size = element[getDimensionName(position)];
  return isStartingSide(position)
    ? (hasInnerOrigin ? coord : coord - size)
    : (hasInnerOrigin ? coord - size : coord);
}

/**
 * Calculates the position of the popup on the minor axis
 * @param cfg - popup position config
 */
function calcPopupPositionByMinorAxis(cfg: PopupPositionConfig): number {
  const {position, inner, arrow, marginArrow, offsetArrowRatio} = cfg;
  const centerPosition = inner[isOnHorizontalAxis(position) ? 'cy' : 'cx'];
  const dimensionName = getDimensionName(position, true);
  return centerPosition - arrow[dimensionName] / 2 - marginArrow - calcUsableSizeForArrow(cfg, dimensionName) * offsetArrowRatio;
}

/**
 * Calculates Rect for given popup position config.
 * @param cfg - popup position config
 * */
function calcPopupBasicRect(cfg: PopupPositionConfig): Rect {
  const {width, height} = cfg.element;
  const coordForMajor = calcPopupPositionByMajorAxis(cfg);
  const coordForMinor = calcPopupPositionByMinorAxis(cfg);
  return isOnHorizontalAxis(cfg.position)
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
 * Gets opposite position.
 * @param position - name of position
 * */
function getOppositePosition(position: PositionType): PositionType {
  return ({
    top: 'bottom',
    left: 'right',
    right: 'left',
    bottom: 'top'
  }[position] || position) as PositionType;
}

/**
 * Checks and updates popup and arrow positions to fit on major axis.
 * @param cfg - popup position config
 * @param value - current popup's position value
 * @returns updated popup position value
 * */
function fitOnMajorAxis(cfg: PopupPositionConfig, value: PopupPositionValue): PopupPositionValue {
  if (!['fit', 'fit-major'].includes(cfg.behavior)) return value;

  const {position, hasInnerOrigin, outer} = cfg;
  const intersectionRatio = cfg.intersectionRatio[hasInnerOrigin ? getOppositePosition(position) : position] || 0;
  const valueToCheck = hasInnerOrigin ? cfg.inner : value.popup;
  const isComingOut = isStartingSide(position)
    ? valueToCheck[position] < outer[position]
    : outer[position] < valueToCheck[position];
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
  const oppositeConfig = {...cfg, position: getOppositePosition(cfg.position)};
  const {x, y, width, height} = value.popup;
  const adjustedCoord = calcPopupPositionByMajorAxis(oppositeConfig);
  const popup = isOnHorizontalAxis(cfg.position)
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
    const dimension = getDimensionName(cfg.position, true);
    const arrowLimit = cfg.marginArrow + (isStart ? 0 : calcUsableSizeForArrow(cfg, dimension));
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
  const isHorizontal = isOnHorizontalAxis(cfg.position);
  const start = isHorizontal ? 'y' : 'x';
  const end = isHorizontal ? 'bottom' : 'right';
  const dimension = getDimensionName(cfg.position, true);
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
  return cfg.element[dimensionName] - cfg.arrow[dimensionName] - 2 * cfg.marginArrow;
}

/**
 * Calculates the position of the arrow on the minor axis
 * @param cfg - popup position config
 * @param dimensionName - the name of dimension (height or width)
 */
function calcArrowPosition(cfg: PopupPositionConfig, dimensionName: DimensionNameType): number {
  return cfg.marginArrow + calcUsableSizeForArrow(cfg, dimensionName) * cfg.offsetArrowRatio;
}

/**
 * Calculates popup and arrow popup positions.
 * @param cfg - popup position config
 * */
export function calcPopupPosition(cfg: PopupPositionConfig): PopupPositionValue {
  return fitOnMinorAxis(cfg, fitOnMajorAxis(cfg, calcBasicPosition(cfg)));
}
