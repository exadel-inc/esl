import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, boolAttr, ESLBaseElement} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';
import {ready} from '../../esl-utils/decorators/ready';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {ENTER, SPACE} from '../../esl-utils/dom/keys';
import {TraversingQuery} from '../../esl-traversing-query/core';
import {ESLMediaQuery, ESLMediaRuleList} from '../../esl-media-query/core';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';
import type {ESLToggleable, ToggleableActionParams} from '../../esl-toggleable/core/esl-toggleable';

@ExportNs('Trigger')
export class ESLTrigger extends ESLBaseElement {
  public static is = 'esl-trigger';

  static get observedAttributes() {
    return ['target'];
  }

  /** @readonly Observed Toggleable active state marker */
  @boolAttr({readonly: true}) public active: boolean;

  /** CSS classes to set on active state */
  @attr({defaultValue: ''}) public activeClass: string;
  /** Target element {@link TraversingQuery} selector to set `activeClass` */
  @attr({defaultValue: ''}) public activeClassTarget: string;

  /** Selector for ignore inner elements */
  @attr({defaultValue: 'a[href]'}) public ignore: string;

  /** Target Toggleable {@link TraversingQuery} selector. `next` by default */
  @attr({defaultValue: 'next'}) public target: string;
  /** Action to pass to the Toggleable. Supports `show`, `hide` and `toggle` values. `toggle` by default */
  @attr({defaultValue: 'toggle'}) public mode: string;

  @attr({defaultValue: 'all'}) public trackClick: string;
  /** Hover event tracking media query. Default: none. Blank value: 'not (hover: hover)' */
  @attr({defaultValue: 'not all'}) public trackHover: string;

  /** Selector of inner target element to place aria attributes. Uses trigger itself if blank */
  @attr({defaultValue: ''}) public a11yTarget: string;

  /** Show delay value */
  @attr({defaultValue: 'none'}) public showDelay: string;
  /** Hide delay value */
  @attr({defaultValue: 'none'}) public hideDelay: string;

  protected _$target: ESLToggleable;

  protected attributeChangedCallback(attrName: string) {
    if (!this.connected) return;
    if (attrName === 'target') return this.updateTargetFromSelector();
  }

  /** Target observable Toggleable */
  public get $target() {
    return this._$target;
  }
  public set $target(newPopupInstance) {
    this.unbindEvents();
    this._$target = newPopupInstance;
    if (this._$target) {
      this.bindEvents();
      this._onTargetStateChange();
    }
  }

  /** Element target to setup aria attributes */
  public get $a11yTarget(): HTMLElement | null {
    return this.a11yTarget ? this.querySelector(this.a11yTarget) : this;
  }

  /** Marker to allow track hover */
  public get allowHover() {
    return DeviceDetector.hasHover && ESLMediaQuery.for(this.trackHover).matches;
  }
  /** Marker to allow track clicks */
  public get allowClick() {
    return ESLMediaQuery.for(this.trackClick).matches;
  }

  private static parseDelayValue(delay: string): number | undefined {
    return isNaN(+delay) ? undefined : +delay;
  }
  /** Show delay attribute processing */
  public get showDelayValue(): number | undefined {
    return ESLMediaRuleList.parse(this.showDelay, ESLTrigger.parseDelayValue).activeValue;
  }
  /** Hide delay attribute processing */
  public get hideDelayValue(): number | undefined {
    return ESLMediaRuleList.parse(this.hideDelay, ESLTrigger.parseDelayValue).activeValue;
  }

  @ready
  protected connectedCallback() {
    super.connectedCallback();
    this.updateTargetFromSelector();
  }
  @ready
  protected disconnectedCallback() {
    this.unbindEvents();
  }

