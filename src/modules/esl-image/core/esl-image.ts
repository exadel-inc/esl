import {ExportNs} from '../../esl-utils/environment/export-ns';
import {bind, prop, attr, boolAttr} from '../../esl-utils/decorators';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {ESLBaseElement} from '../../esl-base-element/core';
import {ESLMediaRuleList} from '../../esl-media-query/core';
import {ESLTraversingQuery} from '../../esl-traversing-query/core/esl-traversing-query';

import {getIObserver} from './esl-image-iobserver';
import {EMPTY_IMAGE, STRATEGIES, isEmptyImage} from './esl-image-strategies';

import type {ESLImageRenderStrategy} from './esl-image-strategies';

type LoadState = 'error' | 'loaded' | 'ready';
const isLoadState = (state: string): state is LoadState => ['error', 'loaded', 'ready'].includes(state);

/**
 * ESLImage - custom element, that provides flexible ways to include images on web pages.
 * Was originally developed as an alternative to `<picture>` element, but with more features inside.
 *
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 */
@ExportNs('Image')
export class ESLImage extends ESLBaseElement {
  public static override is = 'esl-image';
  public static observedAttributes = ['alt', 'role', 'mode', 'aria-label', 'data-src', 'data-src-base'];

  /** Default container class value */
  public static DEFAULT_CONTAINER_CLS = 'img-container-loaded';

  public static readonly STRATEGIES = STRATEGIES;
  public static readonly EMPTY_IMAGE = EMPTY_IMAGE;

  /** Event that represents ready state of {@link ESLImage} */
  @prop('ready') public READY_EVENT: string;
  /** Event that represents successfully loaded state of {@link ESLImage} */
  @prop('load') public LOAD_EVENT: string;
  /** Event that represents error state of {@link ESLImage} */
  @prop('error') public ERROR_EVENT: string;

  @attr() public alt: string;
  @attr({defaultValue: 'save-ratio'}) public mode: string;
  @attr({dataAttr: true}) public src: string;
  @attr({dataAttr: true}) public srcBase: string;

