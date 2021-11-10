import {ready} from '../../../src/modules/esl-utils/decorators/ready';
import {memoize} from '../../../src/modules/esl-utils/decorators/memoize';
import {bind} from '../../../src/modules/esl-utils/decorators/bind';
import {ESLBaseElement} from '../../../src/modules/esl-base-element/core';


const options = {
  threshold: [0.5]
};

interface Iconfig {
  group?: boolean;
  repeat?: boolean;
  delete?: boolean;
}

class AnimateService {

  private _markedElements: Element[] = [];
  private _io = new IntersectionObserver(this.onIntersect, options);
  private _configMap = new WeakMap<Element, Iconfig>();

  @memoize()
  static get instance() {
    return new AnimateService();
  }

  configFor(el: Element): Iconfig | undefined {
    return this._configMap.get(el);
  }

  /**
  * Intersection observable callback
  */
  @bind
  private onIntersect(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    console.log(entries);
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
  private makeAppear() {
    let counter = 0;
    this._markedElements.forEach(el => {
      if (this.configFor(el)?.group) {
        setTimeout(() => el.setAttribute('esl-animate', 'false'), 100 * counter);
        counter++;
      } else {
        el.setAttribute('esl-animate', 'false');
      }
      this.configFor(el)?.delete && this._configMap.delete(el);
    });
    this._markedElements = [];
  }

  private postponedAnimate = () => setTimeout(() => this.makeAppear(), 100);

  public subscribe(el: HTMLElement, config?: Iconfig) {
    this._configMap.set(el, Object.assign({repeat: false, group: false, delete: false}, config));
    this._io.observe(el);
  }

  public unsubscribe(el: HTMLElement) {
    this._io.unobserve(el);
  }
}


export class ESLAnimate extends ESLBaseElement {
  static is = 'esl-animate';

  @ready
  connectedCallback() {
    super.connectedCallback();
    AnimateService.instance.subscribe(this, {repeat : true, group: true});
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    AnimateService.instance.unsubscribe(this);
  }
}

