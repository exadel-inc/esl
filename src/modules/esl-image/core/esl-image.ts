/**
 * ESL Image
 * @version 1.0.0
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 */

import {ExportNs} from '../../esl-utils/environment/export-ns';
import {bind} from '../../esl-utils/decorators/bind';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {ESLBaseElement, attr, boolAttr} from '../../esl-base-element/core';
import {ESLMediaRuleList} from '../../esl-media-query/core';
import {TraversingQuery} from '../../esl-traversing-query/core/esl-traversing-query';

import {getIObserver} from './esl-image-iobserver';
import {ESLImageRenderStrategy, ShadowImageElement, STRATEGIES} from './esl-image-strategies';

type LoadState = 'error' | 'loaded' | 'ready';
const isLoadState = (state: string): state is LoadState => ['error', 'loaded', 'ready'].indexOf(state) !== -1;

@ExportNs('Image')
export class ESLImage extends ESLBaseElement {
  public static is = 'esl-image';

  // Default container class value
  public static DEFAULT_CONTAINER_CLS = 'img-container-loaded';

  public static get STRATEGIES() {
    return STRATEGIES;
  }

  static get EMPTY_IMAGE() {
    return 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  }

  static get observedAttributes() {
    return ['alt', 'role', 'mode', 'aria-label', 'data-src', 'data-src-base', 'lazy-triggered'];
  }

  @attr() public alt: string;
  @attr({defaultValue: 'save-ratio'}) public mode: string;
  @attr({dataAttr: true}) public src: string;
  @attr({dataAttr: true}) public srcBase: string;

  @attr({defaultValue: 'none'}) public lazy: 'auto' | 'manual' | 'none' | '';
  @boolAttr() public lazyTriggered: boolean;

  @boolAttr() public refreshOnUpdate: boolean;
  @attr({defaultValue: 'inner-image'}) public innerImageClass: string;

  @attr({defaultValue: null}) public containerClass: string | null;
  @attr({defaultValue: '::parent'}) public containerClassTarget: string;
  @attr({defaultValue: 'ready'}) public containerClassState: string;

  @boolAttr({readonly: true}) public readonly ready: boolean;
  @boolAttr({readonly: true}) public readonly loaded: boolean;
  @boolAttr({readonly: true}) public readonly error: boolean;

  private _strategy: ESLImageRenderStrategy | null;
  private _innerImg: HTMLImageElement | null;
  private _srcRules: ESLMediaRuleList<string>;
  private _currentSrc: string;
  private _detachLazyTrigger: () => void;
  private _shadowImageElement: ShadowImageElement;

  protected connectedCallback() {
    super.connectedCallback();
    this.alt =
      this.alt || this.getAttribute('aria-label') || this.getAttribute('data-alt') || '';
    this.updateA11y();
    this.srcRules.addListener(this._onMediaMatchChange);
    if (this.lazyObservable) {
      this.removeAttribute('lazy-triggered');
      getIObserver().observe(this);
      this._detachLazyTrigger = function () {
        getIObserver().unobserve(this);
        this._detachLazyTrigger = null;
      };
    }
    this.refresh();
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this._detachLazyTrigger && this._detachLazyTrigger();
    if (this._srcRules) {
      this._srcRules.removeListener(this._onMediaMatchChange);
    }
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (!this.connected || oldVal === newVal) return;
    switch (attrName) {
      case 'aria-label':
        this.alt = newVal || '';
        break;
      case 'alt':
      case 'role':
        this.updateA11y();
        break;
      case 'data-src':
        this.srcRules = ESLMediaRuleList.parse<string>(newVal, ESLMediaRuleList.STRING_PARSER);
        this.refresh();
        break;
      case 'data-src-base':
        this.refresh();
        break;
      case 'mode':
        this.changeMode(oldVal, newVal);
        break;
      case 'lazy-triggered':
        this.lazyTriggered && this.update();
        break;
    }
  }

  public get srcRules() {
    if (!this._srcRules) {
      this.srcRules = ESLMediaRuleList.parse<string>(this.src, ESLMediaRuleList.STRING_PARSER);
    }
    return this._srcRules;
  }

  public set srcRules(rules: ESLMediaRuleList<string>) {
    if (this._srcRules) {
      this._srcRules.removeListener(this._onMediaMatchChange);
    }
    this._srcRules = rules;
    this._srcRules.addListener(this._onMediaMatchChange);
  }

  public get currentSrc() {
    return this._currentSrc;
  }

  public get empty() {
    return !this._currentSrc || ESLImage.isEmptyImage(this._currentSrc);
  }

  public get canUpdate() {
    return this.lazyTriggered || this.lazy === 'none';
  }

