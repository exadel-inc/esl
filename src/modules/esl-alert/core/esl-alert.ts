import {ExportNs} from '../../esl-utils/environment/export-ns';
import {bind} from '../../esl-utils/decorators/bind';
import {attr, jsonAttr} from '../../esl-base-element/core';
import {ESLBasePopup, PopupActionParams} from '../../esl-base-popup/core';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';

export interface AlertActionParams extends PopupActionParams {
  text: string;
  cls?: string;
}

@ExportNs('Alert')
export class ESLAlert extends ESLBasePopup {
  static is = 'esl-alert';
  static eventNs = 'esl:alert';

  @jsonAttr<AlertActionParams>({defaultValue: {text: '', cls: ''}})
  public defaultParams: AlertActionParams;

  @attr({defaultValue: ''}) public cls: string;
  protected text: HTMLElement;

  public static init() {
    if (document.querySelector(ESLAlert.is)) return;
    ESLAlert.register();
    const alert = document.createElement(ESLAlert.is) as ESLAlert;
    document.body.appendChild(alert);
  }

  @bind
  onTriggerHandler(e: CustomEvent) {
    if (e.type === `${ESLAlert.eventNs}:show`) {
      const params = Object.assign({}, {hideDelay: 2500}, e.detail, {force: true});
      this.show(params);
    }
    if (e.type === `${ESLAlert.eventNs}:hide`) {
      const params = Object.assign({}, {hideDelay: 0}, e.detail, {force: true});
      this.hide(params);
    }
  }

  public onShow(params: AlertActionParams) {
    if (params.text) {
      this.cls = params.cls || this.cls;
      this.text.textContent = params.text;
      super.onShow(params);
    }
    this.hide(params);
    return this;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.text = document.createElement('span');
    this.text.className = 'hpe-alert-text';
    this.innerHTML = '';
    this.appendChild(this.text);
    if (DeviceDetector.isIE) {
      this.appendChild(createIframe());
    }
  }

  protected bindEvents() {
    super.bindEvents();

    window.addEventListener(`${ESLAlert.eventNs}:show`, this.onTriggerHandler);
    window.addEventListener(`${ESLAlert.eventNs}:hide`, this.onTriggerHandler);
  }

  protected unbindEvents() {
    super.unbindEvents();

    window.removeEventListener(`${ESLAlert.eventNs}:show`, this.onTriggerHandler);
    window.removeEventListener(`${ESLAlert.eventNs}:hide`, this.onTriggerHandler);
  }
}

function createIframe() {
  const iframe = document.createElement('iframe');
  iframe.className = 'ie-zindex-fix';
  iframe.src = 'about:blank';
  return iframe;
}

export default ESLAlert;
