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
  public static dispatch(el: HTMLElement, eventName: string, eventInit?: CustomEventInit) {
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

  /** Normalize TouchEvent or PointerEvent */
  public static normalizeTouchPoint(event: TouchEvent | PointerEvent): Point {
    const source = (event instanceof TouchEvent) ? event.changedTouches[0] : event;
    return {
      x: source.pageX,
      y: source.pageY
    };
  }

  /** Normalize MouseEvent */
  public static normalizeCoordinates(event: MouseEvent, elem: HTMLElement): Point {
    const props = elem.getBoundingClientRect();
    const top = props.top + window.pageYOffset;
    const left = props.left + window.pageXOffset;
    return {
      x: event.pageX - left,
      y: event.pageY - top
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
