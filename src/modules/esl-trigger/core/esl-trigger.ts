import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, boolAttr, ESLBaseElement} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';
import {ready} from '../../esl-utils/decorators/ready';
import {parseNumber} from '../../esl-utils/misc/format';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {ENTER, SPACE} from '../../esl-utils/dom/keys';
import {TraversingQuery} from '../../esl-traversing-query/core';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';
import {ESLMediaQuery} from '../../esl-media-query/core';
import {ESLToggleablePlaceholder} from '../../esl-toggleable/core';

import type {ESLToggleable, ToggleableActionParams} from '../../esl-toggleable/core/esl-toggleable';

@ExportNs('Trigger')
export class ESLTrigger extends ESLBaseElement {
  public static is = 'esl-trigger';

  static get observedAttributes(): string[] {
    return ['target'];
  }

  /** @readonly Observed Toggleable active state marker */
  @boolAttr({readonly: true}) public active: boolean;

  /** CSS classes to set on active state */
  @attr({defaultValue: ''}) public activeClass: string;
  /** Target element {@link TraversingQuery} selector to set `activeClass` */
  @attr({defaultValue: ''}) public activeClassTarget: string;

  /** Selector for ignored inner elements */
  @attr({defaultValue: 'a[href]'}) public ignore: string;

  /** Target Toggleable {@link TraversingQuery} selector. `::next` by default */
  @attr({defaultValue: '::next'}) public target: string;
  /** Action to pass to the Toggleable. Supports `show`, `hide` and `toggle` values. `toggle` by default */
  @attr({defaultValue: 'toggle'}) public mode: string;

  /** Click event tracking media query. Default: `all` */
  @attr({defaultValue: 'all'}) public trackClick: string;
  /** Hover event tracking media query. Default: `none` */
  @attr({defaultValue: 'not all'}) public trackHover: string;

  /** Selector of inner target element to place aria attributes. Uses trigger itself if blank */
  @attr({defaultValue: ''}) public a11yTarget: string;

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

  protected _$target: ESLToggleable | null;

  protected attributeChangedCallback(attrName: string): void {
    if (!this.connected) return;
    if (attrName === 'target') return this.updateTargetFromSelector();
  }

  /** Target observable Toggleable */
  public get $target(): ESLToggleable | null {
    return this._$target;
  }
  public set $target(newPopupInstance: ESLToggleable | null) {
    this.unbindEvents();
    this._$target = newPopupInstance;
    this.bindEvents();
    this._onTargetStateChange();
  }

  /** Element target to setup aria attributes */
  public get $a11yTarget(): HTMLElement | null {
    return this.a11yTarget ? this.querySelector(this.a11yTarget) : this;
  }

  /** Marker to allow track hover */
  public get allowHover(): boolean {
    return DeviceDetector.hasHover && ESLMediaQuery.for(this.trackHover).matches;
  }
  /** Marker to allow track clicks */
  public get allowClick(): boolean {
    return ESLMediaQuery.for(this.trackClick).matches;
  }

  @ready
  protected connectedCallback(): void {
    super.connectedCallback();
    this.updateTargetFromSelector();
    this.initA11y();
  }
  @ready
  protected disconnectedCallback(): void {
    this.unbindEvents();
  }

  protected bindEvents(): void {
    if (!this.$target) return;
    this.$target.addEventListener('esl:show', this._onTargetStateChange);
    this.$target.addEventListener('esl:hide', this._onTargetStateChange);

    this.addEventListener('click', this._onClick);
    this.addEventListener('keydown', this._onKeydown);
    this.addEventListener('mouseenter', this._onMouseEnter);
    this.addEventListener('mouseleave', this._onMouseLeave);
  }
  protected unbindEvents(): void {
    if (!this.$target) return;
    this.$target.removeEventListener('esl:show', this._onTargetStateChange);
    this.$target.removeEventListener('esl:hide', this._onTargetStateChange);

    this.removeEventListener('click', this._onClick);
    this.removeEventListener('keydown', this._onKeydown);
    this.removeEventListener('mouseenter', this._onMouseEnter);
    this.removeEventListener('mouseleave', this._onMouseLeave);
  }

