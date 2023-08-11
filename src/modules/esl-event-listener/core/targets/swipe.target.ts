import {SyntheticEventTarget} from '../../../esl-utils/dom/events/target';
import {ESLMixinElement} from '../../../esl-mixin-element/ui/esl-mixin-element';
import {overrideEvent} from '../../../esl-utils/dom/events/misc';

type SwipeDirection = 'left' | 'right' | 'up' | 'down';
type SwipeEventName = 'swipe' | 'swipe:left' | 'swipe:right' | 'swipe:up' | 'swipe:down';

interface SwipeEvent {
  direction: SwipeDirection;
  distanceX: number;
  distanceY: number;
  touchStartOriginalEvent: PointerEvent;
  touchEndOriginalEvent: PointerEvent;
}

interface SwipeEventTargetConfig {
  threshold: number;
  units: string;
  timeout: number;
}

export class ESLSwipeEventTarget extends SyntheticEventTarget {
  protected xDown: number;
  protected yDown: number;
  protected timeDown: number;
  protected startEl: HTMLElement | null;
  protected startEvent: PointerEvent;
  protected config: SwipeEventTargetConfig;
  protected static unitsAvailable = ['vw', 'vh', 'px'];
  protected static defaultConfig: SwipeEventTargetConfig = {
    threshold: 20,
    units: 'px',
    timeout: 500
  };

  protected constructor(public readonly target: Element, threshold?: string, timeout?: number) {
    super();
    this.config = this.getConfig(threshold, timeout);
  }

  /**
   * Passes threshold into number and units, creates config from passed threshold and distance values or uses default ones.
   * @param threshold - the distance threshold (px, vh, vw supported) that must be traveled before a swipe event is triggered.
   * @param timeout - the time in milliseconds that must elapse between pointerdown and pointerup events before a wipe event is triggered.
   * @returns ESLSwipeEventTarget configuration {@link SwipeEventTargetConfig}.
   */
  protected getConfig(threshold?: string, timeout?: number): SwipeEventTargetConfig {
    const config = ESLSwipeEventTarget.defaultConfig;

    if (threshold) {
      ESLSwipeEventTarget.unitsAvailable.forEach((unit: string) => {
        if (threshold.indexOf(unit) > 0) {
          config.units = unit;
          config.threshold = parseInt(threshold.replace(unit, ''), 10) || ESLSwipeEventTarget.defaultConfig.threshold;
        }
      });
    }

    config.timeout = timeout || config.timeout;

    return config;
  }

  /**
   * @param $el - the element to listen for swipe events on
   * @param threshold - the distance threshold (px, vh, vw supported) that must be traveled before a swipe event is triggered. Optional. Defaults to 20px
   * @param timeout - the time in milliseconds that must elapse between pointerdown and pointerup events before a wipe event is triggered. Optional.
   * Defaults to 500.
   * @returns Returns the instance of ESLSwipeEventTarget {@link ESLSwipeEventTarget}.
   */
  public static for($el: Element | ESLMixinElement, threshold?: string, timeout?: number): ESLSwipeEventTarget {
    if ($el instanceof ESLMixinElement) return ESLSwipeEventTarget.for($el.$host, threshold, timeout);

    return new ESLSwipeEventTarget($el, threshold, timeout);
  }

  /**
   * Subscribes to pointerup and pointerdown event
   */
  public override addEventListener(callback: EventListener): void;
  public override addEventListener(event: SwipeEventName, callback: EventListener): void;
  public override addEventListener(event: any, callback: EventListener = event): void {
    super.addEventListener(event, callback);
    if (this.getEventListeners().length > 1) return;

    this.target.addEventListener('pointerdown', this.handleStart.bind(this), false);
    this.target.addEventListener('pointerup', this.handleEnd.bind(this), false);
  }

  /**
   * Saves swipe start event target, time when swipe started, pointerdown event and coordinates.
   * @param e - pointer event
   */
  protected handleStart(e: PointerEvent): void {
    this.startEl = e.target as HTMLElement;
    this.timeDown = e.timeStamp;
    this.startEvent = e;
    this.xDown = e.clientX;
    this.yDown = e.clientY;
  }

  /**
   * Triggers swipe event {@link SwipeEventName} with details {@link SwipeEvent} when pointerup event occurred and threshold and distance match configuration
   * @param e - pointer event
   */
  protected handleEnd(e: PointerEvent): void {
    // if the user released on a different target, cancel!
    if (this.startEl !== e.target) return;
    const direction = this.resolveDirection(e);

    if (direction) {
      const eventDetail: SwipeEvent = {
        direction,
        distanceX: Math.abs(this.xDown - e.clientX),
        distanceY: Math.abs(this.yDown - e.clientY),
        touchStartOriginalEvent: this.startEvent,
        touchEndOriginalEvent: e
      };

      // fire `swiped` event on the element that started the swipe
      const event = new CustomEvent('swipe', {bubbles: true, cancelable: true, detail: eventDetail});
      this.dispatchEvent(overrideEvent(event, 'target', this.target));

      // fire `swiped:${dir}` event on the element that started the swipe
      const dirEvent = new CustomEvent(`swipe:${direction}`, {bubbles: true, cancelable: true, detail: eventDetail});
      this.dispatchEvent(overrideEvent(dirEvent, 'target', this.target));
    }

    // reset values
    this.startEl = null;
  }

  /**
   * @returns threshold based on number and units
   */
  protected resolveSwipeThreshold(): number {
    let swipeThreshold = this.config.threshold;

    if (this.config.units === 'vh') {
      swipeThreshold = Math.round((swipeThreshold / 100) * document.documentElement.clientHeight); // get percentage of viewport height in pixels
    }
    if (this.config.units === 'vw') {
      swipeThreshold = Math.round((swipeThreshold / 100) * document.documentElement.clientWidth); // get percentage of viewport width in pixels
    }

    return swipeThreshold;
  }

  /**
   * Returns swipe direction based on distance between swipe start and end points
   * @param e - pointer event
   * @returns direction of swipe {@link SwipeDirection}
   */
  protected resolveDirection(e: PointerEvent): SwipeDirection {
    const xDiff = this.xDown - e.clientX;
    const yDiff = this.yDown - e.clientY;
    const swipeThreshold = this.resolveSwipeThreshold();
    const timeDiff = e.timeStamp - this.timeDown;

    if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > swipeThreshold && timeDiff < this.config.timeout) {
      return xDiff > 0 ? 'left' : 'right';
    }
    if (Math.abs(yDiff) > swipeThreshold && timeDiff < this.config.timeout) {
      return yDiff > 0 ? 'up' : 'down';
    }

    // Marker that there was not enough move characteristic to consider pointer move as touch swipe
    return null; 
  }

  /** Unsubscribes from the observed target {@link Element} changes */
  public override removeEventListener(callback: EventListener): void;
  public override removeEventListener(event: SwipeEventName, callback: EventListener): void;
  public override removeEventListener(event: any, callback: EventListener = event): void {
    super.removeEventListener(event, callback);
    if (this.getEventListeners().length > 0) return;

    this.target.removeEventListener('pointerdown', this.handleStart.bind(this), false);
    this.target.removeEventListener('pointerup', this.handleEnd.bind(this), false);
  }
}
