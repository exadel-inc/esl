import type {Point} from '../point';

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
 * Dispatches custom event.
 * Event bubbles and is cancelable by default, use `eventInit` to override that.
 * @param el - EventTarget to dispatch event
 * @param eventName - name of the event to dispatch
 * @param eventInit - object that specifies characteristics of the event. See {@link CustomEventInit}
 */
export const dispatchCustomEvent = (el: EventTarget, eventName: string, eventInit?: CustomEventInit): boolean => {
  const init = Object.assign({
    bubbles: true,
    composed: true,
    cancelable: true
  }, eventInit || {});
  return el.dispatchEvent(new CustomEvent(eventName, init));
};

/**
 * Overrides {@link Event} `target` property
 * @param event - {@link Event} to override
 * @param key - {@link Event} property
 * @param target - {@link EventTarget} to setup
 * @returns original event
 */
export const overrideEvent = (
  event: Event,
  key: keyof Event,
  target: null | EventTarget | (() => null | EventTarget)
): Event => {
  const provider = typeof target === 'function' ? target : ((): null | EventTarget => target);
  Object.defineProperty(event, key, {
    get: provider,
    enumerable: true,
    configurable: true
  });
  return event;
};
