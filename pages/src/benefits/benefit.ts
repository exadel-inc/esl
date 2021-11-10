import {ready} from '../../../src/modules/esl-utils/decorators/ready';
import {memoize} from '../../../src/modules/esl-utils/decorators/memoize';
import {bind} from '../../../src/modules/esl-utils/decorators/bind';

import {ESLBaseElement} from '../../../src/modules/esl-base-element/core';

const options: IntersectionObserverInit  = {
  threshold: [0.5]
};

interface ESLAnimateConfig {
  group?: boolean;
  repeat?: boolean;
  delete?: boolean;
}

class ESLAnimateService {

  private _markedElements: Element[] = [];
  private _io = new IntersectionObserver(this.onIntersect, options);
  private _configMap = new WeakMap<Element, ESLAnimateConfig>();
  private _defaultConfig: ESLAnimateConfig = {repeat: false, group: false, delete: false};

  @memoize()
  static get instance() {
    return new ESLAnimateService();
  }

  configFor(el: Element): ESLAnimateConfig | undefined {
    return this._configMap.get(el);
  }

  /**
  * Intersection observable callback
  */
  @bind
  private onIntersect(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    entries.forEach((entry: IntersectionObserverEntry) => {
      const target = entry.target;
      const config = this.configFor(target);
      if (entry.isIntersecting) {
        this._markedElements.push(target);
        this.postponedAnimate();
        if (!config?.repeat) {
          observer.unobserve(target);
          config?.delete = true;
        }
      } else {
        if (config?.repeat) {
          target.setAttribute('esl-animate', 'true');
        }
      }
    });
  }

  /**
  * Method to show up HTMLElement
  */
  private handleAnimation() {
    let counter = 0;
    this._markedElements.forEach(el => {
      const config = this.configFor(el);
      if (config?.group) {
        setTimeout(() => el.setAttribute('esl-animate', 'false'), 100 * counter);
        counter++;
      } else {
        el.setAttribute('esl-animate', 'false');
      }
      config?.delete && this._configMap.delete(el);
    });
    this._markedElements = [];
  }

  private postponedAnimate() {
    setTimeout(() => this.handleAnimation(), 100);
  }

  public subscribe(el: HTMLElement, config?: ESLAnimateConfig) {
    this._configMap.set(el, Object.assign(this._defaultConfig, config));
    this._io.observe(el);
  }

  public unsubscribe(el: HTMLElement) {
    this._io.unobserve(el);
  }
}
export class ESLDemoAnimate extends ESLBaseElement {
  static is = 'esl-d-animate';

  @ready
  connectedCallback() {
    super.connectedCallback();
    ESLAnimateService.instance.subscribe(this, {repeat : true, group: true});
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    ESLAnimateService.instance.unsubscribe(this);
  }
}
