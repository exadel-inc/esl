import {ESLBaseElement} from '../../esl-base-element/core';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';
import {isElement} from '../../esl-utils/dom/api';
import {setAttr} from '../../esl-utils/dom/attr';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {ENTER, SPACE, ESC} from '../../esl-utils/dom/keys';
import {attr, boolAttr, prop, listen, ready} from '../../esl-utils/decorators';
import {parseBoolean, parseNumber, toBooleanAttribute} from '../../esl-utils/misc/format';
import {ESLMediaQuery} from '../../esl-media-query/core';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';

import {ESLToggleablePlaceholder} from '../../esl-toggleable/core';

import type {ESLToggleable, ESLToggleableActionParams} from '../../esl-toggleable/core/esl-toggleable';

@ExportNs('Trigger')
export class ESLTrigger extends ESLBaseElement {
  public static override is = 'esl-trigger';
  public static observedAttributes = ['target'];

  /** Event that represents {@link ESLTrigger} state change */
  @prop('esl:change:active') public CHANGE_EVENT: string;
  /** Events to observe target {@link ESLToggleable} instance state */
  @prop('esl:show esl:hide') public OBSERVED_EVENTS: string;

  /** @readonly Observed Toggleable active state marker */
  @boolAttr({readonly: true}) public active: boolean;

  /** CSS classes to set on active state */
  @attr({defaultValue: ''}) public activeClass: string;
  /** Target element {@link ESLTraversingQuery} selector to set `activeClass` */
  @attr({defaultValue: ''}) public activeClassTarget: string;

  /** Selector for ignored inner elements */
  @attr({defaultValue: 'a[href]'}) public ignore: string;

  /** Target Toggleable {@link ESLTraversingQuery} selector. `::next` by default */
  @attr({defaultValue: '::next'}) public target: string;
  /** Action to pass to the Toggleable. Supports `show`, `hide` and `toggle` values. `toggle` by default */
  @attr({defaultValue: 'toggle'}) public mode: string;

  /** Click event tracking media query. Default: `all` */
  @attr({defaultValue: 'all'}) public trackClick: string;
  /** Hover event tracking media query. Default: `none` */
  @attr({defaultValue: 'not all'}) public trackHover: string;

  /** Selector of inner target element to place aria attributes. Uses trigger itself if blank */
  @attr({defaultValue: ''}) public a11yTarget: string;

  /** Value of aria-label for active state */
  @attr({defaultValue: null}) public a11yLabelActive: string | null;
  /** Value of aria-label for inactive state */
  @attr({defaultValue: null}) public a11yLabelInactive: string | null;

  /** Show delay value */
  @attr({defaultValue: 'none'}) public showDelay: string;
  /** Hide delay value */
  @attr({defaultValue: 'none'}) public hideDelay: string;

  /**
   * Show delay value override for hover.
   * Note: the value should be numeric in order to delay hover action triggers for correct handling on mobile browsers.
   */
  @attr({defaultValue: '0'}) public hoverShowDelay: string;
  /**
   * Hide delay value override for hover
   * Note: the value should be numeric in order to delay hover action triggers for correct handling on mobile browsers.
   */
  @attr({defaultValue: '0'}) public hoverHideDelay: string;

  /** Prevent ESC keyboard event handling for target element hiding */
  @attr({parser: parseBoolean, serializer: toBooleanAttribute}) public ignoreEsc: boolean;

  protected _$target: ESLToggleable | null;

  protected override attributeChangedCallback(attrName: string, oldValue: string | null, newValue: string | null): void {
    if (!this.connected) return;
    if (attrName === 'target') return this.updateTargetFromSelector();
  }

  /** Target observable Toggleable */
  public get $target(): ESLToggleable | null {
    return this._$target;
  }
  public set $target(newPopupInstance: ESLToggleable | null) {
    this.$$off(this._onTargetStateChange);
    this._$target = newPopupInstance;
    this.$$on(this._onTargetStateChange);
    this._onTargetStateChange();
  }

  /** Element target to setup aria attributes */
  public get $a11yTarget(): HTMLElement | null {
    return this.a11yTarget ? this.querySelector(this.a11yTarget) : this;
  }

  /** Value to setup aria-label */
  public get a11yLabel(): string | null {
    if (!this.$target) return null;
    return (this.isTargetActive ? this.a11yLabelActive : this.a11yLabelInactive) || null;
  }

  /** Marker to allow track hover */
  public get allowHover(): boolean {
    return DeviceDetector.hasHover && ESLMediaQuery.for(this.trackHover).matches;
  }
  /** Marker to allow track clicks */
  public get allowClick(): boolean {
    return ESLMediaQuery.for(this.trackClick).matches;
  }

  /** Checks that the target is in active state */
  public get isTargetActive(): boolean {
    return !!this.$target?.open;
  }

  @ready
  protected override connectedCallback(): void {
    super.connectedCallback();
    this.updateTargetFromSelector();
    this.initA11y();
  }

  /** Update `$target` Toggleable  from `target` selector */
  public updateTargetFromSelector(): void {
    if (!this.target) return;
    this.$target = ESLTraversingQuery.first(this.target, this) as ESLToggleable;

    if (this.$target instanceof ESLToggleablePlaceholder && this.$target.$origin) {
      // change target if it is an instance of the placeholder element
      this.$target = this.$target.$origin;
    }
  }

