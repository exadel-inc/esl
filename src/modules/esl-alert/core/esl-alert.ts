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
  /** text to be shown; pass empty strings or null to hide */
  text?: string;
  /** html contents */
  html?: string;
  /** classes to add to alert elements */
  cls?: string;
  /** timeout to clear classes */
  hideTime?: number;
}

/**
 * ESLAlert components
 *
 * @author Julia Murashko
 *
 * ESLAlert is a component to show small notifications on your pages. ESLAlert can have multiple instances on the pages.
 */
@ExportNs('Alert')
export class ESLAlert extends ESLToggleable {
  static is = 'esl-alert';
  static eventNs = 'esl:alert';

  static get observedAttributes() {
    return ['target'];
  }

  /** Default shows/hides params for all ESLAlert instances */
  static defaultConfig: AlertActionParams = {
    hideTime: 300,
    hideDelay: 2500
  };

  /**
   * Defines the scope (using {@link TraversingQuery} syntax) element to listen for an activation events.
   * Parent element by default
   */
  @attr({defaultValue: '::parent'}) public target: string;

  /** Default shows/hides params for current ESLAlert instance */
  @jsonAttr<AlertActionParams>()
  public defaultParams: AlertActionParams;

  protected $content: HTMLElement;
  protected activeCls?: string;

  private _$target: EventTarget;
  private _clearTimeout: number;

  /** Create global alert instance (using body elements as a base) */
  public static init() {
    if (document.querySelector(`body > ${ESLAlert.is}`)) return;
    const alert = document.createElement(ESLAlert.is) as ESLAlert;
    document.body.appendChild(alert);
  }

  protected mergeDefaultParams(params?: ToggleableActionParams): ToggleableActionParams {
    const type = this.constructor as typeof ESLAlert;
    return Object.assign({}, type.defaultConfig, this.defaultParams || {}, params || {});
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (!this.connected) return;
    if (attrName === 'target') {
      this.$target = TraversingQuery.first(this.target) as EventTarget;
    }
  }

  protected connectedCallback() {
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

  protected unbindEvents() {
    super.unbindEvents();
    this.unbindTargetEvents();
  }

  /** Target elements to listen to activation events */
  public get $target() {
    return this._$target;
  }
  public set $target($el: EventTarget) {
    this.unbindTargetEvents();
    this._$target = $el;
    this.bindTargetEvents();
  }

  protected bindTargetEvents() {
    if (!this.$target || !this.connected) return;
    this.$target.addEventListener(`${ESLAlert.eventNs}:show`, this._onTargetEvent);
    this.$target.addEventListener(`${ESLAlert.eventNs}:hide`, this._onTargetEvent);
  }
  protected unbindTargetEvents() {
    if (!this.$target) return;
    this.$target.removeEventListener(`${ESLAlert.eventNs}:show`, this._onTargetEvent);
    this.$target.removeEventListener(`${ESLAlert.eventNs}:hide`, this._onTargetEvent);
  }

  protected onShow(params: AlertActionParams) {
    if (this._clearTimeout) window.clearTimeout(this._clearTimeout);
    if (params.html || params.text) {
      this.render(params);
      super.onShow(params);
    }
    this.hide(params);
  }
  protected onHide(params: AlertActionParams) {
    super.onHide(params);
    this._clearTimeout = window.setTimeout(() => this.clear(), params.hideTime);
  }

  protected render({text, html, cls}: AlertActionParams) {
    CSSClassUtils.remove(this, this.activeCls);
    CSSClassUtils.add(this, this.activeCls = cls);
    if (html) this.$content.innerHTML = html;
    if (text) this.$content.textContent = text;
  }
  protected clear() {
    this.$content.innerHTML = '';
    CSSClassUtils.remove(this, this.activeCls);
  }

  @bind
  protected _onTargetEvent(e: CustomEvent) {
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
