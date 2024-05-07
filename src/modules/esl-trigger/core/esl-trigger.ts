import {ExportNs} from '../../esl-utils/environment/export-ns';
import {isElement} from '../../esl-utils/dom/api';
import {attr, prop, ready} from '../../esl-utils/decorators';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {ESLToggleablePlaceholder} from '../../esl-toggleable/core';

import {ESLBaseTrigger} from './esl-base-trigger';

import type {ESLToggleable} from '../../esl-toggleable/core/esl-toggleable';


@ExportNs('Trigger')
export class ESLTrigger extends ESLBaseTrigger {
  public static override is = 'esl-trigger';
  public static observedAttributes = ['target'];

  /** Event that represents {@link ESLTrigger} state change */
  @prop('esl:change:active') public override CHANGE_EVENT: string;

  /** Selector for ignored inner elements */
  @attr({defaultValue: 'a[href]'}) public ignore: string;

  /** Target Toggleable {@link ESLTraversingQuery} selector. `::next` by default */
  @attr({defaultValue: '::next'}) public target: string;
  /** Action to pass to the Toggleable. Supports `show`, `hide` and `toggle` values. `toggle` by default */
  @attr({defaultValue: 'toggle'}) public override mode: 'toggle' | 'show' | 'hide';

  /** Selector of inner target element to place aria attributes. Uses trigger itself if blank */
  @attr({defaultValue: ''}) public a11yTarget: string;


  protected _$target: ESLToggleable | null;

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
  public override get $a11yTarget(): HTMLElement | null {
    return this.a11yTarget ? this.querySelector(this.a11yTarget) : this;
  }

  @ready
  protected override connectedCallback(): void {
    super.connectedCallback();
    this.updateTargetFromSelector();
    this.initA11y();
  }

  protected override attributeChangedCallback(attrName: string, oldValue: string | null, newValue: string | null): void {
    if (!this.connected) return;
    if (attrName === 'target') return this.updateTargetFromSelector();
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
  protected override isTargetIgnored(target: EventTarget | null): boolean {
    if (!target || !isElement(target) || !this.ignore) return false;
    const $ignore = target.closest(this.ignore);
    // Ignore only inner elements (but do not ignore the trigger itself)
    return !!$ignore && $ignore !== this && this.contains($ignore);
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