  /** Check if the event target should be ignored */
  protected isTargetIgnored(target: EventTarget | null): boolean {
    if (!target || !isElement(target) || !this.ignore) return false;
    const $ignore = target.closest(this.ignore);
    // Ignore only inner elements (but do not ignore the trigger itself)
    return !!$ignore && $ignore !== this && this.contains($ignore);
  }

  /** Merge params to pass to the toggleable */
  protected mergeToggleableParams(this: ESLTrigger, ...params: ESLToggleableActionParams[]): ESLToggleableActionParams {
    return Object.assign({
      initiator: 'trigger',
      activator: this
    }, ...params);
  }

  /** Show target toggleable with passed params */
  public showTarget(params: ESLToggleableActionParams = {}): void {
    const actionParams = this.mergeToggleableParams({
      delay: parseNumber(this.showDelay)
    }, params);
    if (this.$target && typeof this.$target.show === 'function') {
      this.$target.show(actionParams);
    }
  }
  /** Hide target toggleable with passed params */
  public hideTarget(params: ESLToggleableActionParams = {}): void {
    const actionParams = this.mergeToggleableParams({
      delay: parseNumber(this.hideDelay)
    }, params);
    if (this.$target && typeof this.$target.hide === 'function') {
      this.$target.hide(actionParams);
    }
  }
  /** Toggles target toggleable with passed params */
  public toggleTarget(params: ESLToggleableActionParams = {}, state: boolean = !this.active): void {
    state ? this.showTarget(params) : this.hideTarget(params);
  }

  /**
   * Updates trigger state according to toggleable state
   * Does not produce `esl:change:active` event
   */
  public updateState(): boolean {
    const {isTargetActive} = this;
    const wasActive = this.active;

    this.toggleAttribute('active', isTargetActive);
    const clsTarget = ESLTraversingQuery.first(this.activeClassTarget, this) as HTMLElement;
    clsTarget && CSSClassUtils.toggle(clsTarget, this.activeClass, isTargetActive);

    this.updateA11y();

    return isTargetActive !== wasActive;
  }

  /** Handles ESLToggleable state change */
  @listen({
    event: (that: ESLTrigger) => that.OBSERVED_EVENTS,
    target: (that: ESLTrigger) => that.$target
  })
  protected _onTargetStateChange(originalEvent?: Event): void {
    if (!this.updateState()) return;
    const detail = {active: this.active, originalEvent};
    this.$$fire(this.CHANGE_EVENT, {detail});
  }

  /** Handles `click` event */
  @listen('click')
  protected _onClick(event: MouseEvent): void {
    if (!this.allowClick || this.isTargetIgnored(event.target)) return;
    event.preventDefault();
    this._onPrimaryEvent(event);
  }

  /** Handles `keydown` event */
  @listen('keydown')
  protected _onKeydown(event: KeyboardEvent): void {
    if (![ENTER, SPACE, ESC].includes(event.key) || this.isTargetIgnored(event.target)) return;
    event.preventDefault();
    if (event.key === ESC) {
      if (this.ignoreEsc) return;
      this.hideTarget({event});
    } else {
      this._onPrimaryEvent(event);
    }
  }

  /** Handles target primary (observed) event */
  protected _onPrimaryEvent(event: Event): void {
    switch (this.mode) {
      case 'show':
        return this.showTarget({event});
      case 'hide':
        return this.hideTarget({event});
      default:
        return this.toggleTarget({event});
    }
  }

  /** Handles hover `mouseenter` event */
  @listen('mouseenter')
  protected _onMouseEnter(event: MouseEvent): void {
    if (!this.allowHover) return;
    const delay = parseNumber(this.hoverShowDelay);
    this.toggleTarget({event, delay}, this.mode !== 'hide');
    event.preventDefault();
  }

  /** Handles hover `mouseleave` event */
  @listen('mouseleave')
  protected _onMouseLeave(event: MouseEvent): void {
    if (!this.allowHover) return;
    if (this.mode === 'show' || this.mode === 'hide') return;
    const delay = parseNumber(this.hoverHideDelay);
    this.hideTarget({event, delay, trackHover: true});
    event.preventDefault();
  }

  /** Set initial a11y attributes. Do nothing if trigger contains actionable element */
  public initA11y(): void {
    if (this.$a11yTarget !== this) return;
    if (!this.hasAttribute('role')) this.setAttribute('role', 'button');
    if (this.getAttribute('role') === 'button' && !this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
  }

  /** Update aria attributes */
  public updateA11y(): void {
    const target = this.$a11yTarget;
    if (!target) return;

    if (this.a11yLabelActive !== null || this.a11yLabelInactive !== null) {
      setAttr(target, 'aria-label', this.a11yLabel);
    }
    setAttr(target, 'aria-expanded', String(this.active));
    if (this.$target && this.$target.id) {
      setAttr(target, 'aria-controls', this.$target.id);
    }
  }
}

declare global {
  export interface ESLLibrary {
    Trigger: typeof ESLTrigger;
  }
  export interface HTMLElementTagNameMap {
    'esl-trigger': ESLTrigger;
  }
}
