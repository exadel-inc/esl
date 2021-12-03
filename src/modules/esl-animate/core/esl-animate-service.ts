import {wrap} from '../../esl-utils/misc/array';
import {bind} from '../../esl-utils/decorators/bind';
import {debounce} from '../../esl-utils/async/debounce';
import {memoize} from '../../esl-utils/decorators/memoize';
import {CSSClassUtils} from '../../esl-utils/dom/class';

/** ESLAnimateService animation options */
export interface ESLAnimateConfig {
  /** Class to mark element animated */
  cls: string;

  /** Animate if class already presented */
  force?: boolean;

  /** Animate items in group one by one, using groupDelay */
  group?: boolean;

  /** Delay to display element(s) after previous one. Used when group animation is enabled. Default: 100ms */
  groupDelay: number;

  // 'forward' | boolean;
  /** Do not unsubscribe after animate and repeat animation on each viewport intersection */
  repeat?: boolean;
}

/** ESLAnimateService animation inner options. Contains system animation properties */
interface ESLAnimateConfigInner extends ESLAnimateConfig {
  /** @private animation requested */
  _timeout?: number;
  /** @private marker to unobserve */
  _unsubscribe?: boolean;
}

/** Service to animate elements on viewport intersection */
export class ESLAnimateService {

  /** ESLAnimateService default animation configuration */
  protected static DEFAULT_CONFIG: ESLAnimateConfig = {cls: 'in', groupDelay: 100};
  /** ESLAnimationService IntersectionObserver properties */
  protected static OPTIONS_OBSERVER: IntersectionObserverInit = {threshold: [0.001, 0.2, 0.4, 0.6]};

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
  protected _configMap = new WeakMap<Element, ESLAnimateConfigInner>();

  protected deferredOnAnimate = debounce(() => this.onAnimate(), 50);

  /**
   * Subscribe ESlAnimateService on element(s) to animate it on viewport intersection
   * @param el - element or elements to observe and animate
   * @param config - optional animation configuration
   */
  public observe(el: Element, config: string | Partial<ESLAnimateConfig> = {}): void {
    const cfg = this.setConfigFor(el, config);
    cfg.force && CSSClassUtils.remove(el, cfg.cls);
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
        CSSClassUtils.remove(target, config.cls);
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

      if (config.group) {
        time += config.groupDelay;
        config._timeout = window.setTimeout(() => CSSClassUtils.add(target, config.cls), time);
      } else {
        CSSClassUtils.add(target, config.cls);
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
  protected getConfigFor(el: Element): ESLAnimateConfigInner | undefined {
    return this._configMap.get(el);
  }
  /** Returns config */
  protected setConfigFor(el: Element, config: string | Partial<ESLAnimateConfig>): ESLAnimateConfigInner {
    if (typeof config === 'string') config = {cls: config};
    const cfg: ESLAnimateConfig = Object.assign({}, ESLAnimateService.DEFAULT_CONFIG, config);
    this._configMap.set(el, cfg);
    return cfg;
  }
}
