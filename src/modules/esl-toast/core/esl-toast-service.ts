import {ExportNs} from '../../esl-utils/environment/export-ns';
import {bind} from '../../esl-utils/decorators/bind';
import {ESLBaseElement, jsonAttr} from '../../esl-base-element/core';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {createIframe} from '../../esl-utils/fixes/ie-fixes';

export interface ToastActionParams {
  delay?: number;
  showDelay?: number;
  hideDelay?: number;
  /** text to be shown; pass empty string or null to hide */
  text?: string;
  /** classes to add to toast element */
  cls?: string;
}

@ExportNs('ToastService')
export class ESLToastService extends ESLBaseElement {
  static is = 'esl-toast';
  static eventNs = 'esl:toast';

  static defaultConfig: ToastActionParams = {
    hideDelay: 2500
  };

  @jsonAttr<ToastActionParams>({defaultValue: ESLToastService.defaultConfig})
  public defaultParams: ToastActionParams;

  protected _toastItems: HTMLElement[] = [];

  /** Register and create global alert instance */
  public static init() {
    if (document.querySelector(ESLToastService.is)) return;
    ESLToastService.register();

    const toast = document.createElement(ESLToastService.is) as ESLToastService;
    document.body.appendChild(toast);
  }

  /** Global event handler */
  @bind
  onWindowEvent(e: CustomEvent) {
    if (e.type === `${ESLToastService.eventNs}:show`) {
      const params = Object.assign({}, e.detail, {force: true});
      this.onShow(params);
    }
    if (e.type === `${ESLToastService.eventNs}:hide`) {
      const params = Object.assign({}, {hideDelay: 0}, e.detail, {force: true});
      this.onHide(params);
    }
  }

  public onShow(params: ToastActionParams) {
    if (params.text) {
      const item = document.createElement('div');
      item.className = 'toast-item open';
      item.textContent = params.text;
      this._toastItems.push(item);

      this.appendChild(this._toastItems.pop() as HTMLElement);
      if (DeviceDetector.isIE) {
        this.appendChild(createIframe());
      }

      CSSUtil.addCls(this, params.cls);
    }
    this.onHide(params);
    return this;
  }

  public onHide(params: ToastActionParams) {
    CSSUtil.removeCls(this, params.cls);
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.bindEvents();
  }

  protected disconnectedCallback() {
    this.unbindEvents();
  }

  protected bindEvents() {
    window.addEventListener(`${ESLToastService.eventNs}:show`, this.onWindowEvent);
    window.addEventListener(`${ESLToastService.eventNs}:hide`, this.onWindowEvent);
  }

  protected unbindEvents() {
    window.removeEventListener(`${ESLToastService.eventNs}:show`, this.onWindowEvent);
    window.removeEventListener(`${ESLToastService.eventNs}:hide`, this.onWindowEvent);
  }
}
