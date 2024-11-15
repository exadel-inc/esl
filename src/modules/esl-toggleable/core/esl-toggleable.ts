import {ExportNs} from '../../esl-utils/environment/export-ns';
import {SYSTEM_KEYS, ESC, TAB} from '../../esl-utils/dom/keys';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {prop, attr, jsonAttr, listen} from '../../esl-utils/decorators';
import {defined, copyDefinedKeys} from '../../esl-utils/misc/object';
import {parseBoolean, toBooleanAttribute} from '../../esl-utils/misc/format';
import {sequentialUID} from '../../esl-utils/misc/uid';
import {hasHover} from '../../esl-utils/environment/device-detector';
import {DelayedTask} from '../../esl-utils/async/delayed-task';
import {afterNextRender} from '../../esl-utils/async/raf';
import {ESLBaseElement} from '../../esl-base-element/core';
import {findParent, isMatches} from '../../esl-utils/dom/traversing';
import {getKeyboardFocusableElements, handleFocusFlow} from '../../esl-utils/dom/focus';

import type {FocusFlowType} from '../../esl-utils/dom/focus';
import type {DelegatedEvent} from '../../esl-event-listener/core/types';

/** Default Toggleable action params type definition */
export interface ESLToggleableActionParams {
  /** Action to execute */
  readonly action?: 'show' | 'hide';
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

export interface ESLToggleableRequestDetails extends ESLToggleableActionParams {
  // Selector to match or exact predicate to check if the target should process request
  match?: string | ((target: Element) => boolean);
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
  public static override is = 'esl-toggleable';
  public static observedAttributes = ['open', 'group'];

  /** Default show/hide params for all ESLToggleable instances */
  public static DEFAULT_PARAMS: ESLToggleableActionParams = {};

  /** Event to dispatch when toggleable is going to be activated */
  @prop('esl:before:show') public BEFORE_SHOW_EVENT: string;
  /** Event to dispatch when toggleable is going to be deactivated */
  @prop('esl:before:hide') public BEFORE_HIDE_EVENT: string;

  /** Event to dispatch when toggleable is activated */
  @prop('esl:show') public SHOW_EVENT: string;
  /** Event to dispatch when toggleable is deactivated */
  @prop('esl:hide') public HIDE_EVENT: string;

  /** Event to dispatch when toggleable has end activation process */
  @prop('esl:after:show') public AFTER_SHOW_EVENT: string;
  /** Event to dispatch when toggleable has end deactivation process */
  @prop('esl:after:hide') public AFTER_HIDE_EVENT: string;

  /** Event to activate toggleables on event way */
  @prop('esl:show:request') public SHOW_REQUEST_EVENT: string;
  /** Event to deactivate toggleables on event way */
  @prop('esl:hide:request') public HIDE_REQUEST_EVENT: string;

  /** Event to dispatch when toggleable group has changed */
  @prop('esl:change:group') public GROUP_CHANGED_EVENT: string;

  /**
   * CSS class (supports {@link CSSClassUtils}) to add on the body element
   * */
  @attr() public bodyClass: string;
  /** CSS class (supports {@link CSSClassUtils}) to add when the Toggleable is active */
  @attr({defaultValue: 'open'}) public activeClass: string;

  /**
   * CSS class (supports {@link CSSClassUtils}) to add/remove on the container
   * defined by {@link containerActiveClassTarget}
   */
  @attr() public containerActiveClass: string;
  /**
   * Selector for the closest parent element to add/remove {@link containerActiveClass}
   * (default: `*` direct parent)
   */
  @attr({defaultValue: '*'}) public containerActiveClassTarget: string;

  /** Toggleable group meta information to organize groups */
  @attr({name: 'group'}) public groupName: string;
  /** Selector to mark inner close triggers */
  @attr({name: 'close-on'}) public closeTrigger: string;

