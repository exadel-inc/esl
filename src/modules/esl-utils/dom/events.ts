export interface Point {
  x: number;
  y: number;
}

export abstract class EventUtils {
  /**
   * Dispatch custom event.
   * Event bubbles and is cancelable by default, use `eventInit` to override that.
   * @param el - element target
   * @param eventName - event name
   * @param eventInit - custom event init. See {@link CustomEventInit}
   */
  public static dispatch(el: EventTarget, eventName: string, eventInit?: CustomEventInit) {
    const init = Object.assign({
      bubbles: true,
      composed: true,
      cancelable: true
    }, eventInit || {});
    return el.dispatchEvent(new CustomEvent(eventName, init));
  }

  /** Get original CustomEvent source */
  public static source(e: CustomEvent) {
    const targets = (e.composedPath && e.composedPath());
    return targets ? targets[0] : e.target;
  }

  /** Check if the passed event is {@link MouseEvent} */
  public static isMouseEvent(event: Event): event is MouseEvent {
    return window.MouseEvent && event instanceof MouseEvent;
  }

  /** Check if the passed event is {@link TouchEvent} */
  public static isTouchEvent(event: Event): event is TouchEvent {
    return window.TouchEvent && event instanceof TouchEvent;
  }

  /** Normalize TouchEvent or PointerEvent */
  public static normalizeTouchPoint(event: TouchEvent | PointerEvent | MouseEvent): Point {
    const source = EventUtils.isTouchEvent(event) ? event.changedTouches[0] : event;
    return {
      x: source.pageX,
      y: source.pageY
    };
  }

  /** Normalize MouseEvent */
  public static normalizeCoordinates(event: TouchEvent | PointerEvent | MouseEvent, elem: HTMLElement): Point {
    const source = EventUtils.isTouchEvent(event) ? event.changedTouches[0] : event;
    const props = elem.getBoundingClientRect();
    const top = props.top + window.scrollY;
    const left = props.left + window.scrollX;
    return {
      x: source.pageX - left,
      y: source.pageY - top
    };
  }

  /** Stub method to prevent event from bubbling out of target */
  public static stopPropagation(e?: Event) {
    e?.stopPropagation();
  }

  /** Stub method to prevent default event behaviour */
  public static preventDefault(e?: Event) {
    e?.preventDefault();
  }
}
