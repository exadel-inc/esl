import {ExportNs} from '../../esl-utils/environment/export-ns';
import {bind} from '../../esl-utils/decorators/bind';
import {attr, jsonAttr} from '../../esl-base-element/core';
import {ESLToggleable, ToggleableActionParams} from '../../esl-toggleable/core';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {createZIndexIframe} from '../../esl-utils/fixes/ie-fixes';
import {TraversingQuery} from '../../esl-traversing-query/core/esl-traversing-query';

export interface AlertActionParams extends ToggleableActionParams {
  /** text to be shown; pass empty string or null to hide */
  text?: string;
  /** html content */
  html?: string;
  /** classes to add to alert element */
  cls?: string;
}

@ExportNs('Alert')
export class ESLAlert extends ESLToggleable {
  static is = 'esl-alert';
  static eventNs = 'esl:alert';

  static defaultConfig: AlertActionParams = {
    hideDelay: 2500
  };

  @attr({defaultValue: '::parent'}) public target: string;

  @jsonAttr<AlertActionParams>()
  public defaultParams: AlertActionParams;

  protected $text: HTMLElement;

  private _$target: EventTarget;

  /** Create global alert instance */
  public static init() {
    if (document.querySelector(`body > ${ESLAlert.is}`)) return;
    const alert = document.createElement(ESLAlert.is) as ESLAlert;
    document.body.appendChild(alert);
  }

  protected mergeDefaultParams(params?: ToggleableActionParams): ToggleableActionParams {
    const type = this.constructor as typeof ESLAlert;
    return Object.assign({}, type.defaultConfig, this.defaultParams || {}, params || {});
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.render();
    if (this.target) {
      this.$target = TraversingQuery.first(this.target, this) as EventTarget;
    }
  }

  protected unbindEvents() {
    super.unbindEvents();
    this.unbindTargetEvents();
  }

  protected render() {
    this.$text = document.createElement('div');
    this.$text.className = 'esl-alert-text';
    this.innerHTML = '';
    this.appendChild(this.$text);
    if (DeviceDetector.isIE) {
      this.appendChild(createZIndexIframe());
    }
  }

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
    if (params.text || params.html) {
      CSSUtil.addCls(this, params.cls);
      if (params.text) {
        this.$text.textContent = params.text;
      } else if (params.html) {
        this.$text.innerHTML = params.html;
      }
      super.onShow(params);
    }
    this.hide(params);
    return this;
  }
  protected onHide(params: AlertActionParams) {
    super.onHide(params);
    CSSUtil.removeCls(this, params.cls);
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
