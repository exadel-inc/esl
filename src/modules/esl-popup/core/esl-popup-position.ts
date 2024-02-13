// TODO: make implemenatation immutable

import {Rect} from '../../esl-utils/dom/rect';

import type {Point} from '../../esl-utils/dom/point';

export type PositionType = 'top' | 'bottom' | 'left' | 'right';

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
  behavior: string;
  marginArrow: number;
  offsetArrowRatio: number;
  intersectionRatio: IntersectionRatioRect;
  arrow: Rect;
  element: Rect;
  inner: Rect;
  outer: Rect;
  trigger: Rect;
}

/**
 * Checks that the position along the horizontal axis
 * @param position - name of position
 */
export function isMajorAxisHorizontal(position: PositionType): boolean {
  return ['left', 'right'].includes(position);
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
 * TODO: optimize switch
 * Calculates Rect for given popup position config.
 * @param cfg - popup position config
 * */
function calcPopupBasicRect(cfg: PopupPositionConfig): Rect {
  let x = calcPopupPositionByMinorAxis(cfg, cfg.inner.cx, 'width');
  let y = cfg.inner.y - cfg.element.height;
  switch (cfg.position) {
    case 'left':
      x = cfg.inner.x - cfg.element.width;
      y = calcPopupPositionByMinorAxis(cfg, cfg.inner.cy, 'height');
      break;
    case 'right':
      x = cfg.inner.right;
      y = calcPopupPositionByMinorAxis(cfg, cfg.inner.cy, 'height');
      break;
    case 'bottom':
      x = calcPopupPositionByMinorAxis(cfg, cfg.inner.cx, 'width');
      y = cfg.inner.bottom;
      break;
  }

  return new Rect(x, y, cfg.element.width, cfg.element.height);
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
 * TODO: move the actionsToFit definition outside the function and optimize
 * Updates popup and arrow positions to fit on major axis.
 * @param cfg - popup position config
 * @param rect - popup position rect
 * @param arrow - arrow position value
 * */
function fitOnMajorAxis(cfg: PopupPositionConfig, rect: Rect): PositionType {
  if (cfg.behavior !== 'fit' && cfg.behavior !== 'fit-major') return cfg.position;

  let isMirrored = false;
  const actionsToFit: Record<PositionType, () => void> = {
    'bottom': () => {
      if (cfg.intersectionRatio.bottom || cfg.outer.bottom < rect.bottom) {
        rect.y = cfg.inner.y - cfg.element.height;
        isMirrored = true;
      }
    },
    'left': () => {
      if (cfg.intersectionRatio.left || rect.x < cfg.outer.x) {
        rect.x = cfg.inner.right;
        isMirrored = true;
      }
    },
    'right': () => {
      if (cfg.intersectionRatio.right || cfg.outer.right < rect.right) {
        rect.x = cfg.inner.x - cfg.element.width;
        isMirrored = true;
      }
    },
    'top': () => {
      if (cfg.intersectionRatio.top || rect.y < cfg.outer.y) {
        rect.y = cfg.inner.bottom;
        isMirrored = true;
      }
    }
  };
  actionsToFit[cfg.position]();

  return isMirrored ? getOppositePosition(cfg.position) : cfg.position;
}

/**
 * Calculates adjust for popup position to fit container bounds
 * @param elCoord - coordinate of the popup
 * @param outerCoord - coordinate of the outer border element
 * @param arrowCoord - coordinate of the arrow
 * @param arrowLimit - the limit value of the arrow coordinate
 * @param startingSide - is it starting side?
 * @returns adjustment value for the coordinates of the arrow and the popup
 */
function adjustAlignmentBySide(elCoord: number, outerCoord: number, arrowCoord: number, arrowLimit: number, isStartingSide: boolean): number {
  let arrowAdjust = 0;

  if (isStartingSide ? elCoord < outerCoord : elCoord > outerCoord) {
    arrowAdjust = elCoord - outerCoord;
    const newCoord = arrowCoord + arrowAdjust;
    if (isStartingSide ? newCoord < arrowLimit : newCoord > arrowLimit) {
      arrowAdjust = 0;
    }
    /** It was decided that if the relative positions of the trigger and container
     *  do not allow the popup to be displayed correctly together with the arrow,
     *  the popup should be displayed as-is without adjusting the position of the minor axis
     *
     *  The following code adheres to a different strategy - maximum position adaptation,
     *  with the popup having minimal overhang outside the container.
     *  Perhaps in the future, we should allow the user to choose the strategy.
     *
     * const func = isStartingSide ? Math.max : Math.min;
     * arrowAdjust = func(elCoord - outerCoord, arrowLimit - arrowCoord);
     */
  }

  return arrowAdjust;
}

/**
 * Updates popup and arrow positions to fit on minor axis.
 * @param cfg - popup position config
 * @param rect - popup position rect
 * @param arrow - arrow position value
 * */
function fitOnMinorAxis(cfg: PopupPositionConfig, rect: Rect, arrow: Point): void {
  if (cfg.behavior !== 'fit' && cfg.behavior !== 'fit-minor') return;

  const isHorizontal = isMajorAxisHorizontal(cfg.position);
  const start = isHorizontal ? 'y' : 'x';
  const end = isHorizontal ? 'bottom' : 'right';
  const dimension = isHorizontal ? 'height' : 'width';

  if (cfg.outer[dimension] < cfg.element[dimension] ||  // cancel fit mode if the popup size is greater than the outer limiter size
      cfg.trigger[start] < cfg.outer[start] ||          // or the trigger is outside the outer limiting element
      cfg.trigger[end] > cfg.outer[end]
  ) return;

  let coordAdjust = 0;
  // check the starting side of the axis
  let arrowLimit = cfg.marginArrow;
  coordAdjust = adjustAlignmentBySide(rect[start], cfg.outer[start], arrow[start], arrowLimit, true);
  if (coordAdjust) {
    rect[start] -= coordAdjust;
    arrow[start] += coordAdjust;
  }
  // check the final side of the axis
  arrowLimit += calcUsableSizeForArrow(cfg, dimension);
  coordAdjust = adjustAlignmentBySide(rect[end], cfg.outer[end], arrow[start], arrowLimit, false);
  if (coordAdjust) {
    rect[start] -= coordAdjust;
    arrow[start] += coordAdjust;
  }
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
  const popup = calcPopupBasicRect(cfg);
  const arrow = {
    x: calcArrowPosition(cfg, 'width'),
    y: calcArrowPosition(cfg, 'height'),
  };

  const placedAt = fitOnMajorAxis(cfg, popup);
  fitOnMinorAxis(cfg, popup, arrow);

  return {
    popup,
    placedAt,
    arrow
  };
}