  /** Update `$target` Toggleable  from `target` selector */
  protected updateTargetFromSelector(): void {
    if (!this.target) return;
    this.$target = TraversingQuery.first(this.target, this) as ESLToggleable;

    if (this.$target instanceof ESLToggleablePlaceholder && this.$target.$origin) {
      // change target if it is an instance of the placeholder element
      this.$target = this.$target.$origin;
    }
  }

  /** Check if the event target should be ignored */
  protected isTargetIgnored(target: EventTarget | null): boolean {
    if (!target || !(target instanceof HTMLElement) || !this.ignore) return false;
    const $ignore = target.closest(this.ignore);
    // Ignore only inner elements (but do not ignore the trigger itself)
    return !!$ignore && $ignore !== this && this.contains($ignore);
  }

  /** Merge params to pass to the toggleable */
  protected mergeToggleableParams(this: ESLTrigger, ...params: ToggleableActionParams[]): ToggleableActionParams {
    return Object.assign({
      initiator: 'trigger',
      activator: this
    }, ...params);
  }

  /** Show target toggleable with passed params */
  public showTarget(params: ToggleableActionParams = {}): void {
    const actionParams = this.mergeToggleableParams({
      delay: parseNumber(this.showDelay)
    }, params);
    if (this.$target && typeof this.$target.show === 'function') {
      this.$target.show(actionParams);
    }
  }
  /** Hide target toggleable with passed params */
  public hideTarget(params: ToggleableActionParams = {}): void {
    const actionParams = this.mergeToggleableParams({
      delay: parseNumber(this.hideDelay)
    }, params);
    if (this.$target && typeof this.$target.hide === 'function') {
      this.$target.hide(actionParams);
    }
  }
  /** Toggles target toggleable with passed params */
  public toggleTarget(params: ToggleableActionParams = {}, state: boolean = !this.active): void {
    state ? this.showTarget(params) : this.hideTarget(params);
  }

  /**
   * Updates trigger state according to toggleable state
   * Does not produce `esl:change:active` event
   */
  public updateState(): boolean {
    const isActive = !!this.$target?.open;
    const wasActive = this.active;

    this.toggleAttribute('active', isActive);
    const clsTarget = TraversingQuery.first(this.activeClassTarget, this) as HTMLElement;
    clsTarget && CSSClassUtils.toggle(clsTarget, this.activeClass, isActive);

    this.updateA11y();

    return isActive !== wasActive;
  }

  /** Handles ESLToggleable state change */
  @bind
  protected _onTargetStateChange(originalEvent?: Event): void {
    if (!this.updateState()) return;
    const detail = {active: this.active, originalEvent};
    this.$$fire('change:active', {detail});
  }

  /** Handles `click` event */
  @bind
  protected _onClick(event: MouseEvent): void {
    if (!this.allowClick || this.isTargetIgnored(event.target)) return;
    event.preventDefault();
    switch (this.mode) {
      case 'show':
        return this.showTarget({event});
      case 'hide':
        return this.hideTarget({event});
      default:
        return this.toggleTarget({event});
    }
  }

  /** Handles `keydown` event */
  @bind
  protected _onKeydown(event: KeyboardEvent): void {
    if (![ENTER, SPACE].includes(event.key) || this.isTargetIgnored(event.target)) return;
    event.preventDefault();
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
  @bind
  protected _onMouseEnter(event: MouseEvent): void {
    if (!this.allowHover) return;
    const delay = parseNumber(this.hoverShowDelay);
    this.toggleTarget({event, delay}, this.mode !== 'hide');
    event.preventDefault();
  }

  /** Handles hover `mouseleave` event */
  @bind
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

    target.setAttribute('aria-expanded', String(this.active));
    if (this.$target && this.$target.id) {
      target.setAttribute('aria-controls', this.$target.id);
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
