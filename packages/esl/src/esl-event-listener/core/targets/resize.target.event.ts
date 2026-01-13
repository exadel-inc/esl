import {overrideEvent} from '../../../esl-utils/dom/events/misc';

import type {ESLResizeObserverTarget} from './resize.target';

/** Custom event that {@link ESLResizeObserverTarget} produces */
export class ESLElementResizeEvent extends UIEvent implements ResizeObserverEntry {
  public static readonly TYPE = 'resize';

  public override readonly type: typeof ESLElementResizeEvent.TYPE;

  /** A reference to the {@link Element} or SVGElement being observed */
  public override readonly target: Element;
  /** A reference to the {@link ESLResizeObserverTarget} */
  public override readonly currentTarget: ESLResizeObserverTarget;

  /**
   * A DOMRectReadOnly object containing the new size of the observed element.
   * Note that this is better supported than `borderBoxSize` or `contentBoxSize`,
   * but it is left over from an earlier implementation of the Resize Observer API,
   * is still included in the spec for web compat reasons, and may be deprecated in future versions.
   * @see ResizeObserverEntry.prototype.contentRect
   */
  public readonly contentRect: DOMRectReadOnly;
  /**
   * An object containing the new border box size of the observed element
   * @see ResizeObserverEntry.prototype.borderBoxSize
   */
  public readonly borderBoxSize: readonly ResizeObserverSize[];
  /**
   * An object containing the new content box size of the observed element
   * @see ResizeObserverEntry.prototype.contentBoxSize
   */
  public readonly contentBoxSize: readonly ResizeObserverSize[];
  /**
   * An object containing the new content box size in device pixels of the observed element
   * @see ResizeObserverEntry.prototype.devicePixelContentBoxSize
   */
  public readonly devicePixelContentBoxSize: readonly ResizeObserverSize[];

  protected constructor(target: Element) {
    super(ESLElementResizeEvent.TYPE, {bubbles: false, cancelable: false});
    overrideEvent(this, 'target', target);
  }

  /** Creates {@link ESLElementResizeEvent} from {@link ResizeObserverEntry} */
  public static fromEntry(entry: ResizeObserverEntry): ESLElementResizeEvent {
    const event = new ESLElementResizeEvent(entry.target);
    const {
      contentRect, borderBoxSize,
      contentBoxSize, devicePixelContentBoxSize
    } = entry;
    Object.assign(event, {
      contentRect, borderBoxSize,
      contentBoxSize, devicePixelContentBoxSize
    });
    return event;
  }

  // /** Creates {@link ESLElementResizeEvent} from resize {@link Event} */
  // public static fromEvent(event: UIEvent): ESLElementResizeEvent {
  //   // TODO: converter
  // }
}

declare global {
  /** Extended event map with the custom event definition */
  export interface ESLListenerEventMap {
    /** Native resize event or {@link ESLElementResizeEvent} in case {@link ESLResizeObserverTarget} */
    [ESLElementResizeEvent.TYPE]: UIEvent | ESLElementResizeEvent;
  }
}
