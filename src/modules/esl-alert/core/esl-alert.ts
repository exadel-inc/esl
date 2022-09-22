import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, jsonAttr, prop, listen} from '../../esl-utils/decorators';
import {isMatches} from '../../esl-utils/dom/traversing';
import {ESLToggleable} from '../../esl-toggleable/core';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {createZIndexIframe} from '../../esl-utils/fixes/ie-fixes';
import {TraversingQuery} from '../../esl-traversing-query/core';

import type {ESLToggleableActionParams, ESLToggleableRequestDetails} from '../../esl-toggleable/core';

export interface AlertActionParams extends ESLToggleableRequestDetails {
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
 * @author Julia Murashko, Alexey Stsefanovich (ala'n)
 *
 * ESLAlert is a component to show small notifications on your pages. ESLAlert can have multiple instances on the page.
 */
@ExportNs('Alert')
export class ESLAlert extends ESLToggleable {
  public static is = 'esl-alert';
  public static observedAttributes = ['target'];

  /** Default show/hide params for all ESLAlert instances */
  public static defaultConfig: AlertActionParams = {
    hideTime: 300,
    hideDelay: 2500
  };

  /** Event to show alert component */
  @prop('esl:alert:show') public override SHOW_REQUEST_EVENT: string;
  /** Event to hide alert component */
  @prop('esl:alert:hide') public override HIDE_REQUEST_EVENT: string;

  /**
   * Defines the scope (using {@link TraversingQuery} syntax) element to listen for an activation event.
   * Parent element by default
   */
  @attr({defaultValue: '::parent'}) public target: string;

  /** Default show/hide params for current ESLAlert instance */
  @jsonAttr<AlertActionParams>()
  public override defaultParams: AlertActionParams;

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

  protected override mergeDefaultParams(params?: ESLToggleableActionParams): ESLToggleableActionParams {
    const type = this.constructor as typeof ESLAlert;
    return Object.assign({}, type.defaultConfig, this.defaultParams || {}, params || {});
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected) return;
    if (attrName === 'target') {
      this.$target = TraversingQuery.first(this.target) as EventTarget;
    }
  }

  protected override connectedCallback(): void {
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

  /** Target element to listen to activation events */
  public get $target(): EventTarget {
    return this._$target;
  }
  public set $target($el: EventTarget) {
    this._$target = $el;
    this.$$on(this._onShowRequest);
    this.$$on(this._onHideRequest);
  }

  protected override onShow(params: AlertActionParams): void {
    if (this._clearTimeout) window.clearTimeout(this._clearTimeout);
    if (params.html || params.text) {
      this.render(params);
      super.onShow(params);
    }
    this.hide(params);
  }
  protected override onHide(params: AlertActionParams): void {
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

  protected override buildRequestParams(e: CustomEvent<ESLToggleableRequestDetails>): AlertActionParams | null {
    const detail = e.detail || {};
    if (!isMatches(this, detail.match)) return null;
    if (e.type === this.SHOW_REQUEST_EVENT) return Object.assign({}, detail, {force: true});
    if (e.type === this.HIDE_REQUEST_EVENT) return Object.assign({hideDelay: 0}, detail, {force: true});
    return null;
  }

  @listen({inherit: true, target: (el: ESLAlert) => el.$target})
  protected override _onHideRequest(e: CustomEvent<ESLToggleableRequestDetails>): void {
    super._onHideRequest(e);
    e.stopPropagation();
  }

  @listen({inherit: true, target: (el: ESLAlert) => el.$target})
  protected override _onShowRequest(e: CustomEvent<ESLToggleableRequestDetails>): void {
    super._onShowRequest(e);
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
