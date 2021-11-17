import {wrap} from '../../esl-utils/misc/array';
import {bind} from '../../esl-utils/decorators/bind';
import {debounce} from '../../esl-utils/async/debounce';
import {memoize} from '../../esl-utils/decorators/memoize';

/** ESLAnimate service animation options */
interface ESLAnimateConfig {
  /** Delay to display element(s) after previous one. If negative or false then play animation immodestly */
  group: number | false;
  /** Do not unsubscribe after animate and repeat animation on each viewport intersection */
  repeat: boolean;

  /** @private marker to unobserve */
  _unsubscribe?: boolean;
}

/** Service to animate elements on viewport intersection */
export class ESLAnimateService {

  protected static readonly DEFAULT_CONFIG: ESLAnimateConfig = {repeat: false, group: false, _unsubscribe: false};
  protected static readonly OPTIONS_OBSERVER: IntersectionObserverInit = {threshold: [0.01, 0.5]};

  /**
   * Subscribe ESlAnimateService on element(s) to animate it on viewport intersection
   * @param target - element(s) or elements to observe and animate
   * @param config - optional animation configuration
   */
  public static observe(target: Element | Element[], config: Partial<ESLAnimateConfig> = {}): void {
    wrap(target).forEach((item: Element) => this.instance.observe(item, config));
  }

  /** Unobserve element or elements */
  public static unobserve(target: Element | Element[]): void {
    wrap(target).forEach((item: Element) => this.instance.unobserve(item));
  }

  /** @returns if service observing target */
  public static isObserved(target: Element): boolean {
    return !!this.instance.getConfigFor(target);
  }

  @memoize()
  private static get instance() {
    return new ESLAnimateService();
  }

  protected _markedElements: Element[] = [];
  protected _io = new IntersectionObserver(this.onIntersect, ESLAnimateService.OPTIONS_OBSERVER);
  protected _configMap = new WeakMap<Element, ESLAnimateConfig>();

  protected deferredOnAnimate = debounce(() => this.onAnimate(), 100);

  /**
   * Subscribe ESlAnimateService on element(s) to animate it on viewport intersection
   * @param el - element or elements to observe and animate
   * @param config - optional animation configuration
   */
  public observe(el: Element, config: Partial<ESLAnimateConfig> = {}): void {
    this.setAnimationState(el, false);
    this._configMap.set(el, Object.assign({}, ESLAnimateService.DEFAULT_CONFIG, config));
    this._io.observe(el);
  }

  /** Unobserve element or elements */
  public unobserve(el: Element): void {
    this._io.unobserve(el);
    this._configMap.delete(el);
  }

  /** Intersection observable callback */
  @bind
  protected onIntersect(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void {
    entries.forEach(({target, intersectionRatio}: IntersectionObserverEntry) => {
      const config = this.getConfigFor(target);
      if (!config) return;
      if (intersectionRatio >= 0.5) {
        this._markedElements.push(target);
        this.deferredOnAnimate();
        if (!config.repeat) {
          observer.unobserve(target);
          config._unsubscribe = true;
        }
      }
      if (intersectionRatio <= 0.1 && config.repeat) {
        this.setAnimationState(target, false);
      }
    });
  }

  /** Method to show up HTMLElement */
  protected onAnimate(): void {
    let counter = 0;
    this._markedElements.forEach((el) => {
      const config = this.getConfigFor(el);
      if (!config) return;
      if (typeof config.group === 'number' && config.group >= 0) {
        counter += config.group;
        setTimeout(() => this.setAnimationState(el, true), counter);
      } else {
        this.setAnimationState(el, true);
      }
      config._unsubscribe && this._configMap.delete(el);
    });
    this._markedElements = [];
  }

  protected setAnimationState(el: Element, value: boolean): void {
    el.setAttribute('esl-animate', value ? 'done' : '');
  }

  /** Returns config */
  protected getConfigFor(el: Element): ESLAnimateConfig | undefined {
    return this._configMap.get(el);
  }
}
