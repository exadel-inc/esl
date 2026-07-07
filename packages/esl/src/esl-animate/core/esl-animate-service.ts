import {wrap} from '../../esl-utils/misc/array';
import {debounce} from '../../esl-utils/async/debounce';
import {memoize, bind} from '../../esl-utils/decorators';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {ESLMediaQuery} from '../../esl-media-query/core';
import {ESLEventUtils} from '../../esl-event-listener/core';

/** ESLAnimateService animation options */
export interface ESLAnimateConfig {
  /** Class(es) to mark element animated */
  cls?: string;

  /** Animate if class already presented */
  force?: boolean;

  /** Animate items in group one by one, using groupDelay */
  group?: boolean;

  /** Delay to display element(s) after previous one. Used when group animation is enabled. Default: 100ms */
  groupDelay?: number;

  /** Do not unsubscribe after animate and repeat animation on each viewport intersection */
  repeat?: boolean;

  /**
   * Intersection ratio to consider element as visible.
   * Only 0.2 (20%), 0.4 (40%), 0.6 (60%), 0.8 (80%) values are allowed due to share of IntersectionObserver instance
   * with a fixed set of thresholds defined.
   * Default: 0.4 (40%)
   */
  ratio?: number;

  /**
   * Condition {@link ESLMediaQuery} to disable animation
   * Default: `not all`
   */
  disableOn?: string;

  /**
   * Disabled animation class marker
   * Default: `esl-animate-inactive`
   * */
  disableCls?: string;
}

/** ESLAnimateService animation inner options. Contains system animation properties */
interface ESLAnimateConfigInner extends ESLAnimateConfig {
  // Required parts
  cls: string;
  ratio: number;
  groupDelay: number;
  disableOn: string;
  disableCls: string;

  /** (private) animation target observed by service */
  _isObserved?: boolean;
  /** (private) animation requested */
  _timeout?: number;
  /** (private) marker to unobserve */
  _unsubscribe?: boolean;
}

/** Service to animate elements on viewport intersection */
@ExportNs('AnimateService')
export class ESLAnimateService {

  /** ESLAnimateService default animation configuration */
  protected static DEFAULT_CONFIG: ESLAnimateConfigInner = {
    cls: 'in',
    groupDelay: 100,
    ratio: 0.4,
    disableOn: `${ESLMediaQuery.NOT_ALL}`,
    disableCls: 'esl-animate-inactive'
  };
  /** ESLAnimationService IntersectionObserver properties */
  protected static OPTIONS_OBSERVER: IntersectionObserverInit = {threshold: [0.001, 0.2, 0.4, 0.6, 0.8, 1]};

  /**
   * Subscribe ESlAnimateService on element(s) to animate it on viewport intersection
   * @param target - element(s) or elements to observe and animate
   * @param config - optional animation configuration
   */
  public static observe(target: Element | Element[], config: ESLAnimateConfig = {}): void {
    wrap(target).forEach((item: Element) => this.instance.observe(item, config));
  }

  /** Unobserve element or elements */
  public static unobserve(target: Element | Element[]): void {
    wrap(target).forEach((item: Element) => this.instance.unobserve(item));
  }

  /** @returns if service observing target */
  public static isObserved(target: Element): boolean {
    return this.instance.isObserved(target);
  }

  @memoize()
  private static get instance(): ESLAnimateService {
    return new ESLAnimateService();
  }

  protected _io = new IntersectionObserver(this.onIntersect, ESLAnimateService.OPTIONS_OBSERVER);
  protected _entries: Set<Element> = new Set();
  protected _configMap = new WeakMap<Element, ESLAnimateConfigInner>();

  protected deferredOnAnimate = debounce(() => this.onAnimate(), 100);

  /** @returns if service observing target */
  public isObserved(target: Element): boolean {
    return !!this._configMap.get(target)?._isObserved;
  }