  /** Disallow automatic id creation when it's empty */
  @attr({parser: parseBoolean, serializer: toBooleanAttribute}) public noAutoId: boolean;
  /** Close the Toggleable on ESC keyboard event */
  @attr({parser: parseBoolean, serializer: toBooleanAttribute}) public closeOnEsc: boolean;
  /** Close the Toggleable on a click/tap outside */
  @attr({parser: parseBoolean, serializer: toBooleanAttribute}) public closeOnOutsideAction: boolean;

  /**
   * Focus behavior. Available values:
   * - 'none' - no focus management
   * - 'grab' - focus on the first focusable element
   * - 'chain' - focus on the first focusable element first and return focus to the activator after the last focusable element
   * - 'loop' - focus on the first focusable element and loop through the focusable elements
   */
  @attr({defaultValue: 'none'}) public focusBehavior: FocusFlowType;

  /** Initial params to pass to show/hide action on the start */
  @jsonAttr<ESLToggleableActionParams>({defaultValue: {force: true, initiator: 'init'}})
  public initialParams: ESLToggleableActionParams;
  /** Default params to merge into passed action params */
  @jsonAttr<ESLToggleableActionParams>({defaultValue: {}})
  public defaultParams: ESLToggleableActionParams;
  /** Hover params to pass from track hover listener */
  @jsonAttr<ESLToggleableActionParams>({defaultValue: {}})
  public trackHoverParams: ESLToggleableActionParams;

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

