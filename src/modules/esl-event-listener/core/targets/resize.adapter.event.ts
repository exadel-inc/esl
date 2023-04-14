
import {overrideEvent} from '../../../esl-utils/dom/events/misc';
import {getWindowRect} from '../../../esl-utils/dom/window';

import type {ESLResizeObserverTarget} from './resize.adapter';

/** Custom event that {@link ESLResizeObserverTarget} produces */
export class ESLElementResizeEvent extends UIEvent implements ResizeObserverEntry {
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

  protected constructor(target: EventTarget) {
    super('resize', {bubbles: false, cancelable: false});
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

  /** Creates {@link ESLElementResizeEvent} from resize {@link Event} */
  public static fromEvent(e: UIEvent): ESLElementResizeEvent | never {
    const {target} = e;
    if (!target) throw new Error('Event must be at object with a `target` property');
    let borderBoxSize: ResizeObserverSize[];
    let contentBoxSize: ResizeObserverSize[];

    if (target instanceof Element) {
      const rect = target.getBoundingClientRect();
      contentBoxSize = [{inlineSize: target.clientWidth, blockSize: target.clientHeight}];
      borderBoxSize = [{inlineSize: rect.width, blockSize: rect.height}];
    } else if (target instanceof Window) {
      const wndRect = getWindowRect();
      contentBoxSize = [{inlineSize: wndRect.width, blockSize: wndRect.height}];
      borderBoxSize = contentBoxSize;
    } else throw new Error('Event target must be an element or window object');

    const contentRect = new DOMRectReadOnly(0, 0, contentBoxSize[0].inlineSize, contentBoxSize[0].blockSize);
    const devicePixelContentBoxSize = [{
      inlineSize: contentBoxSize[0].inlineSize * window.devicePixelRatio,
      blockSize: contentBoxSize[0].blockSize * window.devicePixelRatio
    }];

    const event = new ESLElementResizeEvent(target);
    Object.assign(event, {contentRect, borderBoxSize, contentBoxSize, devicePixelContentBoxSize});
    return event;
  }
}

declare global {
  /** Extended event map with the custom event definition */
  export interface ESLListenerEventMap {
    /** Native resize event or {@link ESLElementResizeEvent} in case {@link ESLResizeObserverTarget} */
    'resize': UIEvent | ESLElementResizeEvent;
  }
}
