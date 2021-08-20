import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESC} from '../../esl-utils/dom/keys';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {bind} from '../../esl-utils/decorators/bind';
import {defined, copyDefinedKeys} from '../../esl-utils/misc/object';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';
import {DelayedTask} from '../../esl-utils/async/delayed-task';
import {ESLBaseElement, attr, jsonAttr, boolAttr} from '../../esl-base-element/core';

/** Default Toggleable action params type definition */
export interface ToggleableActionParams {
  /** Initiator string identifier */
  initiator?: string;
  /** Delay timeout for both show and hide actions */
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
  /** Element activator of the action */
  activator?: HTMLElement;
  /** Event that initiates the action */
  event?: Event;

  /** Custom user data */
  [key: string]: any;
}

const activators: WeakMap<ESLToggleable, HTMLElement | undefined> = new WeakMap();

/**
 * ESLToggleable component
 * @author Julia Murashko, Alexey Stsefanovich (ala'n)
 *
 * ESLToggleable - a custom element, that is used as a base for "Popup-like" components creation
 */
@ExportNs('Toggleable')
export class ESLToggleable extends ESLBaseElement {
  static is = 'esl-toggleable';
  static get observedAttributes() {
    return ['open', 'group'];
  }

  /** CSS class to add on the body element */
  @attr() public bodyClass: string;
  /** CSS class to add when the Toggleable is active */
  @attr({defaultValue: 'open'}) public activeClass: string;

  /** Toggleable group meta information to organize groups */
  @attr({name: 'group'}) public groupName: string;
  /** Selector to mark inner close triggers */
  @attr({name: 'close-on'}) public closeTrigger: string;

  /** Close the Toggleable on ESC keyboard event */
  @boolAttr() public closeOnEsc: boolean;
  /** Close the Toggleable on a click/tap outside */
  @boolAttr() public closeOnOutsideAction: boolean;

  /** Initial params to pass to show/hide action on the start */
  @jsonAttr<ToggleableActionParams>({defaultValue: {force: true, initiator: 'init'}})
  public initialParams: ToggleableActionParams;
  /** Default params to merge into passed action params */
  @jsonAttr<ToggleableActionParams>({defaultValue: {}})
  public defaultParams: ToggleableActionParams;
  /** Hover params to pass from track hover listener */
  @jsonAttr<ToggleableActionParams>({defaultValue: {}})
  public trackHoverParams: ToggleableActionParams;

  /** Marker of initially opened toggleable instance */
  public initiallyOpened: boolean;

  /** Inner state */
  private _open: boolean = false;

  /** Inner show/hide task manager instance */
  protected _task: DelayedTask = new DelayedTask();
  /** Marker for current hover listener state */
  protected _trackHover: boolean = false;

  protected connectedCallback() {
    super.connectedCallback();
    this.initiallyOpened = this.hasAttribute('open');
    this.bindEvents();
    this.setInitialState();
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindEvents();
    activators.delete(this);
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (!this.connected || newVal === oldVal) return;
    switch (attrName) {
      case 'open':
        if (this.open === this.hasAttribute('open')) return;
        this.toggle(this.open, {initiator: 'attribute', showDelay: 0, hideDelay: 0});
        break;
      case 'group':
        this.$$fire('change:group',  {
          detail: {oldGroupName: oldVal, newGroupName: newVal}
        });
        break;
    }
  }

