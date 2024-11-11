import {Rect} from '../../esl-utils/dom/rect';

import type {Point} from '../../esl-utils/dom/point';

export type PositionType = 'top' | 'bottom' | 'left' | 'right';
export type PositionOriginType = 'inner' | 'outer';

export interface PopupPositionValue {
  placedAt: PositionType;
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
 * Calculates the position of the popup on the minor axis
 * @param cfg - popup position config
 * @param centerPosition - position of the center of the trigger on the minor axis
 * @param dimensionName - the name of dimension (height or width)
 */
function calcPopupPositionByMinorAxis(cfg: PopupPositionConfig, centerPosition: number, dimensionName: 'height' | 'width'): number {
  return centerPosition - cfg.arrow[dimensionName] / 2 - cfg.marginArrow - calcUsableSizeForArrow(cfg, dimensionName) * cfg.offsetArrowRatio;
}

/**
 * Calculates Rect for given popup position config.
 * @param cfg - popup position config
 * */
function calcPopupBasicRect(cfg: PopupPositionConfig): Rect {
  const {position, inner, element, hasInnerOrigin} = cfg;
  let x = isOnHorizontalAxis(position) ? 0 : calcPopupPositionByMinorAxis(cfg, inner.cx, 'width');
  let y = isOnHorizontalAxis(position) ? calcPopupPositionByMinorAxis(cfg, inner.cy, 'height') : 0;
  switch (position) {
    case 'left':
      x = (hasInnerOrigin ? inner.right : inner.x) - element.width;
      break;
    case 'right':
      x = hasInnerOrigin ? inner.x : inner.right;
      break;
    case 'bottom':
      y = hasInnerOrigin ? inner.y : inner.bottom;
      break;
    default:
      y = (hasInnerOrigin ? inner.bottom : inner.y) - element.height;
      break;
  }
  return new Rect(x, y, element.width, element.height);
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
  return {arrow, popup, placedAt: cfg.position};
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

  const intersectionRatio = cfg.intersectionRatio[cfg.position] || 0;
  const leftComparand = isStartingSide(cfg.position) ? value.popup[cfg.position] : cfg.outer[cfg.position];
  const rightComparand = isStartingSide(cfg.position) ? cfg.outer[cfg.position] : value.popup[cfg.position];
  const isRequireAdjusting = intersectionRatio > 0 || leftComparand < rightComparand;

  return isRequireAdjusting ? adjustAlongMajorAxis(cfg, value) : value;
}

/**
 * Updates popup and arrow positions to fit on major axis.
 * @param cfg - popup position config
 * @param value - current popup's position value
 * @returns updated popup position value
 * */
function adjustAlongMajorAxis(cfg: PopupPositionConfig, value: PopupPositionValue): PopupPositionValue {
  const popup = isStartingSide(cfg.position)
    ? adjustForStartingSide(cfg, value.popup)
    : adjustForEndingSide(cfg, value.popup);
  const placedAt = getOppositePosition(cfg.position);
  return {...value, popup, placedAt};
}

/**
 * Updates popup rect to fit on major axis in case positioning on the starting side.
 * @param cfg - popup position config
 * @param popup - popup rect
 * @returns updated popup rect
 * */
function adjustForStartingSide(cfg: PopupPositionConfig, popup: Rect): Rect {
  const {position, inner, hasInnerOrigin} = cfg;
  let {x, y} = popup;
  switch (position) {
    case 'left':
      x = hasInnerOrigin ? inner.x : inner.right;
      break;
    case 'top':
      y = hasInnerOrigin ? inner.y : inner.bottom;
      break;
  }
  return new Rect(x, y, popup.width, popup.height);
}

/**
 * Updates popup rect to fit on major axis in case positioning on the ending side.
 * @param cfg - popup position config
 * @param popup - popup rect
 * @returns updated popup rect
 * */
function adjustForEndingSide(cfg: PopupPositionConfig, popup: Rect): Rect {
  const {position, inner, hasInnerOrigin} = cfg;
  let {x, y} = popup;
  switch (position) {
    case 'right':
      x = (hasInnerOrigin ? inner.right : inner.x) - popup.width;
      break;
    case 'bottom':
      y = (hasInnerOrigin ? inner.bottom : inner.y) - popup.height;
      break;
  }
  return new Rect(x, y, popup.width, popup.height);
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
    const dimension = isOnHorizontalAxis(cfg.position) ? 'height' : 'width';
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
  const dimension = isHorizontal ? 'height' : 'width';
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
function calcUsableSizeForArrow(cfg: PopupPositionConfig, dimensionName: 'height' | 'width'): number {
  return cfg.element[dimensionName] - cfg.arrow[dimensionName] - 2 * cfg.marginArrow;
}

/**
 * Calculates the position of the arrow on the minor axis
 * @param cfg - popup position config
 * @param dimensionName - the name of dimension (height or width)
 */
function calcArrowPosition(cfg: PopupPositionConfig, dimensionName: 'height' | 'width'): number {
  return cfg.marginArrow + calcUsableSizeForArrow(cfg, dimensionName) * cfg.offsetArrowRatio;
}

/**
 * Calculates popup and arrow popup positions.
 * @param cfg - popup position config
 * */
export function calcPopupPosition(cfg: PopupPositionConfig): PopupPositionValue {
  return fitOnMinorAxis(cfg, fitOnMajorAxis(cfg, calcBasicPosition(cfg)));
}