  protected bindEvents() {
    if (!this.$target) return;
    this.$target.addEventListener('esl:show', this._onTargetStateChange);
    this.$target.addEventListener('esl:hide', this._onTargetStateChange);

    this.addEventListener('click', this._onClick);
    this.addEventListener('keydown', this._onKeydown);
    this.addEventListener('mouseenter', this._onMouseEnter);
    this.addEventListener('mouseleave', this._onMouseLeave);
  }
  protected unbindEvents() {
    if (!this.$target) return;
    this.$target.removeEventListener('esl:show', this._onTargetStateChange);
    this.$target.removeEventListener('esl:hide', this._onTargetStateChange);

    this.removeEventListener('click', this._onClick);
    this.removeEventListener('keydown', this._onKeydown);
    this.removeEventListener('mouseenter', this._onMouseEnter);
    this.removeEventListener('mouseleave', this._onMouseLeave);
  }

  /** Update `$target` Toggleable  from `target` selector */
  protected updateTargetFromSelector() {
    if (!this.target) return;
    this.$target = TraversingQuery.first(this.target, this) as ESLToggleable;
  }

  /** Check if the event target should be ignored */
  protected isIgnoredTarget(target: EventTarget | null) {
    if (!target || !(target instanceof HTMLElement) || !this.ignore) return false;
    const $ignore = target.closest(this.ignore);
    // Ignore only inner elements (but do not ignore the trigger itself)
    return !!$ignore && $ignore !== this && this.contains($ignore);
  }

  /** Merge params to pass to the toggleable */
  protected mergeToggleableParams(...params: ToggleableActionParams[]) {
    return Object.assign({
      initiator: 'trigger',
      activator: this
    }, ...params);
  }

  /** Show target toggleable with passed params */
  public showTarget(params: ToggleableActionParams = {}) {
    const actionParams = this.mergeToggleableParams({
      delay: this.showDelayValue
    }, params);
    this.$target && this.$target.show(actionParams);
  }
  /** Hide target toggleable with passed params */
  public hideTarget(params: ToggleableActionParams = {}) {
    const actionParams = this.mergeToggleableParams({
      delay: this.hideDelayValue
    }, params);
    this.$target && this.$target.hide(actionParams);
  }
  /** Toggles target toggleable with passed params */
  public toggleTarget(params: ToggleableActionParams = {}, state: boolean = !this.active) {
    state ? this.showTarget(params) : this.hideTarget(params);
  }

  /** Handles ESLTogglable state change */
  @bind
  protected _onTargetStateChange() {
    this.toggleAttribute('active', this.$target.open);

    const clsTarget = TraversingQuery.first(this.activeClassTarget, this) as HTMLElement;
    clsTarget && CSSClassUtils.toggle(clsTarget, this.activeClass, this.active);

    this.updateA11y();

    this.$$fire('change:active');
  }

  /** Handles `click` event */
  @bind
  protected _onClick(event: MouseEvent) {
    if (!this.allowClick || this.isIgnoredTarget(event.target)) return;
    event.preventDefault();
    switch (this.mode) {
      case 'show': return this.showTarget({event});
      case 'hide': return this.toggleTarget({event});
      default: return this.toggleTarget({event});
    }
  }

  /** Handles `keydown` event */
  @bind
  protected _onKeydown(event: KeyboardEvent) {
    if (![ENTER, SPACE].includes(event.key) || this.isIgnoredTarget(event.target)) return;
    event.preventDefault();
    switch (this.mode) {
      case 'show': return this.showTarget({event});
      case 'hide': return this.toggleTarget({event});
      default: return this.toggleTarget({event});
    }
  }

  /** Handles hover `mouseenter` event */
  @bind
  protected _onMouseEnter(event: MouseEvent) {
    if (!this.allowHover) return;
    this.toggleTarget({event}, this.mode !== 'hide');
    event.preventDefault();
  }

  /** Handles hover `mouseleave` event */
  @bind
  protected _onMouseLeave(event: MouseEvent) {
    if (!this.allowHover) return;
    if (this.mode === 'show' || this.mode === 'hide') return;
    this.hideTarget({event, trackHover: true});
    event.preventDefault();
  }

  /** Update aria attributes */
  public updateA11y() {
    const target = this.$a11yTarget;
    if (!target) return;

    target.setAttribute('aria-expanded', String(this.active));
    if (this.$target.id) {
      target.setAttribute('aria-controls', this.$target.id);
    }
  }
}
