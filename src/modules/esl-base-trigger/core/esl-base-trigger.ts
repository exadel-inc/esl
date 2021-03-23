import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement, attr, boolAttr} from '../../esl-base-element/core';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {bind} from '../../esl-utils/decorators/bind';
import {ENTER, SPACE} from '../../esl-utils/dom/keys';
import {TraversingQuery} from '../../esl-traversing-query/core';

import type {NoopFnSignature} from '../../esl-utils/misc/functions';
import type {ESLToggleable} from '../../esl-toggleable/core/esl-toggleable';

/**
 * ESLBaseTrigger component
 * @author Alexey Stsefanovich (ala'n), Julia Murashko
 *
 * ESLBaseTrigger - base class for a custom element, that allows to trigger ESLToggleable instances state changes
 */
@ExportNs('BaseTrigger')
export class ESLBaseTrigger extends ESLBaseElement {
  /** @readonly Observed Toggleable active state marker */
  @boolAttr({readonly: true}) public active: boolean;

  /** Selector of inner target element to place aria attributes. Uses trigger itself if blank */
  @attr({defaultValue: ''}) public a11yTarget: string;

  /** CSS classes to set on active state */
  @attr({defaultValue: ''}) public activeClass: string;
  /** Target element {@link TraversingQuery} selector to set `activeClass` */
  @attr({defaultValue: ''}) public activeClassTarget: string;

  protected _$target: ESLToggleable;
  protected __unsubscribers: NoopFnSignature[];

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

  /** trigger show event type */
  public get showEvent(): null | string {
    return 'click';
  }
  /** trigger hide event type */
  public get hideEvent(): null | string {
    return 'click';
  }

  /** `showDelay` parameter to pass to target */
  protected get showDelayValue(): number | undefined {
    return;
  }
  /** `hideDelay` parameter to pass to target */
  protected get hideDelayValue(): number | undefined {
    return;
  }

  protected bindEvents() {
    if (!this.$target) return;
    if (this.showEvent === this.hideEvent) {
      this.attachEventListener(this.showEvent, this._onToggleEvent);
    } else {
      this.attachEventListener(this.showEvent, this._onShowEvent);
      this.attachEventListener(this.hideEvent, this._onHideEvent);
    }

    this.$target.addEventListener('esl:show', this._onTargetStateChange);
    this.$target.addEventListener('esl:hide', this._onTargetStateChange);

    this.addEventListener('keydown', this._onKeydown);
  }

  protected unbindEvents() {
    (this.__unsubscribers || []).forEach((off) => off());
    if (!this.$target) return;

    this.$target.removeEventListener('esl:show', this._onTargetStateChange);
    this.$target.removeEventListener('esl:hide', this._onTargetStateChange);

    this.removeEventListener('keydown', this._onKeydown);
  }

  protected attachEventListener(eventName: string | null, callback: (e: Event) => void) {
    if (!eventName) return;
    this.addEventListener(eventName, callback);
    this.__unsubscribers = this.__unsubscribers || [];
    this.__unsubscribers.push(() => this.removeEventListener(eventName, callback));
  }

  /** Handles trigger open type of event */
  @bind
  protected _onShowEvent(event: Event) {
    this.$target.show({
      activator: this,
      delay: this.showDelayValue,
      event
    });
  }

  /** Handles trigger hide type of event */
  @bind
  protected _onHideEvent(event: Event) {
    this.$target.hide({
      activator: this,
      delay: this.hideDelayValue,
      event
    });
  }

  /** Handles trigger toggle type of event */
  @bind
  protected _onToggleEvent(e: Event) {
    return (this.active ? this._onHideEvent : this._onShowEvent)(e);
  }

  /** Handles ESLTogglable state change */
  @bind
  protected _onTargetStateChange() {
    this.toggleAttribute('active', this.$target.open);

    const clsTarget = TraversingQuery.first(this.activeClassTarget, this) as HTMLElement;
    clsTarget && CSSUtil.toggleClsTo(clsTarget, this.activeClass, this.active);

    this.updateA11y();

    this.$$fire('change:active');
  }

  /** Handles `keydown` event */
  @bind
  protected _onKeydown(e: KeyboardEvent) {
    if ([ENTER, SPACE].includes(e.key)) {
      this.click();
      e.preventDefault();
    }
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

  /** Element target to setup aria attributes */
  public get $a11yTarget(): HTMLElement | null {
    return this.a11yTarget ? this.querySelector(this.a11yTarget) : this;
  }
}
