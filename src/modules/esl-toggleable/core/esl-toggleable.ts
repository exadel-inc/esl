import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESC, SYSTEM_KEYS} from '../../esl-utils/dom/keys';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {bind} from '../../esl-utils/decorators/bind';
import {defined, copyDefinedKeys} from '../../esl-utils/misc/object';
import {sequentialUID} from '../../esl-utils/misc/uid';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';
import {DelayedTask} from '../../esl-utils/async/delayed-task';
import {ESLBaseElement, attr, jsonAttr, boolAttr} from '../../esl-base-element/core';
import {isMatches} from '../../esl-utils/dom/traversing';

export interface ESLShowRequestDetails {
  // Selector to ignore or exact predicate to check if the target should process request
  ignore?: string | ((target: Element) => boolean);
  // Delay to show targets
  delay?: number;
  // Custom params to pass
  params?: Record<string, ToggleableActionParams>;
}

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
  activator?: HTMLElement | null;
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
  public static is = 'esl-toggleable';
  public static observedAttributes = ['open', 'group'];

  /** CSS class to add on the body element */
  @attr() public bodyClass: string;
  /** CSS class to add when the Toggleable is active */
  @attr({defaultValue: 'open'}) public activeClass: string;

  /** Toggleable group meta information to organize groups */
  @attr({name: 'group'}) public groupName: string;
  /** Selector to mark inner close triggers */
  @attr({name: 'close-on'}) public closeTrigger: string;

  /** Disallow automatic id creation when it's empty */
  @boolAttr() public noAutoId: boolean;
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
  /** Delay for track hover listeners actions */
  protected _trackHoverDelay: number | undefined;

  protected connectedCallback(): void {
    super.connectedCallback();
    if (!this.id && !this.noAutoId) {
      const tag = (this.constructor as typeof ESLToggleable).is;
      this.id = sequentialUID(tag, tag + '-');
    }
    this.initiallyOpened = this.hasAttribute('open');
    this.bindEvents();
    this.setInitialState();
  }

  protected disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unbindEvents();
    activators.delete(this);
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || newVal === oldVal) return;
    switch (attrName) {
      case 'open':
        if (this.open === this.hasAttribute('open')) return;
        this.toggle(this.open, {initiator: 'attribute', showDelay: 0, hideDelay: 0});
        break;
      case 'group':
        this.$$fire('esl:change:group',  {
          detail: {oldGroupName: oldVal, newGroupName: newVal}
        });
        break;
    }
  }

  /** Set initial state of the Toggleable */
  protected setInitialState(): void {
    if (this.initialParams) {
      this.toggle(this.initiallyOpened, this.initialParams);
    }
  }

  protected bindEvents(): void {
    this.addEventListener('click', this._onClick);
    this.addEventListener('keydown', this._onKeyboardEvent);
    this.addEventListener('esl:show:request', this._onShowRequest);
  }

  protected unbindEvents(): void {
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('keydown', this._onKeyboardEvent);
    this.removeEventListener('esl:show:request', this._onShowRequest);
    this.bindOutsideEventTracking(false);
    this.bindHoverStateTracking(false);
  }

  /** Bind outside action event listeners */
  protected bindOutsideEventTracking(track: boolean): void {
    document.body.removeEventListener('keydown', this._onOutsideAction, true);
    document.body.removeEventListener('mouseup', this._onOutsideAction, true);
    document.body.removeEventListener('touchend', this._onOutsideAction, true);
    if (track) {
      document.body.addEventListener('keydown', this._onOutsideAction, true);
      document.body.addEventListener('mouseup', this._onOutsideAction, true);
      document.body.addEventListener('touchend', this._onOutsideAction, true);
    }
  }
  /** Bind hover events listeners for the Toggleable itself */
  protected bindHoverStateTracking(track: boolean, hideDelay?: number | string): void {
    if (!DeviceDetector.hasHover) return;
    this._trackHoverDelay = track && hideDelay !== undefined ? +hideDelay : undefined;
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
  public toggle(state: boolean = !this.open, params?: ToggleableActionParams): ESLToggleable {
    return state ? this.show(params) : this.hide(params);
  }

  /** Change the element state to active */
  public show(params?: ToggleableActionParams): ESLToggleable {
    params = this.mergeDefaultParams(params);
    this._task.put(this.showTask.bind(this, params), defined(params.showDelay, params.delay));
    this.bindOutsideEventTracking(this.closeOnOutsideAction);
    this.bindHoverStateTracking(!!params.trackHover, defined(params.hideDelay, params.delay));
    return this;
  }
  /** Change the element state to inactive */
  public hide(params?: ToggleableActionParams): ESLToggleable {
    params = this.mergeDefaultParams(params);
    this._task.put(this.hideTask.bind(this, params), defined(params.hideDelay, params.delay));
    this.bindOutsideEventTracking(false);
    this.bindHoverStateTracking(!!params.trackHover, defined(params.hideDelay, params.delay));
    return this;
  }

  /** Actual show task to execute by toggleable task manger ({@link DelayedTask} out of the box) */
  protected showTask(params: ToggleableActionParams): void {
    if (!params.force && this.open) return;
    if (!params.silent && !this.$$fire('esl:before:show', {detail: {params}})) return;
    this.activator = params.activator;
    this.open = true;
    this.onShow(params);
    if (!params.silent) this.$$fire('esl:show', {detail: {params}, cancelable: false});
  }
  /** Actual hide task to execute by toggleable task manger ({@link DelayedTask} out of the box) */
  protected hideTask(params: ToggleableActionParams): void {
    if (!params.force && !this.open) return;
    if (!params.silent && !this.$$fire('esl:before:hide', {detail: {params}})) return;
    this.open = false;
    this.onHide(params);
    this.bindOutsideEventTracking(false);
    if (!params.silent) this.$$fire('esl:hide', {detail: {params}, cancelable: false});
  }

  /**
   * Actions to execute on show toggleable.
   * Inner state and 'open' attribute are not affected and updated before `onShow` execution.
   * Adds CSS classes, update a11y and fire esl:refresh event by default.
   */
  protected onShow(params: ToggleableActionParams): void {
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
  protected onHide(params: ToggleableActionParams): void {
    CSSClassUtils.remove(this, this.activeClass);
    CSSClassUtils.remove(document.body, this.bodyClass, this);
    this.updateA11y();
  }

  /** Active state marker */
  public get open(): boolean {
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
  protected get $a11yTarget(): HTMLElement | null {
    const target = this.getAttribute('a11y-target');
    if (target === 'none') return null;
    return target ? this.querySelector(target) : this;
  }

  /** Called on show and on hide actions to update a11y state accordingly */
  protected updateA11y(): void {
    const targetEl = this.$a11yTarget;
    if (!targetEl) return;
    targetEl.setAttribute('aria-hidden', String(!this._open));
  }

  /** @returns if the passed event should trigger hide action */
  public isOutsideAction(e: Event): boolean {
    const target = e.target as HTMLElement;
    // target is inside current toggleable
    if (this.contains(target)) return false;
    // target is inside last activator
    if (this.activator && this.activator.contains(target)) return false;
    // Event is not a system command key
    return !(e instanceof KeyboardEvent && SYSTEM_KEYS.includes(e.key));
  }

  @bind
  protected _onClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (this.closeTrigger && target.closest(this.closeTrigger)) {
      this.hide({initiator: 'close', activator: target, event: e});
    }
  }

  @bind
  protected _onOutsideAction(e: Event): void {
    if (!this.isOutsideAction(e)) return;
    // Used 0 delay to decrease priority of the request
    this.hide({initiator: 'outsideaction', hideDelay: 0, event: e});
  }

  @bind
  protected _onKeyboardEvent(e: KeyboardEvent): void {
    if (this.closeOnEsc && e.key === ESC) {
      this.hide({initiator: 'keyboard', event: e});
    }
  }

  @bind
  protected _onMouseEnter(e: MouseEvent): void {
    const hideDelay = this._trackHoverDelay;
    const baseParams: ToggleableActionParams = {initiator: 'mouseenter', trackHover: true, activator: this.activator, event: e, hideDelay};
    this.show(Object.assign(baseParams, this.trackHoverParams));
  }
  @bind
  protected _onMouseLeave(e: MouseEvent): void {
    const hideDelay = this._trackHoverDelay;
    const baseParams: ToggleableActionParams = {initiator: 'mouseleave', trackHover: true, activator: this.activator, event: e, hideDelay};
    this.hide(Object.assign(baseParams, this.trackHoverParams));
  }

  /** Actions to execute on show request */
  @bind
  protected _onShowRequest(e: CustomEvent<ESLShowRequestDetails>): void {
    const detail = e.detail;
    if (isMatches(this, detail?.ignore)) return;
    const params = {event: e};
    if (detail && typeof detail.delay === 'number') Object.assign(params, {showDelay: detail.delay});
    if (detail && typeof detail.params === 'object') Object.assign(params, detail.params || {});
    this.show(params);
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
