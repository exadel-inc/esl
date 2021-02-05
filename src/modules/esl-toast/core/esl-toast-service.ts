import {ExportNs} from '../../esl-utils/environment/export-ns';
import {bind} from '../../esl-utils/decorators/bind';
import {attr, ESLBaseElement, jsonAttr} from '../../esl-base-element/core';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {DelayedTask} from '../../esl-utils/async/delayed-task';
import {defined} from '../../esl-utils/misc/object';

export interface ToastActionParams {
  delay?: number;
  showDelay?: number;
  hideDelay?: number;
  force?: boolean;
  open?: boolean
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
  static toastItems: Map<ToastActionParams, HTMLElement | undefined> = new Map();

  protected _task: DelayedTask = new DelayedTask();

  @attr({defaultValue: 'open'}) public activeClass: string;

  @jsonAttr<ToastActionParams>({defaultValue: ESLToastService.defaultConfig})
  public defaultParams: ToastActionParams;

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
      const params = Object.assign({}, e.detail, {force: true, open: true});
      this.planShowTask(Object.assign({}, this.defaultParams, params || {}));
    }
    if (e.type === `${ESLToastService.eventNs}:hide`) {
      const params = Object.assign({}, {hideDelay: 0}, e.detail, {force: true});
      this.planHideTask(Object.assign({}, this.defaultParams, params || {}));
    }
  }

  public onShow(params: ToastActionParams) {
    if (params.text) {
      const item = document.createElement('div');
      CSSUtil.addCls(item, 'toast-item open');
      item.textContent = params.text;
      ESLToastService.toastItems.set(params, item);
      // CSSUtil.addCls(this, params.cls);
      this.appendChild(item);
    }
    this.planHideTask(params);
    return this;
  }

  private planShowTask(params: ToastActionParams) {
    this._task.put(() => {
      if (!params.force && params.open) return;
      this.onShow(params);
    }, defined(params.showDelay, params.delay));
  }

  public onHide() {
    ESLToastService.toastItems.forEach((item, itemParams) => {
      if (!itemParams.open) return;
      itemParams.open = false;
      CSSUtil.removeCls(item as HTMLElement, this.activeClass);
      // todo remove from html as well
      ESLToastService.toastItems.delete(itemParams);
    });
    // CSSUtil.removeCls(this, params.cls);
  }

  private planHideTask(params: ToastActionParams) {
    this._task.put(() => {
      if (!params.force && !params.open) return;
      this.onHide();
    }, defined(params.hideDelay, params.delay));
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