  protected override connectedCallback(): void {
    super.connectedCallback();
    if (!this.id && !this.noAutoId) {
      this.id = sequentialUID(this.baseTagName, this.baseTagName + '-');
    }
    this.initiallyOpened = this.hasAttribute('open');
    this.setInitialState();
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    activators.delete(this);
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || newVal === oldVal) return;
    switch (attrName) {
      case 'open': {
        const isOpen = this.hasAttribute('open');
        if (this.open === isOpen) return;
        this.toggle(isOpen, {initiator: 'attribute', showDelay: 0, hideDelay: 0});
        break;
      }
      case 'group':
        this.$$fire(this.GROUP_CHANGED_EVENT, {
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

  /** Bind outside action event listeners */
  protected bindOutsideEventTracking(track: boolean): void {
    track ? this.$$on(this._onOutsideAction) : this.$$off(this._onOutsideAction);
  }
  /** Bind hover events listeners for the Toggleable itself */
  protected bindHoverStateTracking(track: boolean, hideDelay?: number | string): void {
    if (!hasHover) return;
    this._trackHoverDelay = track && hideDelay !== undefined ? +hideDelay : undefined;
    if (this._trackHover === track) return;
    this._trackHover = track;

    track ? this.$$on(this._onMouseEnter) : this.$$off(this._onMouseEnter);
    track ? this.$$on(this._onMouseLeave) : this.$$off(this._onMouseLeave);
  }

  /** Focuses on the first focusable element or the element itself if it's focusable */
  public override focus(options?: FocusOptions): void {
    if (this.hasAttribute('tabindex')) {
      super.focus(options);
    } else {
      const focusable = this.$focusables[0];
      focusable && focusable.focus(options);
    }
  }

  /**
   * Delegates focus to the last activator (or moves it out if there is no activator)
   * if the focused element is inside the Toggleable.
   * @param deep - if true, the inner focused element will be handled as well
   */
  public override blur(deep = false): void {
    if (!this.hasFocus) return;
    if (this.activator) {
      this.activator.focus();
    } else if (deep) {
      (document.activeElement! as HTMLElement).blur();
    } else {
      super.blur();
    }
  }

  /** Function to merge the result action params */
  protected mergeDefaultParams(params?: ESLToggleableActionParams): ESLToggleableActionParams {
    const type = this.constructor as typeof ESLToggleable;
    return Object.assign({}, type.DEFAULT_PARAMS, this.defaultParams, copyDefinedKeys(params));
  }

  /** Toggle the element state */
  public toggle(state: boolean = !this.open, params?: ESLToggleableActionParams): ESLToggleable {
    return state ? this.show(params) : this.hide(params);
  }

  /** Change the element state to active */
  public show(params?: ESLToggleableActionParams): ESLToggleable {
    params = this.mergeDefaultParams(params);
    this._task.put(this.showTask.bind(this, params), defined(params.showDelay, params.delay));
    this.bindOutsideEventTracking(this.closeOnOutsideAction);
    this.bindHoverStateTracking(!!params.trackHover, defined(params.hideDelay, params.delay));
    return this;
  }
  /** Change the element state to inactive */
  public hide(params?: ESLToggleableActionParams): ESLToggleable {
    params = this.mergeDefaultParams(params);
    this._task.put(this.hideTask.bind(this, params), defined(params.hideDelay, params.delay));
    this.bindOutsideEventTracking(false);
    this.bindHoverStateTracking(!!params.trackHover, defined(params.hideDelay, params.delay));
    return this;
  }

  /** Actual show task to execute by toggleable task manger ({@link DelayedTask} out of the box) */
  protected showTask(params: ESLToggleableActionParams): void {
    Object.defineProperty(params, 'action', {value: 'show', writable: false});
    if (!this.shouldShow(params)) return;
    if (!params.silent && !this.$$fire(this.BEFORE_SHOW_EVENT, {detail: {params}})) return;
    this.activator = params.activator;
    this.onShow(params);
    if (!params.silent) this.$$fire(this.SHOW_EVENT, {detail: {params}, cancelable: false});
  }
  /** Actual hide task to execute by toggleable task manger ({@link DelayedTask} out of the box) */
  protected hideTask(params: ESLToggleableActionParams): void {
    Object.defineProperty(params, 'action', {value: 'hide', writable: false});
    if (!this.shouldHide(params)) return;
    if (!params.silent && !this.$$fire(this.BEFORE_HIDE_EVENT, {detail: {params}})) return;
    this.onHide(params);
    this.bindOutsideEventTracking(false);
    if (!params.silent) this.$$fire(this.HIDE_EVENT, {detail: {params}, cancelable: false});
  }

  /**
   * Actions to execute before showing of toggleable.
   * Returns false if the show action should not be executed.
   */
  protected shouldShow(params: ESLToggleableActionParams): boolean {
    return params.force || !this.open;
  }

  /**
   * Actions to execute on show toggleable.
   * Inner state and 'open' attribute are not affected and updated before `onShow` execution.
   * Adds CSS classes, update a11y and fire {@link ESLBaseElement.REFRESH_EVENT} event by default.
   */
  protected onShow(params: ESLToggleableActionParams): void {
    this.open = true;
    CSSClassUtils.add(this, this.activeClass);
    CSSClassUtils.add(document.body, this.bodyClass, this);
    if (this.containerActiveClass) {
      const $container = findParent(this, this.containerActiveClassTarget);
      $container && CSSClassUtils.add($container, this.containerActiveClass, this);
    }

    this.updateA11y();
    this.$$fire(this.REFRESH_EVENT); // To notify other components about content change

    // Focus on the first focusable element
    if (this.focusBehavior !== 'none') {
      queueMicrotask(() => afterNextRender(() => this.focus({preventScroll: true})));
    }
  }

  /**
   * Actions to execute before hiding of toggleable.
   * Returns false if the hide action should not be executed.
   */
  protected shouldHide(params: ESLToggleableActionParams): boolean {
    return params.force || this.open;
  }

  /**
   * Actions to execute on hide toggleable.
   * Inner state and 'open' attribute are not affected and updated before `onShow` execution.
   * Removes CSS classes and update a11y by default.
   */
  protected onHide(params: ESLToggleableActionParams): void {
    this.open = false;
    CSSClassUtils.remove(this, this.activeClass);
    CSSClassUtils.remove(document.body, this.bodyClass, this);
    if (this.containerActiveClass) {
      const $container = findParent(this, this.containerActiveClassTarget);
      $container && CSSClassUtils.remove($container, this.containerActiveClass, this);
    }
    this.updateA11y();

    // Blur if the toggleable has focus
    queueMicrotask(() => afterNextRender(() => this.blur(true)));
  }

  /** Active state marker */
  public get open(): boolean {
    return this._open;
  }
  public set open(value: boolean) {
    this.toggleAttribute('open', this._open = value);
  }

  /** Last component that has activated the element. Uses {@link ESLToggleableActionParams.activator}*/
  public get activator(): HTMLElement | null | undefined {
    return activators.get(this);
  }
  public set activator(el: HTMLElement | null | undefined) {
    el ? activators.set(this, el) : activators.delete(this);
  }

  /** If the togleable or its content has focus */
  public get hasFocus(): boolean {
    return this === document.activeElement || this.contains(document.activeElement);
  }

  /** List of all focusable elements inside instance */
  public get $focusables(): HTMLElement[] {
    return getKeyboardFocusableElements(this) as HTMLElement[];
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

  @listen({event: 'click', selector: (el: ESLToggleable) => el.closeTrigger || ''})
  protected _onCloseClick(e: DelegatedEvent<MouseEvent>): void {
    this.hide({
      initiator: 'close',
      activator: e.$delegate as HTMLElement,
      event: e
    });
  }

  @listen({
    auto: false,
    event: 'keydown mouseup touchend',
    target: document,
    capture: true
  })
  protected _onOutsideAction(e: Event): void {
    if (!this.isOutsideAction(e)) return;
    // Used 0 delay to decrease priority of the request
    this.hide({initiator: 'outsideaction', hideDelay: 0, event: e});
  }

  @listen('keydown')
  protected _onKeyboardEvent(e: KeyboardEvent): void {
    if (this.closeOnEsc && e.key === ESC) {
      this.hide({initiator: 'keyboard', event: e});
      e.stopPropagation();
    }
    if (this.focusBehavior !== 'none' && e.key === TAB && this.open) {
      handleFocusFlow(e, this.$focusables, this.activator || this, this.focusBehavior);
    }
  }

  @listen('focusout')
  protected _onFocusOut(e: FocusEvent): void {
    if (!this.open) return;
    afterNextRender(() => {
      if (this.hasFocus) return;
      if (this.focusBehavior === 'chain') {
        this.hide({initiator: 'focusout', event: e});
      }
      if (this.focusBehavior === 'loop') {
        this.focus({preventScroll: true});
      }
    });
  }

  @listen({auto: false, event: 'mouseenter'})
  protected _onMouseEnter(e: MouseEvent): void {
    const baseParams: ESLToggleableActionParams = {
      initiator: 'mouseenter',
      trackHover: true,
      activator: this.activator,
      event: e,
      hideDelay: this._trackHoverDelay
    };
    this.show(Object.assign(baseParams, this.trackHoverParams));
  }
  @listen({auto: false, event: 'mouseleave'})
  protected _onMouseLeave(e: MouseEvent): void {
    const baseParams: ESLToggleableActionParams = {
      initiator: 'mouseleave',
      trackHover: true,
      activator: this.activator,
      event: e,
      hideDelay: this._trackHoverDelay
    };
    this.hide(Object.assign(baseParams, this.trackHoverParams));
  }

  /** Prepares toggle request events param */
  protected buildRequestParams(e: CustomEvent<ESLToggleableRequestDetails>): ESLToggleableActionParams | null {
    const detail = e.detail || {};
    if (!isMatches(this, detail.match)) return null;
    return Object.assign({}, detail, {event: e});
  }

  /** Actions to execute on show request */
  @listen((el: ESLToggleable) => el.SHOW_REQUEST_EVENT)
  protected _onShowRequest(e: CustomEvent<ESLToggleableRequestDetails>): void {
    const params = this.buildRequestParams(e);
    params && this.show(params);
  }
  /** Actions to execute on hide request */
  @listen((el: ESLToggleable) => el.HIDE_REQUEST_EVENT)
  protected _onHideRequest(e: CustomEvent<ESLToggleableRequestDetails>): void {
    const params = this.buildRequestParams(e);
    params && this.hide(params);
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
