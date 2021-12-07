import {Rect} from '../../esl-utils/dom/rect';

export type PositionType = 'top' | 'bottom' | 'left' | 'right';

export interface Point {
  x: number;
  y: number;
}

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
  arrow: DOMRect | Rect;
  element: DOMRect;
  inner: Rect;
  outer: Rect;
  trigger: Rect;
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
 * Calculate Rect for given popup position config.
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
 * Get opposite position.
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
 * Update popup and arrow positions to fit on major axis.
 * @param cfg - popup position config
 * @param rect - popup position rect
 * @param arrow - arrow position value
 * */
function fitOnMajorAxis(cfg: PopupPositionConfig, rect: Rect, arrow: Point): PositionType {
  if (cfg.behavior !== 'fit' && cfg.behavior !== 'fit-on-major') return cfg.position;

  let isMirrored = false;
  switch (cfg.position) {
    case 'bottom':
      if (cfg.intersectionRatio.bottom || cfg.outer.bottom < rect.bottom) {
        rect.y = cfg.inner.top - cfg.element.height;
        isMirrored = true;
      }
      break;
    case 'left':
      if (cfg.intersectionRatio.left || rect.x < cfg.outer.x) {
        rect.x = cfg.inner.right;
        isMirrored = true;
      }
      break;
    case 'right':
      if (cfg.intersectionRatio.right || cfg.outer.right < rect.right) {
        rect.x = cfg.inner.x - cfg.element.width;
        isMirrored = true;
      }
      break;
    default:
      if (cfg.intersectionRatio.top || rect.y < cfg.outer.y) {
        rect.y = cfg.inner.bottom;
        isMirrored = true;
      }
      break;
  }

  return isMirrored ? getOppositePosition(cfg.position) : cfg.position;
}

/**
 * Update popup and arrow positions to fit on minor horizontal axis.
 * @param cfg - popup position config
 * @param rect - popup position rect
 * @param arrow - arrow position value
 * */
function fitOnMinorAxisHorizontal(cfg: PopupPositionConfig, rect: Rect, arrow: Point): void {
  if (cfg.trigger.x < cfg.outer.x || cfg.trigger.right > cfg.outer.right) return; // cancel fit mode if the element is out of window offset bounds

  let arrowAdjust = 0;
  if (rect.x < cfg.outer.x) {
    arrowAdjust = rect.x - cfg.outer.x;
    rect.x = cfg.outer.x;
  }
  if (rect.right > cfg.outer.right) {
    arrowAdjust = rect.right - cfg.outer.right;
    rect.x -= arrowAdjust;
  }
  arrow.x += arrowAdjust;
}

/**
 * TODO: see Idea warning regarding duplication
 * Update popup and arrow positions to fit by minor vertical axis.
 * @param cfg - popup position config
 * @param rect - popup position rect
 * @param arrow - arrow position value
 * */
function fitOnMinorAxisVertical(cfg: PopupPositionConfig, rect: Rect, arrow: Point): void {
  if (cfg.trigger.y < cfg.outer.y || cfg.trigger.bottom > cfg.outer.bottom) return; // cancel fit mode if the element is out of window offset bounds

  let arrowAdjust = 0;
  if (rect.y < cfg.outer.y) {
    arrowAdjust = rect.y - cfg.outer.y;
    rect.y = cfg.outer.y;
  }
  if (rect.bottom > cfg.outer.bottom) {
    arrowAdjust = rect.bottom - cfg.outer.bottom;
    rect.y -= arrowAdjust;
  }
  arrow.y += arrowAdjust;
}

/**
 * Update popup and arrow positions to fit on minor axis.
 * @param cfg - popup position config
 * @param rect - popup position rect
 * @param arrow - arrow position value
 * */
function fitOnMinorAxis(cfg: PopupPositionConfig, rect: Rect, arrow: Point): void {
  if (cfg.behavior !== 'fit' && cfg.behavior !== 'fit-on-minor') return;

  if (['left', 'right'].includes(cfg.position)) {
    fitOnMinorAxisVertical(cfg, rect, arrow);
  } else {
    fitOnMinorAxisHorizontal(cfg, rect, arrow);
  }
}

/**
 * Calculate the usable size available for the arrow
 * @param cfg - popup position config
 * @param dimensionName - the name of dimension (height or width)
 */
function calcUsableSizeForArrow(cfg: PopupPositionConfig, dimensionName: 'height' | 'width'): number {
  return cfg.element[dimensionName] - cfg.arrow[dimensionName] - 2 * cfg.marginArrow;
}

/**
 * Calculate popup and arrow popup positions.
 * @param cfg - popup position config
 * */
export function calcPopupPosition(cfg: PopupPositionConfig): PopupPositionValue {
  const popup = calcPopupBasicRect(cfg);
  const arrow = {
    x: cfg.marginArrow + calcUsableSizeForArrow(cfg, 'width') * cfg.offsetArrowRatio,
    y: cfg.marginArrow + calcUsableSizeForArrow(cfg, 'height') * cfg.offsetArrowRatio,
    position: cfg.position
  };

  const placedAt = fitOnMajorAxis(cfg, popup, arrow);
  fitOnMinorAxis(cfg, popup, arrow);

  return {
    popup,
    placedAt,
    arrow
  };
}