  @attr({defaultValue: 'none'}) public lazy: 'auto' | 'manual' | 'none' | '';

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
  private _shadowImageElement: HTMLImageElement;

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.alt =
      this.alt || this.getAttribute('aria-label') || this.getAttribute('data-alt') || '';
    this.updateA11y();
    this.srcRules = ESLMediaRuleList.parse(this.src);
    if (this.lazyObservable) {
      getIObserver().observe(this);
      this._detachLazyTrigger = function (): void {
        getIObserver().unobserve(this);
        this._detachLazyTrigger = null;
      };
    }
    this.refresh();
  }

  protected override disconnectedCallback(): void {
    this.clearImage();
    super.disconnectedCallback();
    this._detachLazyTrigger && this._detachLazyTrigger();
    if (this._srcRules) {
      this._srcRules.removeEventListener(this._onMediaMatchChange);
    }
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
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
        this.srcRules = ESLMediaRuleList.parse(newVal);
        this.refresh();
        break;
      case 'data-src-base':
        this.refresh();
        break;
      case 'mode':
        this.changeMode(oldVal, newVal);
        break;
    }
  }

  public get srcRules(): ESLMediaRuleList<string> {
    if (!this._srcRules) {
      this.srcRules = ESLMediaRuleList.parse(this.src);
    }
    return this._srcRules;
  }

  public set srcRules(rules: ESLMediaRuleList<string>) {
    if (this._srcRules) {
      this._srcRules.removeEventListener(this._onMediaMatchChange);
    }
    this._srcRules = rules;
    this._srcRules.addEventListener(this._onMediaMatchChange);
  }

  public get currentSrc(): string {
    return this._currentSrc;
  }

  public get empty(): boolean {
    return !this._currentSrc || isEmptyImage(this._currentSrc);
  }

  public get canUpdate(): boolean {
    return this.lazy === 'none';
  }

  public get lazyObservable(): boolean {
    return this.lazy === 'auto' || this.lazy === '';
  }

  public get originalWidth(): number {
    return this._shadowImageElement ? this._shadowImageElement.width : 0;
  }

  public get originalHeight(): number {
    return this._shadowImageElement ? this._shadowImageElement.height : 0;
  }

  protected changeMode(oldVal: string, newVal: string): void {
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

  protected update(force: boolean = false): void {
    if (!this.canUpdate) return;

    const src = this.getPath(this.srcRules.activeValue);

    if (this._currentSrc !== src || !this.ready || force) {
      this._currentSrc = src;
      this._shadowImg.src = src;

      if (this.refreshOnUpdate || !this.ready) {
        this.syncImage();
      }

      if (this._shadowImg.complete) {
        this._shadowImgError ? this._onError() : this._onLoad();
      }
    }

    this._detachLazyTrigger && this._detachLazyTrigger();
  }

  protected updateA11y(): void {
    const role = this.getAttribute('role') || 'img';
    this.setAttribute('role', role);
    this.innerImage && (this.innerImage.alt = this.alt);
    if (role === 'img') this.setAttribute('aria-label', this.alt);
  }

  protected getPath(src: string | undefined): string {
    if (!src || src === '0' || src === 'none') {
      return ESLImage.EMPTY_IMAGE;
    }
    return this.srcBase + src;
  }

  public refresh(): void {
    this.removeAttribute('loaded');
    this.removeAttribute('ready');
    this.updateContainerClasses();
    this.clearImage();
    this.update(true);
  }

  private syncImage(): void {
    const strategy = STRATEGIES[this.mode];
    this._strategy = strategy;
    strategy && strategy.apply(this, this._shadowImg);
  }

  private clearImage(): void {
    this._strategy && this._strategy.clear(this);
    this._strategy = null;
  }

  public get innerImage(): HTMLImageElement | null {
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

  public removeInnerImage(): void {
    if (!this.innerImage) return;
    this.removeChild(this.innerImage);
    setTimeout(() => {
      if (this._innerImg && !this._innerImg.parentNode) {
        this._innerImg = null;
      }
    });
  }

  protected get _shadowImg(): HTMLImageElement {
    if (!this._shadowImageElement) {
      this._shadowImageElement = new Image();
      this._shadowImageElement.onload = this._onLoad;
      this._shadowImageElement.onerror = this._onError;
    }
    return this._shadowImageElement;
  }

  protected get _shadowImgError(): boolean {
    if (!this._shadowImg.complete) return false;
    if (this._shadowImg.src.slice(-4) === '.svg') return false;
    return this._shadowImg.naturalHeight <= 0;
  }

  @bind
  private _onLoad(): void {
    this.syncImage();
    this._onReadyState(true);
    this.updateContainerClasses();
  }

  @bind
  private _onError(): void {
    this._onReadyState(false);
    this.updateContainerClasses();
  }

  @bind
  private _onMediaMatchChange(): void {
    this.update();
  }

  private _onReadyState(successful: boolean): void {
    if (this.ready) return;
    this.toggleAttribute('loaded', successful);
    this.toggleAttribute('error', !successful);
    this.toggleAttribute('ready', true);

    this.$$fire(successful ? this.LOAD_EVENT : this.ERROR_EVENT, {bubbles: false});
    this.$$fire(this.READY_EVENT, {bubbles: false});
  }

  public updateContainerClasses(): void {
    if (this.containerClass === null) return;
    const cls = this.containerClass || (this.constructor as typeof ESLImage).DEFAULT_CONTAINER_CLS;
    const state = isLoadState(this.containerClassState) && this[this.containerClassState];

    const targetEl = ESLTraversingQuery.first(this.containerClassTarget, this) as HTMLElement;
    targetEl && CSSClassUtils.toggle(targetEl, cls, state);
  }
}

declare global {
  export interface ESLLibrary {
    Image: typeof ESLImage;
  }
  export interface HTMLElementTagNameMap {
    'esl-image': ESLImage;
  }
}
