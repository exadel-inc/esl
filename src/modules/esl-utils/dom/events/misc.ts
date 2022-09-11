/** Checks if the passed event is {@link MouseEvent} */
export const isMouseEvent = (event: Event): event is MouseEvent => window.MouseEvent && event instanceof MouseEvent;

/** Checks if the passed event is {@link TouchEvent} */
export const isTouchEvent = (event: Event): event is TouchEvent => window.TouchEvent && event instanceof TouchEvent;

/** Checks if the passed event is {@link PointerEvent} */
export const isPointerEvent = (event: Event): event is PointerEvent => window.PointerEvent && event instanceof PointerEvent;

const PASSIVE_EVENTS = ['wheel', 'mousewheel', 'touchstart', 'touchmove'];
/**
 * @returns true if the passed event should be passive by default
 * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
 */
export const isPassiveByDefault = (event: string): boolean => PASSIVE_EVENTS.includes(event);

/** Gets the original CustomEvent source in case event bubbles from Shadow DOM */
export const getCompositeTarget = (e: CustomEvent): EventTarget | null => {
  const targets = (e.composedPath && e.composedPath());
  return targets ? targets[0] : e.target;
};

/** Object that describes coordinates */
export interface Point {
  x: number;
  y: number;
}

/** @returns touch point coordinates of {@link TouchEvent} or {@link PointerEvent} */
export const getTouchPoint = (event: TouchEvent | PointerEvent | MouseEvent): Point => {
  const source = isTouchEvent(event) ? event.changedTouches[0] : event;
  return {
    x: source.pageX,
    y: source.pageY
  };
};

/** @returns element offset point coordinates */
export const getOffsetPoint = (el: Element): Point => {
  const props = el.getBoundingClientRect();
  const y = props.top + window.scrollY;
  const x = props.left + window.scrollX;
  return {x, y};
};

/**
 * Splits and deduplicate event string
 * @returns array of unique events presented in events string
 */
export const splitEvents = (events: string): string[] => {
  const terms = (events || '').split(' ').map((term) => term.trim());
  const deduplicate = new Set<string>();
  return terms.filter((term) => {
    if (!term || deduplicate.has(term)) return false;
    deduplicate.add(term);
    return true;
  });
};
