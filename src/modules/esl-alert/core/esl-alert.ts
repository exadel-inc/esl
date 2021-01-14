import {ExportNs} from '../../esl-utils/environment/export-ns';
import {bind} from '../../esl-utils/decorators/bind';
import {jsonAttr} from '../../esl-base-element/core';
import {ESLBasePopup, PopupActionParams} from '../../esl-base-popup/core';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {createIframe} from '../../esl-utils/fixes/ie-fixes';

export interface AlertActionParams extends PopupActionParams {
  /** text to be shown; pass empty string or null to hide */
  text?: string;
  /** classes to add to alert element */
  cls?: string;
}

@ExportNs('Alert')
export class ESLAlert extends ESLBasePopup {
  static is = 'esl-alert';
  static eventNs = 'esl:alert';

  static defaultConfig: AlertActionParams = {
    hideDelay: 2500
  };

  @jsonAttr<AlertActionParams>({defaultValue: ESLAlert.defaultConfig})
  public defaultParams: AlertActionParams;

  protected textEl: HTMLElement;

  /** Register and create global alert instance */
  public static init() {
    if (document.querySelector(ESLAlert.is)) return;
    ESLAlert.register();
    const alert = document.createElement(ESLAlert.is) as ESLAlert;
    document.body.appendChild(alert);
  }

  /** Global event handler */
  @bind
  onWindowEvent(e: CustomEvent) {
    if (e.type === `${ESLAlert.eventNs}:show`) {
      const params = Object.assign({}, e.detail, {force: true});
      this.show(params);
    }
    if (e.type === `${ESLAlert.eventNs}:hide`) {
      const params = Object.assign({}, {hideDelay: 0}, e.detail, {force: true});
      this.hide(params);
    }
  }

  public onShow(params: AlertActionParams) {
    if (params.text) {
      CSSUtil.addCls(this, params.cls);
      this.textEl.textContent = params.text;
      super.onShow(params);
    }
    this.hide(params);
    return this;
  }

  public onHide(params: AlertActionParams) {
    super.onHide(params);
    CSSUtil.removeCls(this, params.cls);
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.textEl = document.createElement('span');
    this.textEl.className = 'esl-alert-text';
    this.innerHTML = '';
    this.appendChild(this.textEl);
    if (DeviceDetector.isIE) {
      this.appendChild(createIframe());
    }
  }

  protected bindEvents() {
    super.bindEvents();

    window.addEventListener(`${ESLAlert.eventNs}:show`, this.onWindowEvent);
    window.addEventListener(`${ESLAlert.eventNs}:hide`, this.onWindowEvent);
  }

  protected unbindEvents() {
    super.unbindEvents();

    window.removeEventListener(`${ESLAlert.eventNs}:show`, this.onWindowEvent);
    window.removeEventListener(`${ESLAlert.eventNs}:hide`, this.onWindowEvent);
  }
}

export default ESLAlert;
