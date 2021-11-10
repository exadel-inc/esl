import {ready} from '../../../src/modules/esl-utils/decorators/ready';
import {memoize} from '../../../src/modules/esl-utils/decorators/memoize';
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

  private _markedElements: HTMLElement[] = [];
  private _io = new IntersectionObserver(this.onIntersect.bind(this), options);
  private _configMap = new WeakMap<HTMLElement, Iconfig>();

  @memoize()
  static get instance() {
    return new AnimateService();
  }

  configFor = (el: HTMLElement) => this._configMap.get(el);
  /**
  * Intersection observable callback
  */
  private onIntersect(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        this._markedElements.push(entry.target);
        this.postponedAnimate();
      }
      if (!entry.isIntersecting && this.configFor(entry.target)?.repeat) {
        entry.target.setAttribute('esl-animate', 'true');
      }
      if (!this.configFor(entry.target)?.repeat && entry.isIntersecting) {
        observer.unobserve(entry.target);
        this.configFor(entry.target)?.delete = true;
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
        setTimeout(()=> el.setAttribute('esl-animate', 'false'), 100 * counter);
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
    const defaultConfig = config ? config : {repeat: false, group: false};
    defaultConfig.delete = false;
    this._configMap.set(el, defaultConfig);
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

