import {ExportNs} from '../../esl-utils/environment/export-ns';
import {bind} from '../../esl-utils/decorators/bind';
import {attr, jsonAttr} from '../../esl-base-element/core';
import {ESLToggleable} from '../../esl-toggleable/core';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {createZIndexIframe} from '../../esl-utils/fixes/ie-fixes';
import {TraversingQuery} from '../../esl-traversing-query/core';

import type {ToggleableActionParams} from '../../esl-toggleable/core';

export interface AlertActionParams extends ToggleableActionParams {
  /** text to be shown; passes empty string or null to hide */
  text?: string;
  /** html content */
  html?: string;
  /** classes to add to alert element */
  cls?: string;
  /** timeout to clear classes */
  hideTime?: number;
}

/**
 * ESLAlert component
 *
 * @author Julia Murashko
 *
 * ESLAlert is a component to show small notifications on your pages. ESLAlert can have multiple instances on the page.
 */
@ExportNs('Alert')
export class ESLAlert extends ESLToggleable {
  public static is = 'esl-alert';
  public static eventNs = 'esl:alert';
  public static observedAttributes = ['target'];

  /** Default show/hide params for all ESLAlert instances */
  public static defaultConfig: AlertActionParams = {
    hideTime: 300,
    hideDelay: 2500
  };

  /**
   * Defines the scope (using {@link TraversingQuery} syntax) element to listen for an activation event.
   * Parent element by default
   */
  @attr({defaultValue: '::parent'}) public target: string;

  /** Default show/hide params for current ESLAlert instance */
  @jsonAttr<AlertActionParams>()
  public defaultParams: AlertActionParams;

  protected $content: HTMLElement;
  protected activeCls?: string;

  private _$target: EventTarget;
  private _clearTimeout: number;

  /** Creates global alert instance (using body element as a base) */
  public static init(options?: Partial<ESLAlert>): ESLAlert {
    let alert: ESLAlert = document.querySelector(`body > ${ESLAlert.is}`)!;
    if (!alert) {
      alert = document.createElement(ESLAlert.is) as ESLAlert;
      options && Object.assign(alert, options);
      document.body.appendChild(alert);
    }
    return alert;
  }

  protected mergeDefaultParams(params?: ToggleableActionParams): ToggleableActionParams {
    const type = this.constructor as typeof ESLAlert;
    return Object.assign({}, type.defaultConfig, this.defaultParams || {}, params || {});
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected) return;
    if (attrName === 'target') {
      this.$target = TraversingQuery.first(this.target) as EventTarget;
    }
  }

  protected connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', this.getAttribute('role') || 'alert');
    this.$content = document.createElement('div');
    this.$content.className = 'esl-alert-content';
    this.innerHTML = '';
    this.appendChild(this.$content);
    if (DeviceDetector.isIE) this.appendChild(createZIndexIframe());
    if (this.target) {
      this.$target = TraversingQuery.first(this.target, this) as EventTarget;
    }
  }

  protected unbindEvents(): void {
    super.unbindEvents();
    this.unbindTargetEvents();
  }

  /** Target element to listen to activation events */
  public get $target(): EventTarget {
    return this._$target;
  }
  public set $target($el: EventTarget) {
    this.unbindTargetEvents();
    this._$target = $el;
    this.bindTargetEvents();
  }

  protected bindTargetEvents(): void {
    if (!this.$target || !this.connected) return;
    this.$target.addEventListener(`${ESLAlert.eventNs}:show`, this._onTargetEvent);
    this.$target.addEventListener(`${ESLAlert.eventNs}:hide`, this._onTargetEvent);
  }
  protected unbindTargetEvents(): void {
    if (!this.$target) return;
    this.$target.removeEventListener(`${ESLAlert.eventNs}:show`, this._onTargetEvent);
    this.$target.removeEventListener(`${ESLAlert.eventNs}:hide`, this._onTargetEvent);
  }

  protected onShow(params: AlertActionParams): void {
    if (this._clearTimeout) window.clearTimeout(this._clearTimeout);
    if (params.html || params.text) {
      this.render(params);
      super.onShow(params);
    }
    this.hide(params);
  }
  protected onHide(params: AlertActionParams): void {
    super.onHide(params);
    this._clearTimeout = window.setTimeout(() => this.clear(), params.hideTime);
  }

  protected render({text, html, cls}: AlertActionParams): void {
    CSSClassUtils.remove(this, this.activeCls);
    CSSClassUtils.add(this, this.activeCls = cls);
    if (html) this.$content.innerHTML = html;
    if (text) this.$content.textContent = text;
  }
  protected clear(): void {
    this.$content.innerHTML = '';
    CSSClassUtils.remove(this, this.activeCls);
  }

  @bind
  protected _onTargetEvent(e: CustomEvent): void {
    if (e.type === `${ESLAlert.eventNs}:show`) {
      const params = Object.assign({}, e.detail, {force: true});
      this.show(params);
    }
    if (e.type === `${ESLAlert.eventNs}:hide`) {
      const params = Object.assign({}, {hideDelay: 0}, e.detail, {force: true});
      this.hide(params);
    }
    e.stopPropagation();
  }
}

declare global {
  export interface ESLLibrary {
    Alert: typeof ESLAlert;
  }
  export interface HTMLElementTagNameMap {
    'esl-alert': ESLAlert;
  }
}
