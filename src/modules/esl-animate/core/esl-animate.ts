import {debounce} from '../../esl-utils/async/debounce';
import {wrap} from '../../esl-utils/misc/array';

interface ESLAnimateConfig {
  /* Delay to display element(s) after previous one. If negative or false then play animation immodestly */
  group?: number | false;
  /* Observe and animate element(s) infinitely */
  repeat?: boolean;
  delete?: boolean;
}

/* Service to animate elements on viewport intersection */
export class ESLAnimateService  {

  protected static readonly DEFUALT_CONFIG: ESLAnimateConfig = {repeat: false, group: false, delete: false};
  protected static readonly OPTIONS_OBSERVER: IntersectionObserverInit = {threshold: [0.5]};

  protected static _markedElements: Element[] = [];
  protected static _io = new IntersectionObserver(ESLAnimateService.onIntersect, ESLAnimateService.OPTIONS_OBSERVER);
  protected static _configMap = new WeakMap<Element, ESLAnimateConfig>();

  static postponedAnimate = debounce(() => ESLAnimateService.handleAnimation(), 100);

  /**
  * Intersection observable callback
  */
  static onIntersect(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void {
    entries.forEach((entry: IntersectionObserverEntry) => {
      const target = entry.target;
      const config = ESLAnimateService.configFor(target);
      if (!config) return;
      if (entry.isIntersecting) {
        ESLAnimateService._markedElements.push(target);
        ESLAnimateService.postponedAnimate();
        if (!config.repeat) {
          observer.unobserve(target);
          config.delete = true;
        }
      } else {
        if (config.repeat) {
          ESLAnimateService.toggleAttribute(target, 'true');
        }
      }
    });
  }

  /**
  * Method to show up HTMLElement
  */
  static handleAnimation(): void {
    let counter = 0;
    ESLAnimateService._markedElements.forEach((el) => {
      const config = ESLAnimateService.configFor(el);
      // console.log(el, config);
      if (!config) return;
      if (config.group) {
        counter += config.group;
        setTimeout(() => ESLAnimateService.toggleAttribute(el, 'false'), counter);
      } else {
        ESLAnimateService.toggleAttribute(el, 'false');
      }
      config.delete && ESLAnimateService._configMap.delete(el);
    });
    ESLAnimateService._markedElements = [];
  }

  static toggleAttribute(el: Element, value: string): void {
    el.setAttribute('esl-animate', value);
  }

  /**
   * Subscribe ESlAnimateService on element(s) to animate it on viewport intersection
   * @param el - element or elements to observe and animate
   * @param config - optional animation configuration
   */

  static observe(el: Element | Element[], config?: ESLAnimateConfig): void {
    wrap(el).forEach((item: Element) => {
      ESLAnimateService._configMap.set(item, Object.assign({}, ESLAnimateService.DEFUALT_CONFIG, config));
      ESLAnimateService._io.observe(item);
    });
  }

  /**
   * Unobserve element or elements
   * @returns true if element(s) was presented in observation list
   */
  static unobserve(el: Element | Element[]): void {
    wrap(el).forEach((item: Element) => {
      ESLAnimateService._io.unobserve(item);
      ESLAnimateService._configMap.delete(item);
    });
  }

  /**
  * @returns if service observing passed element
  */
  static configFor(el: Element): ESLAnimateConfig | undefined {
    return ESLAnimateService._configMap.get(el);
  }
}