  /** Set initial state of the Toggleable */
  protected setInitialState() {
    if (this.initialParams) {
      this.toggle(this.initiallyOpened, this.initialParams);
    }
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
  /** Bind hover events listeners for the Toggleable itself */
  protected bindHoverStateTracking(track: boolean) {
    if (!DeviceDetector.hasHover) return;
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
    return Object.assign({}, this.defaultParams, copyDefinedKeys(params));
  }

  /** Toggle the element state */
  public toggle(state: boolean = !this.open, params?: ToggleableActionParams) {
    return state ? this.show(params) : this.hide(params);
  }

  /** Change the element state to active */
  public show(params?: ToggleableActionParams) {
    params = this.mergeDefaultParams(params);
    this._task.put(this.showTask.bind(this, params), defined(params.showDelay, params.delay));
    this.bindOutsideEventTracking(this.closeOnOutsideAction);
    this.bindHoverStateTracking(!!params.trackHover);
    return this;
  }
  /** Change the element state to inactive */
  public hide(params?: ToggleableActionParams) {
    params = this.mergeDefaultParams(params);
    this._task.put(this.hideTask.bind(this, params), defined(params.hideDelay, params.delay));
    this.bindOutsideEventTracking(false);
    this.bindHoverStateTracking(!!params.trackHover);
    return this;
  }

  /** Actual show task to execute by toggleable task manger ({@link DelayedTask} out of the box) */
  protected showTask(params: ToggleableActionParams) {
    if (!params.force && this.open) return;
    if (!params.silent && !this.$$fire('before:show', {detail: {params}})) return;
    this.activator = params.activator;
    this.open = true;
    this.onShow(params);
    if (!params.silent) this.$$fire('show', {detail: {params}, cancelable: false});
  }
  /** Actual hide task to execute by toggleable task manger ({@link DelayedTask} out of the box) */
  protected hideTask(params: ToggleableActionParams) {
    if (!params.force && !this.open) return;
    if (!params.silent && !this.$$fire('before:hide', {detail: {params}})) return;
    this.open = false;
    this.onHide(params);
    if (!params.silent) this.$$fire('hide', {detail: {params}, cancelable: false});
  }

  /**
   * Actions to execute on show toggleable.
   * Inner state and 'open' attribute are not affected and updated before `onShow` execution.
   * Adds CSS classes, update a11y and fire esl:refresh event by default.
   */
  protected onShow(params: ToggleableActionParams) {
    CSSClassUtils.add(this, this.activeClass);
    CSSClassUtils.add(document.body, this.bodyClass, this);
    this.updateA11y();
    this.$$fire('esl:refresh'); // To notify other components about content change
  }

  /**
   * Actions to execute on hide toggleable.
   * Inner state and 'open' attribute are not affected and updated before `onShow` execution.
   * Removes CSS classes and update a11y by default.
   */
  protected onHide(params: ToggleableActionParams) {
    CSSClassUtils.remove(this, this.activeClass);
    CSSClassUtils.remove(document.body, this.bodyClass, this);
    this.updateA11y();
  }

  /** Active state marker */
  public get open() {
    return this._open;
  }
  public set open(value: boolean) {
    this.toggleAttribute('open', this._open = value);
  }

  /** Last component that has activated the element. Uses {@link ToggleableActionParams.activator}*/
  public get activator(): HTMLElement | null | undefined {
    return activators.get(this);
  }
  public set activator(el: HTMLElement | null | undefined) {
    el ? activators.set(this, el) : activators.delete(this);
  }

  /** Returns the element to apply a11y attributes */
  protected get $a11yTarget(): HTMLElement | undefined {
    const target = this.getAttribute('a11y-target');
    if (target === 'none') return;
    return target ? this.querySelector(target) as HTMLElement : this;
  }

  /** Called on show and on hide actions to update a11y state accordingly */
  protected updateA11y() {
    const targetEl = this.$a11yTarget;
    if (!targetEl) return;
    targetEl.setAttribute('aria-hidden', String(!this._open));
  }

  // "Private" Handlers
  @bind
  protected _onClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (this.closeTrigger && target.closest(this.closeTrigger)) {
      this.hide({initiator: 'close', activator: target, event: e});
    }
  }
  @bind
  protected _onOutsideAction(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (this.contains(target)) return;
    if (this.activator && this.activator.contains(target)) return;
    // Used 0 delay to decrease priority of the request
    this.hide({initiator: 'outsideaction', activator: target, hideDelay: 0, event: e});
  }

  @bind
  protected _onKeyboardEvent(e: KeyboardEvent) {
    if (this.closeOnEsc && e.key === ESC) {
      this.hide({initiator: 'keyboard', event: e});
    }
  }

  @bind
  protected _onMouseEnter(e: MouseEvent) {
    const baseParams = {initiator: 'mouseenter', trackHover: true, activator: this.activator, event: e};
    this.show(Object.assign(baseParams, this.trackHoverParams));
  }
  @bind
  protected _onMouseLeave(e: MouseEvent) {
    const baseParams = {initiator: 'mouseleave', trackHover: true, activator: this.activator, event: e};
    this.hide(Object.assign(baseParams, this.trackHoverParams));
  }
}

declare global {
  export interface ESLLibrary {
    Toggleable: typeof ESLToggleable;
  }
  export interface HTMLElementTagNameMap {
    'esl-toggleable': ESLToggleable;
  }
}