  /**
   * Registers animation settings for the target element and starts observation.
   * @param item - target element to configure
   * @param config - animation options for the target
   */
  public observe(item: Element, config: ESLAnimateConfig = {}): void {
    this.unobserve(item);

    const cfg = Object.assign({}, ESLAnimateService.DEFAULT_CONFIG, config);
    const mediaQuery = ESLMediaQuery.for(cfg.disableOn);
    cfg._isObserved = !mediaQuery.matches;
    this._configMap.set(item, cfg);

    this.onDisableConditionChanged(item);
    ESLEventUtils.subscribe(cfg, {event: 'change', target: mediaQuery}, () => this.onDisableConditionChanged(item));
  }

  /**
   * Removes the target from service tracking and unsubscribes related listeners.
   * @param item - target element to stop tracking
   */
  public unobserve(item: Element): void {
    const config = this._configMap.get(item);
    if (!config) return;
    ESLEventUtils.unsubscribe(config);
    this._unobserve(item);
    this._configMap.delete(item);
  }

  /**
   * Updates target classes and observation state when the disable condition changes.
   * @param target - target element affected by media-query changes
   */
  protected onDisableConditionChanged(target: Element): void {
    const config = this._configMap.get(target);
    if (!config) return;
    const isDisabled = ESLMediaQuery.for(config.disableOn).matches;
    CSSClassUtils.toggle(target, config.disableCls, isDisabled);
    if (isDisabled) {
      CSSClassUtils.add(target, config.cls);
    } else if (config.force) {
      CSSClassUtils.remove(target, config.cls);
    }
    isDisabled ? this._unobserve(target) : this._observe(target);
  }

  /**
   * Internal subscription to animate the element it on viewport intersection
   */
  protected _observe(el: Element): void {
    const config = this._configMap.get(el);
    if (!config) return;
    config._isObserved = true;
    this._io.observe(el);
  }

  /** Internal processing to unobserve the element */
  protected _unobserve(el: Element): void {
    const config = this._configMap.get(el);
    if (!config) return;
    config._isObserved = false;
    config._timeout && window.clearTimeout(config._timeout);
    config._timeout = undefined;
    this._io.unobserve(el);
    this._entries.delete(el);
  }

  /** Intersection observable callback */
  @bind
  protected onIntersect(entries: IntersectionObserverEntry[]): void {
    entries.forEach(({target, intersectionRatio, isIntersecting}: IntersectionObserverEntry) => {
      const config = this._configMap.get(target);
      if (!config) return;

      // Item will be marked as visible in case it intersecting to the viewport with a ratio grater then passed visibleRatio
      if (isIntersecting && intersectionRatio >= config.ratio) {
        this._entries.add(target);
      }

      // Item considered as invisible in case it is going to be intersected less then 1% of it's area
      if (!isIntersecting && intersectionRatio <= 0.01) {
        this._entries.delete(target);

        if (config.repeat) {
          CSSClassUtils.remove(target, config.cls);
          config._timeout && clearTimeout(config._timeout);
        }
      }
    });
    this.deferredOnAnimate();
  }

  /** Process animation query */
  protected onAnimate(): void {
    let time = -1;
    this._entries.forEach((target) => {
      const config = this._configMap.get(target);
      if (!config) return;

      if (config._timeout) window.clearTimeout(config._timeout);
      if (config.group) {
        time = time === -1 ? 0 : (time + config.groupDelay);
        config._timeout = window.setTimeout(() => this.onAnimateItem(target), time);
      } else {
        this.onAnimateItem(target);
      }
      config._unsubscribe = !config.repeat;
    });
  }

  /** Animates passed item */
  protected onAnimateItem(item: Element): void {
    const config = this._configMap.get(item);
    if (!config) return;

    CSSClassUtils.add(item, config.cls);
    this._entries.delete(item);

    if (config._unsubscribe) this._unobserve(item);
  }
}

declare global {
  export interface ESLLibrary {
    AnimateService: typeof ESLAnimateService;
  }
}
