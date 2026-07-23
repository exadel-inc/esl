import {ESLEventUtils} from '../../esl-event-listener/core/api';
import {ESLResizeObserverTarget} from '../../esl-event-listener/core/targets/resize.target';

const STORE = Symbol.for('ESLVSizeCSSProxy');

/**
 * Small utility that maintains normalized viewport CSS variables.
 *
 * It can be used both as a fallback for browsers without reliable dynamic viewport units
 * and as a source of viewport values with semantics different from native CSS units.
 *
 * In particular, `--100vw` is based on `document.documentElement.clientWidth`, so it is
 * aware of rendered vertical scrollbar width and may intentionally differ from `100vw`/`100dvw`.
 * `--100vh` reflects the current visual viewport height and also works as a legacy iOS `100vh` fix.
 *
 * - `vwProp` (default: `--100vw`) - viewport width without rendered vertical scrollbar width
 * - `vhProp` (default: `--100vh`) - current visual viewport height (`100vh` iOS fix)
 */
export class ESLVSizeCSSProxy {
  public static vwProp = '--100vw';
  public static vhProp = '--100vh';

  private _width = -1;
  private _height = -1;
  private _requestId = 0;

  /** Starts CSS variable sync for the singleton proxy instance. */
  public static init(): void {
    new ESLVSizeCSSProxy().observe();
  }

  /** Stops viewport observation for the singleton proxy instance, removes CSS vars and cancels a pending frame. */
  public static destroy(): void {
    new ESLVSizeCSSProxy().unobserve();
  }

  /**
   * Requests CSS variables refresh for the singleton proxy instance.
   *
   * By default, the refresh is scheduled for the next animation frame and repeated calls for
   * the same viewport size are coalesced. Pass `true` to update CSS variables immediately.
   *
   * This method does not depend on active observation and can be used for manual resync when
   * the built-in resize flow does not produce the needed update.
   */
  public static update(immediate: boolean = false): void {
    const proxy = new ESLVSizeCSSProxy();
    immediate ? proxy.update() : proxy.requestUpdate();
  }

  /** @deprecated Backward-compatible alias for {@link ESLVSizeCSSProxy.init}. */
  public static readonly observe = ESLVSizeCSSProxy.init;
  /** @deprecated Backward-compatible alias for {@link ESLVSizeCSSProxy.destroy}. */
  public static readonly unobserve = ESLVSizeCSSProxy.destroy;

  protected constructor() {
    if (window[STORE]) return window[STORE];
    Object.defineProperty(window, STORE, {value: this});
  }

  /** Starts CSS variable sync and subscribes to viewport resize sources. Safe to call multiple times. */
  public observe(): void {
    this._width = -1;
    this._height = -1;
    this.requestUpdate();
    ESLEventUtils.subscribe(this, {event: 'resize', target: window}, this.requestUpdate);
    ESLEventUtils.subscribe(this, {event: 'resize', target: ESLResizeObserverTarget.for(document.documentElement)}, this.requestUpdate);
  }

  /** Stops viewport observation, removes CSS vars and cancels a pending animation frame update. */
  public unobserve(): void {
    document.documentElement.style.removeProperty(ESLVSizeCSSProxy.vwProp);
    document.documentElement.style.removeProperty(ESLVSizeCSSProxy.vhProp);
    if (this._requestId) cancelAnimationFrame(this._requestId);
    this._requestId = 0;
    ESLEventUtils.unsubscribe(this);
  }

  /** Updates custom CSS variables with actual viewport sizes immediately. */
  public update(): void {
    const $html = document.documentElement;
    $html.style.setProperty(ESLVSizeCSSProxy.vwProp, `${ESLVSizeCSSProxy.viewportWidth}px`);
    $html.style.setProperty(ESLVSizeCSSProxy.vhProp, `${ESLVSizeCSSProxy.viewportHeight}px`);
  }

  /** Schedules CSS variables refresh on the next animation frame if viewport size changed. */
  public requestUpdate(): void {
    const width = ESLVSizeCSSProxy.viewportWidth;
    const height = ESLVSizeCSSProxy.viewportHeight;

    if (this._width === width && this._height === height) return;

    this._width = width;
    this._height = height;
    if (this._requestId) cancelAnimationFrame(this._requestId);

    this._requestId = requestAnimationFrame(() => {
      this._requestId = 0;
      this.update();
    });
  }

  /** @returns current viewport width */
  public static get viewportWidth(): number {
    return document.documentElement.clientWidth;
  }
  /** @returns current viewport height */
  public static get viewportHeight(): number {
    return window.innerHeight;
  }
}

declare global {
  export interface Window {
    [STORE]: ESLVSizeCSSProxy;
  }
}
