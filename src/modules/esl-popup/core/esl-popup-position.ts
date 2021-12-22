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
 * TODO: move the actionsToFit definition outside the function and optimize
 * Update popup and arrow positions to fit on major axis.
 * @param cfg - popup position config
 * @param rect - popup position rect
 * @param arrow - arrow position value
 * */
function fitOnMajorAxis(cfg: PopupPositionConfig, rect: Rect, arrow: Point): PositionType {
  if (cfg.behavior !== 'fit' && cfg.behavior !== 'fit-on-major') return cfg.position;

  let isMirrored = false;
  const actionsToFit: Record<PositionType, () => void> = {
    'bottom': () => {
      if (cfg.intersectionRatio.bottom || cfg.outer.bottom < rect.bottom) {
        rect.y = cfg.inner.top - cfg.element.height;
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
 * TODO: rethink fitOnMinorAxisHorizontal and fitOnMinorAxisVertical to simplify code
 * Update popup and arrow positions to fit on minor horizontal axis.
 * @param cfg - popup position config
 * @param rect - popup position rect
 * @param arrow - arrow position value
 * */
function fitOnMinorAxisHorizontal(cfg: PopupPositionConfig, rect: Rect, arrow: Point): void {
  if (cfg.outer.width < cfg.element.width ||  // cancel fit mode if the popup width is greater than the outer limiter width
      cfg.trigger.x < cfg.outer.x ||          // or the trigger is outside the outer limiting element
      cfg.trigger.right > cfg.outer.right
  ) return;

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
  if (cfg.outer.height < cfg.element.height ||  // cancel fit mode if the popup height is greater than the outer limiter height
      cfg.trigger.y < cfg.outer.y ||            // or the trigger is outside the outer limiting element
      cfg.trigger.bottom > cfg.outer.bottom
  ) return;

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

  if (isMajorAxisHorizontal(cfg.position)) {
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
 * Calculates the position of the arrow on the minor axis
 * @param cfg - popup position config
 * @param dimensionName - the name of dimension (height or width)
 */
function calcArrowPosition(cfg: PopupPositionConfig, dimensionName: 'height' | 'width'): number {
  return cfg.marginArrow + calcUsableSizeForArrow(cfg, dimensionName) * cfg.offsetArrowRatio;
}

/**
 * Calculate popup and arrow popup positions.
 * @param cfg - popup position config
 * */
export function calcPopupPosition(cfg: PopupPositionConfig): PopupPositionValue {
  const popup = calcPopupBasicRect(cfg);
  const arrow = {
    x: calcArrowPosition(cfg, 'width'),
    y: calcArrowPosition(cfg, 'height'),
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
