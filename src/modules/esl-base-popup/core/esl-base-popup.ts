import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESC} from '../../esl-utils/dom/keycodes';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {bind} from '../../esl-utils/decorators/bind';
import {defined} from '../../esl-utils/misc/object';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';
import {DelayedTask} from '../../esl-utils/async/delayed-task';
import {ESLBaseElement, attr, jsonAttr, boolAttr} from '../../esl-base-element/core';

import {ESLBasePopupGroup} from './esl-base-popup-group';

export interface PopupActionParams {
  initiator?: string;
  delay?: number;
  showDelay?: number;
  hideDelay?: number;
  force?: boolean;
  silent?: boolean;
  trackHover?: boolean;
  trigger?: HTMLElement;
  previousPopup?: ESLBasePopup;
  nextPopup?: ESLBasePopup;
}

@ExportNs('BasePopup')
export class ESLBasePopup extends ESLBaseElement {
  static get observedAttributes() {
    return ['open', 'group'];
  }

  protected _open: boolean = false;
  protected _trackHover: boolean = false;
  protected _task: DelayedTask = new DelayedTask();

  @boolAttr() public open: boolean;

  @attr() public bodyClass: string;
  @attr() public activeClass: string;

  @attr({name: 'group'}) public groupName: string;
  @attr({name: 'close-on'}) public closeTrigger: string;

  @boolAttr() public closeOnEsc: boolean;
  @boolAttr() public closeOnBodyClick: boolean;

  @jsonAttr<PopupActionParams>({defaultValue: {silent: true, force: true, initiator: 'init'}})
  public initialParams: PopupActionParams;
  @jsonAttr<PopupActionParams>({defaultValue: {}})
  public defaultParams: PopupActionParams;

  public get group() {
    return ESLBasePopupGroup.find(this.groupName);
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (!this.connected || newVal === oldVal) return;
    switch (attrName) {
      case 'open':
        this.toggle(this.open, Object.assign({initiator: 'attribute'}, this.defaultParams));
        break;
      case 'group':
        oldVal && ESLBasePopupGroup.unregister(this, oldVal);
        newVal && ESLBasePopupGroup.register(this, newVal);
        break;
    }
  }

  protected connectedCallback() {
    super.connectedCallback();
    ESLBasePopupGroup.register(this, this.groupName);
    this.bindEvents();
    this.setInitialState();
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    ESLBasePopupGroup.unregister(this);
    this.unbindEvents();
  }

  protected setInitialState() {
    if (!this.initialParams) return;
    this.toggle(this.open, this.initialParams);
  }

  protected bindEvents() {
    this.addEventListener('click', this._onClick);
    this.addEventListener('keydown', this._onKeyboardEvent);
  }

  protected unbindEvents() {
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('keydown', this._onKeyboardEvent);
    this.bindBodyClickTracking(false);
    this.bindHoverStateTracking(false);
  }

  protected bindBodyClickTracking(track: boolean) {
    document.body.removeEventListener('click', this._onBodyClick);
    if (track) {
      document.body.addEventListener('click', this._onBodyClick, true);
    }
  }
  protected bindHoverStateTracking(track: boolean) {
    if (DeviceDetector.isTouchDevice) return;
    if (this._trackHover === track) return;
    this._trackHover = track;

    this.removeEventListener('mouseenter', this._onMouseEnter);
    this.removeEventListener('mouseleave', this._onMouseLeave);
    if (this._trackHover) {
      this.addEventListener('mouseenter', this._onMouseEnter);
      this.addEventListener('mouseleave', this._onMouseLeave);
    }
  }

  protected mergeDefaultParams(params?: PopupActionParams): PopupActionParams {
    return Object.assign({}, this.defaultParams, params || {});
  }

  /**
   * Toggle popup state
   */
  public toggle(state: boolean = !this.open, params?: PopupActionParams) {
    return state ? this.show(params) : this.hide(params);
  }

  /**
   * Changes popup state to active
   */
  public show(params?: PopupActionParams) {
    params = this.mergeDefaultParams(params);
    this.group.activate(this, params);
    this.planShowTask(params);
    this.bindBodyClickTracking(this.closeOnBodyClick);
    this.bindHoverStateTracking(!!params.trackHover);
    return this;
  }
  private planShowTask(params: PopupActionParams) {
    this._task.put(() => {
      if (!params.force && this._open) return;
      if (!params.silent) this.fireBeforeStateChange();
      this.onShow(params);
      if (!params.silent) this.fireStateChange();
    }, defined(params.showDelay, params.delay));
  }

  /**
   * Changes popup state to inactive
   */
  public hide(params?: PopupActionParams) {
    params = this.mergeDefaultParams(params);
    this.planHideTask(params);
    this.bindBodyClickTracking(false);
    this.bindHoverStateTracking(!!params.trackHover);
    return this;
  }
  private planHideTask(params: PopupActionParams) {
    this._task.put(() => {
      if (!params.force && !this._open) return;
      if (!params.silent) this.fireBeforeStateChange();
      this.onHide(params);
      if (!params.silent) this.fireStateChange();
    }, defined(params.hideDelay, params.delay));
  }

  /**
   * Returns element to apply a11y attributes
   */
  protected get a11yTarget() {
    const target = this.getAttribute('a11y-target');
    if (target === 'none') return;
    return target ? this.querySelector(target) : this;
  }

  /**
   * Called on show and on hide actions to update a11y state accordingly
   */
  protected updateA11y() {
    const targetEl = this.a11yTarget;
    if (!targetEl) return;
    targetEl.setAttribute('aria-hidden', String(!this._open));
  }

  /**
   * Action to show popup
   */
  protected onShow(params: PopupActionParams) {
    this.open = this._open = true;
    CSSUtil.addCls(this, this.activeClass);
    CSSUtil.addCls(document.body, this.bodyClass);
    this.updateA11y();
  }

  /**
   * Action to hide popup
   */
  protected onHide(params: PopupActionParams) {
    this.open = this._open = false;
    CSSUtil.removeCls(this, this.activeClass);
    CSSUtil.removeCls(document.body, this.bodyClass);
    this.updateA11y();
  }

  /**
   * Fires before component state change event
   */
  protected fireBeforeStateChange() {
    this.$$fireNs('beforestatechange', {
      detail: {open: this._open}
    });
  }

  /**
   * Fires component state change event
   */
  protected fireStateChange() {
    this.$$fireNs('statechange', {
      detail: {open: this._open}
    });
    this.$$fire('esl:refresh');
  }

  // "Private" Handlers
  @bind
  protected _onClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (this.closeTrigger && target.closest(this.closeTrigger)) {
      this.hide({initiator: 'close', trigger: target});
    }
  }
  @bind
  protected _onBodyClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!this.contains(target)) {
      this.hide({initiator: 'bodyclick', trigger: target});
    }
  }

  @bind
  protected _onKeyboardEvent(e: KeyboardEvent) {
    if (this.closeOnEsc && e.which === ESC) {
      this.hide({initiator: 'keyboard'});
    }
  }

  @bind
  protected _onMouseEnter() {
    this.show({initiator: 'mouseenter', trackHover: true});
  }
  @bind
  protected _onMouseLeave() {
    this.hide({initiator: 'mouseleave', trackHover: true});
  }
}
