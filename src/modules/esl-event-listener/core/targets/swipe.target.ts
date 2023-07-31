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

export class SwipeEventTarget extends SyntheticEventTarget {
  protected xDown: number | null;
  protected yDown: number | null;
  protected timeDown: number | null;
  protected startEl: HTMLElement | null;
  protected startEvent: PointerEvent;
  protected config: SwipeEventTargetConfig;
  protected static unitsAvailable = ['vw', 'vh', 'px'];
  protected static defaultConfig: SwipeEventTargetConfig = {
    threshold: 20,
    units: 'px',
    timeout: 500
  };

  protected constructor(public readonly target: HTMLElement, threshold?: string, timeout?: number) {
    super();
    this.config = this.getConfig(threshold, timeout);
  }

  protected getConfig(threshold?: string, timeout?: number): SwipeEventTargetConfig {
    const config = SwipeEventTarget.defaultConfig;

    if (threshold) {
      SwipeEventTarget.unitsAvailable.forEach((unit: string) => {
        if (threshold.indexOf(unit) > 0) {
          config.units = unit;
          config.threshold = parseInt(threshold.replace(unit, ''), 10) || SwipeEventTarget.defaultConfig.threshold;
        }
      });
    }

    config.timeout = timeout || config.timeout;

    return config;
  }

  public static for($el: HTMLElement | ESLMixinElement, threshold?: string, timeout?: number): SwipeEventTarget {
    if ($el instanceof ESLMixinElement) return SwipeEventTarget.for($el.$host, threshold, timeout);

    return new SwipeEventTarget($el, threshold, timeout);
  }

  public override addEventListener(callback: EventListener): void;
  public override addEventListener(event: SwipeEventName, callback: EventListener): void;
  public override addEventListener(event: any, callback: EventListener = event): void {
    super.addEventListener(event, callback);
    if (this.getEventListeners().length > 1) return;

    this.target.addEventListener('pointerdown', this.handleStart.bind(this), false);
    this.target.addEventListener('pointerup', this.handleEnd.bind(this), false);
  }

  protected handleStart(e: PointerEvent): void {
    this.startEl = e.target as HTMLElement;
    this.timeDown = e.timeStamp;
    this.startEvent = e;
    this.xDown = e.clientX;
    this.yDown = e.clientY;
  }

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
    this.xDown = null;
    this.yDown = null;
    this.timeDown = null;
    this.startEl = null;
  }

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
