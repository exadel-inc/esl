export interface Point {
  x: number;
  y: number;
}

/**
 * Normalize TouchEvent or PointerEvent
 */
export function normalizeTouchPoint(event: TouchEvent | PointerEvent): Point {
  const source = (event instanceof TouchEvent) ? event.changedTouches[0] : event;
  return {
    x: source.pageX,
    y: source.pageY
  };
}

/**
 * Normalize MouseEvent
 */
export function normalizeCoordinates(event: MouseEvent, elem: HTMLElement): Point {
  const props = elem.getBoundingClientRect();
  const top = props.top + window.pageYOffset;
  const left = props.left + window.pageXOffset;
  return {
    x: event.pageX - left,
    y: event.pageY - top
  };
}
