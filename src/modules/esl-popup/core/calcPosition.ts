export type PositionType = 'top' | 'bottom' | 'left' | 'right';

export interface ArrowPositionValue {
  left: number;
  top: number;
  position: string;
}

export interface BasicRect {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface PopupPositionValue {
  left: number;
  top: number;
  arrow: ArrowPositionValue;
}

export interface ObjectRect extends BasicRect {
  height: number;
  width: number;
}

export interface ElementRect extends ObjectRect {
  cx: number;
  cy: number;
}

export interface PopupPositionConfig {
  position: PositionType;
  behavior: string;
  element: DOMRect;
  inner: ElementRect;
  outer: ObjectRect;
  trigger: ElementRect;
}

function calcUndirectedRect(sourceX: number, sourceY: number, height: number, width: number): number[] {
  const west = sourceX - width / 2;
  const east = sourceX + width / 2;
  const north = sourceY - height;
  const south = sourceY;

  return [north, south, west, east];
}

function calcPopupBasicRect(cfg: PopupPositionConfig): BasicRect {
  let top;
  let bottom;
  let left;
  let right;
  switch (cfg.position) {
    case 'left':
      [left, right, bottom, top] = calcUndirectedRect(cfg.inner.cy, cfg.inner.left, cfg.element.width, -cfg.element.height);
      break;
    case 'right':
      [right, left, top, bottom] = calcUndirectedRect(cfg.inner.cy, cfg.inner.right, -cfg.element.width, cfg.element.height);
      break;
    case 'bottom':
      [bottom, top, right, left] = calcUndirectedRect(cfg.inner.cx, cfg.inner.bottom, -cfg.element.height, -cfg.element.width);
      break;
    default:
      [top, bottom, left, right] = calcUndirectedRect(cfg.inner.cx, cfg.inner.top, cfg.element.height, cfg.element.width);
      break;
  }
  return {
    top,
    bottom,
    left,
    right
  };
}

function getOppositePosition(position: PositionType): PositionType {
  return ({
    top: 'bottom',
    left: 'right',
    right: 'left',
    bottom: 'top'
  }[position] || position) as PositionType;
}

function oppositeOnMajor(position: PositionType, coord: number, size: number, rect: BasicRect, arrow: ArrowPositionValue) {
  const opposite = getOppositePosition(position);
  rect[position] = coord;
  rect[opposite] = coord + size;
  arrow.position = opposite;
}

function fitByMajorAxis(cfg: PopupPositionConfig, rect: BasicRect, arrow: ArrowPositionValue) {
  if (cfg.behavior !== 'fit') return;

  switch (cfg.position) {
    case 'bottom':
      if (cfg.outer.bottom < rect.bottom) {
        oppositeOnMajor('bottom', cfg.inner.top, -cfg.element.height, rect, arrow);
      }
      break;
    case 'left':
      if (rect.left < cfg.outer.left) {
        oppositeOnMajor('left', cfg.inner.right, cfg.element.width, rect, arrow);
      }
      break;
    case 'right':
      if (cfg.outer.right < rect.right) {
        oppositeOnMajor('right', cfg.inner.left, -cfg.element.width, rect, arrow);
      }
      break;
    default:
      if (rect.top < cfg.outer.top) {
        oppositeOnMajor('top', cfg.inner.bottom, cfg.element.height, rect, arrow);
      }
  }
}

function fitByMinorAxisHorizontal(cfg: PopupPositionConfig, rect: BasicRect, arrow: ArrowPositionValue) {
  if (cfg.trigger.left < cfg.outer.left || cfg.trigger.right > cfg.outer.right) return; // cancel fit mode if the element is out of window offset bounds

  let arrowAdjust = 0;
  if (rect.left < cfg.outer.left) {
    arrowAdjust = rect.left - cfg.outer.left;
    rect.left = cfg.outer.left;
  }
  if (rect.right > cfg.outer.right) {
    arrowAdjust = rect.right - cfg.outer.right;
    rect.left -= arrowAdjust;
  }
  arrow.left += arrowAdjust;
}

function fitByMinorAxisVertical(cfg: PopupPositionConfig, rect: BasicRect, arrow: ArrowPositionValue) {
  if (cfg.trigger.top < cfg.outer.top || cfg.trigger.bottom > cfg.outer.bottom) return; // cancel fit mode if the element is out of window offset bounds

  let arrowAdjust = 0;
  if (rect.top < cfg.outer.top) {
    arrowAdjust = rect.top - cfg.outer.top;
    rect.top = cfg.outer.top;
  }
  if (rect.bottom > cfg.outer.bottom) {
    arrowAdjust = rect.bottom - cfg.outer.bottom;
    rect.top -= arrowAdjust;
  }
  arrow.top += arrowAdjust;
}

function fitByMinorAxis(cfg: PopupPositionConfig, rect: BasicRect, arrow: ArrowPositionValue) {
  if (cfg.behavior !== 'fit') return;

  switch (cfg.position) {
    case 'left':
    case 'right':
      fitByMinorAxisVertical(cfg, rect, arrow);
      break;
    case 'bottom':
    default:
      fitByMinorAxisHorizontal(cfg, rect, arrow);
      break;
  }
}

export function calcPopupPosition(cfg: PopupPositionConfig): PopupPositionValue {
  // popup rect
  const rect = calcPopupBasicRect(cfg);

  // arrow
  const arrow = {
    left: cfg.element.width / 2,
    top: cfg.element.height / 2,
    position: cfg.position
  };

  fitByMajorAxis(cfg, rect, arrow);
  fitByMinorAxis(cfg, rect, arrow);

  return {
    left: rect.left,
    top: rect.top,
    arrow
  };
}

export function resizeRect<T extends ObjectRect | ElementRect>(rect: T, increment: number): T {
  return Object.assign(rect, {
    top: rect.top - increment,
    left: rect.left - increment,
    right: rect.right + increment,
    bottom: rect.bottom + increment,
    height: rect.height + 2 * increment,
    width: rect.width + 2 * increment
  });
}
