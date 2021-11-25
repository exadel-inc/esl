import {wrap} from '../../esl-utils/misc/array';
import {bind} from '../../esl-utils/decorators/bind';
import {debounce} from '../../esl-utils/async/debounce';
import {memoize} from '../../esl-utils/decorators/memoize';

// /** ESLAnimate service animation options */
// export interface ESLAnimateConfig {
//   /** Class to mark element animated*/
//   cls: string;
//
//   /** Delay to display element(s) after previous one. If negative or false then play animation immodestly */
//   group: string; //number | false;
//   groupDelay: number;
//
//   /** Do not unsubscribe after animate and repeat animation on each viewport intersection */
//   repeat: 'forward' | boolean;
//
//   /** @private animation requested */
//   _timeout?: number;
//   /** @private marker to unobserve */
//   _unsubscribe?: boolean;
// }

/** ESLAnimate service animation options */
export interface ESLAnimateConfig {
  /** Class to mark element animated*/
  cls: string;

  /** Delay to display element(s) after previous one. If negative or false then play animation immodestly */
  group: number | false;

  /** Do not unsubscribe after animate and repeat animation on each viewport intersection */
  repeat: boolean;

  /** @private animation requested */
  _timeout?: number;
  /** @private marker to unobserve */
  _unsubscribe?: boolean;
}

/** Service to animate elements on viewport intersection */
export class ESLAnimateService {

  protected static readonly DEFAULT_CONFIG: ESLAnimateConfig = {cls: 'in', repeat: false, group: false};
  protected static readonly OPTIONS_OBSERVER: IntersectionObserverInit = {threshold: [0.01, 0.4]};

  /**
   * Subscribe ESlAnimateService on element(s) to animate it on viewport intersection
   * @param target - element(s) or elements to observe and animate
   * @param config - optional animation configuration
   */
  public static observe(target: Element | Element[], config: string | Partial<ESLAnimateConfig> = {}): void {
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

  protected _io = new IntersectionObserver(this.onIntersect, ESLAnimateService.OPTIONS_OBSERVER);
  protected _entries: Element[] = [];
  protected _configMap = new WeakMap<Element, ESLAnimateConfig>();

  protected deferredOnAnimate = debounce(() => this.onAnimate(), 100);

  /**
   * Subscribe ESlAnimateService on element(s) to animate it on viewport intersection
   * @param el - element or elements to observe and animate
   * @param config - optional animation configuration
   */
  public observe(el: Element, config: string | Partial<ESLAnimateConfig> = {}): void {
    if (typeof config === 'string') config = {cls: config};
    const cfg: ESLAnimateConfig = Object.assign({}, ESLAnimateService.DEFAULT_CONFIG, config);
    this._configMap.set(el, cfg);
    el.classList.remove(cfg.cls);
    this._io.observe(el);
  }

  /** Unobserve element or elements */
  public unobserve(el: Element): void {
    this._io.unobserve(el);
    this._configMap.delete(el);
  }

  /** Intersection observable callback */
  @bind
  protected onIntersect(entries: IntersectionObserverEntry[]): void {
    entries.forEach(({target, intersectionRatio, isIntersecting}: IntersectionObserverEntry) => {
      const config = this.getConfigFor(target);
      if (!config) return;

      if (intersectionRatio >= 0.4) {
        this._entries.push(target);
      }

      if (!isIntersecting) {
        this._entries = this._entries.filter(item => item !== target);
      }

      if (intersectionRatio <= 0.1 && config.repeat) {
        target.classList.remove(config.cls);
        config._timeout && clearTimeout(config._timeout);
      }
    });
    this.deferredOnAnimate();
  }

  /** Method to show up HTMLElement */
  protected onAnimate(): void {
    this._entries.sort((a: HTMLElement, b: HTMLElement) => a.offsetTop - b.offsetTop);
    this._entries.reduce((time, target) => {
      const config = this.getConfigFor(target);
      if (!config) return;

      if (typeof config.group === 'number' && config.group >= 0) {
        time += config.group;
        config._timeout = window.setTimeout(() => target.classList.add(config.cls), time);
      } else {
        target.classList.add(config.cls);
      }
      if (!config.repeat) {
        this._io.unobserve(target);
        config._unsubscribe = true;
      }
      config._unsubscribe && this._configMap.delete(target);
      return time;
    }, 0);
    this._entries = [];
  }

  /** Returns config */
  protected getConfigFor(el: Element): ESLAnimateConfig | undefined {
    return this._configMap.get(el);
  }
}
