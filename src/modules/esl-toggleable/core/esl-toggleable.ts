import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESC} from '../../esl-utils/dom/keys';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {bind} from '../../esl-utils/decorators/bind';
import {defined} from '../../esl-utils/misc/object';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';
import {DelayedTask} from '../../esl-utils/async/delayed-task';
import {ESLBaseElement, attr, jsonAttr, boolAttr} from '../../esl-base-element/core';

/** Default Toggleable action params type definition */
export interface ToggleableActionParams {
  /** Initiator string identifier */
  initiator?: string;
  /** Delay timeout for both: show and hide actions */
  delay?: number;
  /** Show delay timeout */
  showDelay?: number;
  /** Hide delay timeout */
  hideDelay?: number;
  /** Force action independently of current state of the Toggleable */
  force?: boolean;
  /** Do not throw events on action */
  silent?: boolean;
  /** Activate hover tracking to hide Toggleable */
  trackHover?: boolean;
  /** Element activator of action */
  activator?: HTMLElement;
  /** Event that initiate the action */
  event?: Event;
}

const activators: WeakMap<ESLToggleable, HTMLElement | undefined> = new WeakMap();

/**
 * ESLToggleable component
 * @author Julia Murashko, Alexey Stsefanovich (ala'n)
 *
 * ESLToggleable - is a custom element, that is used as a base for "Popup like" components creation
 */
@ExportNs('Toggleable')
export class ESLToggleable extends ESLBaseElement {
  static get observedAttributes() {
    return ['open', 'group'];
  }

  protected _open: boolean = false;
  protected _trackHover: boolean = false;
  protected _task: DelayedTask = new DelayedTask();

  /** Active state marker */
  @boolAttr() public open: boolean;

  /** CSS class to add on the body element */
  @attr() public bodyClass: string;
  /** CSS class to add when Toggleable is active */
  @attr() public activeClass: string;

  /** Toggleable group meta information to organize groups */
  @attr({name: 'group'}) public groupName: string;
  /** Selector to mark inside close triggers */
  @attr({name: 'close-on'}) public closeTrigger: string;

  /** Close Toggleable on ESC keyboard event */
  @boolAttr() public closeOnEsc: boolean;
  /** Close Toggleable on a click/tap outside toggleable */
  @boolAttr() public closeOnOutsideAction: boolean;

  /** Initial params to pass to show/hide action on the start */
  @jsonAttr<ToggleableActionParams>({defaultValue: {force: true, initiator: 'init'}})
  public initialParams: ToggleableActionParams;
  /** Default params to merge into passed action params */
  @jsonAttr<ToggleableActionParams>({defaultValue: {}})
  public defaultParams: ToggleableActionParams;

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (!this.connected || newVal === oldVal) return;
    switch (attrName) {
      case 'open':
        this.toggle(this.open, Object.assign({initiator: 'attribute'}, this.defaultParams));
        break;
      case 'group':
        this.$$fire('change:group',  {
          detail: {oldGroupName: oldVal, newGroupName: newVal}
        });
        break;
    }
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.bindEvents();
    this.setInitialState();
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindEvents();
    activators.delete(this);
  }

  /** Set initial state of Toggleable */
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
    this.bindOutsideEventTracking(false);
    this.bindHoverStateTracking(false);
  }

  /** Bind outside action event listeners */
  protected bindOutsideEventTracking(track: boolean) {
    document.body.removeEventListener('mouseup', this._onOutsideAction);
    document.body.removeEventListener('touchend', this._onOutsideAction);
    if (track) {
      document.body.addEventListener('mouseup', this._onOutsideAction, true);
      document.body.addEventListener('touchend', this._onOutsideAction, true);
    }
  }
  /** Bind hover events listeners for Toggleable itself */
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

  /** Function to merge the result action params */
  protected mergeDefaultParams(params?: ToggleableActionParams): ToggleableActionParams {
    return Object.assign({}, this.defaultParams, params || {});
  }

  /** Toggle element state */
  public toggle(state: boolean = !this.open, params?: ToggleableActionParams) {
    return state ? this.show(params) : this.hide(params);
  }

  /** Change element state to active */
  public show(params?: ToggleableActionParams) {
    params = this.mergeDefaultParams(params);
    this.planShowTask(params);
    this.bindOutsideEventTracking(this.closeOnOutsideAction);
    this.bindHoverStateTracking(!!params.trackHover);
    return this;
  }
  private planShowTask(params: ToggleableActionParams) {
    this._task.put(() => {
      if (!params.force && this._open) return;
      if (!params.silent && !this.$$fire('before:show', {detail: {params}})) return;
      this.onShow(params);
      if (!params.silent && !this.$$fire('show', {detail: {params}})) return;
    }, defined(params.showDelay, params.delay));
  }

  /** Change element state to inactive */
  public hide(params?: ToggleableActionParams) {
    params = this.mergeDefaultParams(params);
    this.planHideTask(params);
    this.bindOutsideEventTracking(false);
    this.bindHoverStateTracking(!!params.trackHover);
    return this;
  }
  private planHideTask(params: ToggleableActionParams) {
    this._task.put(() => {
      if (!params.force && !this._open) return;
      if (!params.silent && !this.$$fire('before:hide',{detail: {params}})) return;
      this.onHide(params);
      if (!params.silent && !this.$$fire('hide', {detail: {params}})) return;
    }, defined(params.hideDelay, params.delay));
  }

  /** Last component that activate element. Uses {@link ToggleableActionParams.activator}*/
  public get activator() {
    return activators.get(this);
  }

  /** Returns element to apply a11y attributes */
  protected get $a11yTarget() {
    const target = this.getAttribute('a11y-target');
    if (target === 'none') return;
    return target ? this.querySelector(target) : this;
  }

  /** Called on show and on hide actions to update a11y state accordingly */
  protected updateA11y() {
    const targetEl = this.$a11yTarget;
    if (!targetEl) return;
    targetEl.setAttribute('aria-hidden', String(!this._open));
  }

  /** Action to show element */
  protected onShow(params: ToggleableActionParams) {
    activators.set(this, params.activator);
    this.open = this._open = true;
    CSSUtil.addCls(this, this.activeClass);
    CSSUtil.addCls(document.body, this.bodyClass);
    this.updateA11y();
    this.$$fire('esl:refresh');
  }

  /** Action to hide element */
  protected onHide(params: ToggleableActionParams) {
    activators.delete(this);
    this.open = this._open = false;
    CSSUtil.removeCls(this, this.activeClass);
    CSSUtil.removeCls(document.body, this.bodyClass);
    this.updateA11y();
  }

  // "Private" Handlers
  @bind
  protected _onClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (this.closeTrigger && target.closest(this.closeTrigger)) {
      this.hide({initiator: 'close', activator: target});
    }
  }
  @bind
  protected _onOutsideAction(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (this.contains(target)) return;
    if (this.activator && this.activator.contains(target)) return;
    this.hide({initiator: 'outsideaction', activator: target});
  }

  @bind
  protected _onKeyboardEvent(e: KeyboardEvent) {
    if (this.closeOnEsc && e.key === ESC) {
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
