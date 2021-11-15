import {debounce} from '../../esl-utils/async/debounce';
import {wrap} from '../../esl-utils/misc/array';
import {memoize} from '../../esl-utils/decorators/memoize';
import {bind} from '../../esl-utils/decorators/bind';
interface ESLAnimateConfig {
  /* Delay to display element(s) after previous one. If negative or false then play animation immodestly */
  group?: number | false;
  /* Observe and animate element(s) infinitely */
  repeat?: boolean;
  /* Protected by defult */
  delete?: boolean;
}

/* Service to animate elements on viewport intersection */
export class ESLAnimateService  {

  protected static readonly DEFUALT_CONFIG: ESLAnimateConfig = {repeat: false, group: false, delete: false};
  protected static readonly OPTIONS_OBSERVER: IntersectionObserverInit = {threshold: [0.5]};

  protected  _markedElements: Element[] = [];
  protected  _io = new IntersectionObserver(this.onIntersect, ESLAnimateService.OPTIONS_OBSERVER);
  protected  _configMap = new WeakMap<Element, ESLAnimateConfig>();

  protected postponedAnimate = debounce(() => this.handleAnimation(), 100);

  @memoize()
  private static get instance() {
    return new ESLAnimateService();
  }
  /**
  * Intersection observable callback
  */
  @bind
  protected onIntersect(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void {
    entries.forEach((entry: IntersectionObserverEntry) => {
      const target = entry.target;
      const config = ESLAnimateService.configFor(target);
      if (!config) return;
      if (entry.isIntersecting) {
        this._markedElements.push(target);
        this.postponedAnimate();
        if (!config.repeat) {
          observer.unobserve(target);
          config.delete = true;
        }
      } else {
        if (config.repeat) {
          this.toggleAttribute(target, false);
        }
      }
    });
  }

  /**
  * Method to show up HTMLElement
  */
  protected handleAnimation(): void {
    let counter = 0;
    this._markedElements.forEach((el) => {
      const config = ESLAnimateService.configFor(el);
      // console.log(el, config);
      if (!config) return;
      if (config.group) {
        counter += config.group;
        setTimeout(() => this.toggleAttribute(el, true), counter);
      } else {
        this.toggleAttribute(el, true);
      }
      config.delete && this._configMap.delete(el);
    });
    this._markedElements = [];
  }

  protected toggleAttribute(el: Element, value: boolean): void {
    el.setAttribute('esl-animate', value ? 'done' : '');
  }

  /**
   * Subscribe ESlAnimateService on element(s) to animate it on viewport intersection
   * @param el - element or elements to observe and animate
   * @param config - optional animation configuration
   */

   static observe(el: Element | Element[], config?: ESLAnimateConfig): void {
    wrap(el).forEach((item: Element) => {
      item.setAttribute('esl-animate', '');
      this.instance._configMap.set(item, Object.assign({}, this.DEFUALT_CONFIG, config));
      this.instance._io.observe(item);
    });
  }

  /**
   * Unobserve element or elements
   */
   static unobserve(el: Element | Element[]): void {
    wrap(el).forEach((item: Element) => {
      this.instance._io.unobserve(item);
      this.instance._configMap.delete(item);
    });
  }

  /**
  * @returns if service observing passed element
  */
   static configFor(el: Element): ESLAnimateConfig | undefined {
    return this.instance._configMap.get(el);
  }
}
