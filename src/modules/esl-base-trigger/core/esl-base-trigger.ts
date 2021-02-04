import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement, attr, boolAttr} from '../../esl-base-element/core';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {bind} from '../../esl-utils/decorators/bind';
import {ENTER, SPACE} from '../../esl-utils/dom/keycodes';
import {TraversingQuery} from '../../esl-traversing-query/core';

import type {NoopFnSignature} from '../../esl-utils/misc/functions';
import type {ESLBasePopup} from '../../esl-base-popup/core/esl-base-popup';

@ExportNs('BaseTrigger')
export class ESLBaseTrigger extends ESLBaseElement {
  // Markers
  @boolAttr() public active: boolean;

  // Main setting
  @attr({defaultValue: ''}) public a11yTarget: string;

  @attr({defaultValue: ''}) public activeClass: string;
  @attr({defaultValue: ''}) public activeClassTarget: string;

  protected _popup: ESLBasePopup;
  protected __unsubscribers: NoopFnSignature[];

  public get popup() {
    return this._popup;
  }
  public set popup(newPopupInstance) {
    this.unbindEvents();
    this._popup = newPopupInstance;
    if (this._popup) {
      this.bindEvents();
      this._onPopupStateChange();
    }
  }

  public get showEvent(): null | string {
    return 'click';
  }
  public get hideEvent(): null | string {
    return 'click';
  }

  protected get showDelayValue(): number | undefined {
    return;
  }
  protected get hideDelayValue(): number | undefined {
    return;
  }

  protected bindEvents() {
    if (!this.popup) return;
    if (this.showEvent === this.hideEvent) {
      this.attachEventListener(this.showEvent, this._onToggleEvent);
    } else {
      this.attachEventListener(this.showEvent, this._onShowEvent);
      this.attachEventListener(this.hideEvent, this._onHideEvent);
    }

    this.popup.addEventListener('esl:show', this._onPopupStateChange);
    this.popup.addEventListener('esl:hide', this._onPopupStateChange);

    this.addEventListener('keydown', this._onKeydown);
  }

  protected unbindEvents() {
    (this.__unsubscribers || []).forEach((off) => off());
    if (!this.popup) return;

    this.popup.removeEventListener('esl:show', this._onPopupStateChange);
    this.popup.removeEventListener('esl:hide', this._onPopupStateChange);

    this.removeEventListener('keydown', this._onKeydown);
  }

  protected attachEventListener(eventName: string | null, callback: (e: Event) => void) {
    if (!eventName) return;
    this.addEventListener(eventName, callback);
    this.__unsubscribers = this.__unsubscribers || [];
    this.__unsubscribers.push(() => this.removeEventListener(eventName, callback));
  }

  @bind
  protected _onShowEvent(e: Event) {
    this.popup.show({
      activator: this,
      delay: this.showDelayValue
    });
  }
  @bind
  protected _onHideEvent(e: Event) {
    this.popup.hide({
      activator: this,
      delay: this.hideDelayValue
    });
  }
  @bind
  protected _onToggleEvent(e: Event) {
    return (this.active ? this._onHideEvent : this._onShowEvent)(e);
  }

  @bind
  protected _onPopupStateChange() {
    this.active = this.popup.open;
    const clsTarget = TraversingQuery.first(this.activeClassTarget, this) as HTMLElement;
    clsTarget && CSSUtil.toggleClsTo(clsTarget, this.activeClass, this.active);
    this.updateA11y();
    this.$$fire('change:active');
  }

  @bind
  protected _onKeydown(e: KeyboardEvent) {
    switch (e.which || e.keyCode) {
      case ENTER:
      case SPACE:
        this.click();
        e.preventDefault();
        break;
    }
  }

  public updateA11y() {
    const target = this.$a11yTarget;
    if (!target) return;
    target.setAttribute('aria-expanded', String(this.active));

    // TODO: auto generate
    if (this.popup.id) {
      target.setAttribute('aria-controls', this.popup.id);
    }
  }

  public get $a11yTarget(): HTMLElement | null {
    return this.a11yTarget ? this.querySelector(this.a11yTarget) : this;
  }
}