  public get lazyObservable() {
    return this.lazy !== 'none' && this.lazy !== 'manual';
  }

  public triggerLoad() {
    this.setAttribute('lazy-triggered', '');
  }

  protected changeMode(oldVal: string, newVal: string) {
    oldVal = oldVal || 'save-ratio';
    newVal = newVal || 'save-ratio';
    if (oldVal === newVal) return;
    if (!STRATEGIES[newVal]) {
      this.mode = oldVal;
      throw new Error('ESL Image: Unsupported mode: ' + newVal);
    }
    this.clearImage();
    if (this.loaded) this.syncImage();
  }

  protected update(force: boolean = false) {
    if (!this.canUpdate) return;

    const rule = this.srcRules.active;
    const src = this.getPath(rule.payload);
    const dpr = rule.dpr;

    if (this._currentSrc !== src || !this.ready || force) {
      this._currentSrc = src;
      this._shadowImg.src = src;
      this._shadowImg.dpr = dpr;

      if (this.refreshOnUpdate || !this.ready) {
        this.syncImage();
      }

      if (this._shadowImg.complete && this._shadowImg.naturalHeight > 0) {
        this._onLoad();
      }
      if (this._shadowImg.complete && this._shadowImg.naturalHeight <= 0) {
        this._onError();
      }
    }

    this._detachLazyTrigger && this._detachLazyTrigger();
  }

  protected updateA11y() {
    const role = this.getAttribute('role') || 'img';
    this.setAttribute('role', role);
    this.innerImage && (this.innerImage.alt = this.alt);
    if (role === 'img') this.setAttribute('aria-label', this.alt);
  }

  protected getPath(src: string | null) {
    if (!src || src === '0' || src === 'none') {
      return ESLImage.EMPTY_IMAGE;
    }
    return this.srcBase + src;
  }

  public refresh() {
    this.removeAttribute('loaded');
    this.removeAttribute('ready');
    this.updateContainerClasses();
    this.clearImage();
    this.update(true);
  }

  private syncImage() {
    const strategy = STRATEGIES[this.mode];
    this._strategy = strategy;
    strategy && strategy.apply(this, this._shadowImg);
  }

  private clearImage() {
    this._strategy && this._strategy.clear(this);
    this._strategy = null;
  }

  public get innerImage() {
    return this._innerImg;
  }

  public attachInnerImage(): HTMLImageElement {
    if (!this._innerImg) {
      this._innerImg = this.querySelector(`img.${this.innerImageClass}`) ||
        this._shadowImg.cloneNode() as HTMLImageElement;
      this._innerImg.className = this.innerImageClass;
    }
    if (!this._innerImg.parentNode) {
      this.appendChild(this._innerImg);
    }
    this._innerImg.alt = this.alt;
    return this._innerImg;
  }

  public removeInnerImage() {
    if (!this.innerImage) return;
    this.removeChild(this.innerImage);
    setTimeout(() => {
      if (this._innerImg && !this._innerImg.parentNode) {
        this._innerImg = null;
      }
    });
  }

  protected get _shadowImg() {
    if (!this._shadowImageElement) {
      this._shadowImageElement = new Image();
      this._shadowImageElement.onload = this._onLoad;
      this._shadowImageElement.onerror = this._onError;
    }
    return this._shadowImageElement;
  }

  @bind
  private _onLoad() {
    this.syncImage();
    this._onReadyState(true);
    this.updateContainerClasses();
  }

  @bind
  private _onError() {
    this._onReadyState(false);
    this.updateContainerClasses();
  }

  @bind
  private _onMediaMatchChange() {
    this.update();
  }

  private _onReadyState(successful: boolean) {
    if (this.ready) return;
    this.toggleAttribute('loaded', successful);
    this.toggleAttribute('error', !successful);
    this.toggleAttribute('ready', true);
    this.$$fire(successful ? 'loaded' : 'error');
    this.$$fire('ready');
  }

  public updateContainerClasses() {
    if (this.containerClass === null) return;
    const cls = this.containerClass || (this.constructor as typeof ESLImage).DEFAULT_CONTAINER_CLS;
    const state = isLoadState(this.containerClassState) && this[this.containerClassState];
    const targetEl = TraversingQuery.first(this.containerClassTarget, this) as HTMLElement;
    targetEl && CSSUtil.toggleClsTo(targetEl, cls, state);
  }

  public $$fire(eventName: string, eventInit: CustomEventInit = {bubbles: false}): boolean {
    return super.$$fire(eventName, eventInit);
  }

  public static isEmptyImage(src: string) {
    return src === ESLImage.EMPTY_IMAGE;
  }
}

export default ESLImage;
