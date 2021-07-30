import {Rect} from '../../esl-utils/dom/rect';

export type PositionType = 'top' | 'bottom' | 'left' | 'right';

export interface ArrowPositionValue {
  x: number;
  y: number;
  position: string;
}

export interface PopupPositionValue {
  x: number;
  y: number;
  arrow: ArrowPositionValue;
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
  intersectionRatio: IntersectionRatioRect,
  element: DOMRect;
  inner: Rect;
  outer: Rect;
  trigger: Rect;
}

/**
 * Calculate Rect for given popup position config.
 * @param cfg - popup position config
 * */
function calcPopupBasicRect(cfg: PopupPositionConfig): Rect {
  let x = cfg.inner.cx - cfg.element.width / 2;
  let y = cfg.inner.y - cfg.element.height;
  switch (cfg.position) {
    case 'left':
      x = cfg.inner.x - cfg.element.width;
      y = cfg.inner.cy - cfg.element.height / 2;
      break;
    case 'right':
      x = cfg.inner.right;
      y = cfg.inner.cy - cfg.element.height / 2;
      break;
    case 'bottom':
      x = cfg.inner.cx - cfg.element.width / 2;
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
 * Update popup and arrow positions to fit by major axis.
 * @param cfg - popup position config
 * @param rect - popup position rect
 * @param arrow - arrow position value
 * */
function fitByMajorAxis(cfg: PopupPositionConfig, rect: Rect, arrow: ArrowPositionValue) {
  if (cfg.behavior !== 'fit') return;

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
  if (isMirrored) {
    arrow.position = getOppositePosition(cfg.position);
  }
}

/**
 * Update popup and arrow positions to fit by minor horizontal axis.
 * @param cfg - popup position config
 * @param rect - popup position rect
 * @param arrow - arrow position value
 * */
function fitByMinorAxisHorizontal(cfg: PopupPositionConfig, rect: Rect, arrow: ArrowPositionValue) {
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
 * Update popup and arrow positions to fit by minor vertical axis.
 * @param cfg - popup position config
 * @param rect - popup position rect
 * @param arrow - arrow position value
 * */
function fitByMinorAxisVertical(cfg: PopupPositionConfig, rect: Rect, arrow: ArrowPositionValue) {
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
 * Update popup and arrow positions to fit by minor axis.
 * @param cfg - popup position config
 * @param rect - popup position rect
 * @param arrow - arrow position value
 * */
function fitByMinorAxis(cfg: PopupPositionConfig, rect: Rect, arrow: ArrowPositionValue) {
  if (cfg.behavior !== 'fit') return;

  if (['left', 'right'].includes(cfg.position)) {
    fitByMinorAxisVertical(cfg, rect, arrow);
  } else {
    fitByMinorAxisHorizontal(cfg, rect, arrow);
  }
}

/**
 * Calculate popup and arrow popup positions.
 * @param cfg - popup position config
 * */
export function calcPopupPosition(cfg: PopupPositionConfig): PopupPositionValue {
  const rect = calcPopupBasicRect(cfg);
  const arrow = {
    x: cfg.element.width / 2,
    y: cfg.element.height / 2,
    position: cfg.position
  };

  fitByMajorAxis(cfg, rect, arrow);
  fitByMinorAxis(cfg, rect, arrow);

  return {
    x: rect.x,
    y: rect.y,
    arrow
  };
}
