import {ESLBaseElement} from '../../../esl-base-element/core';
import {attr, boolAttr} from '../../../esl-utils/decorators';
import {ExportNs} from '../../../esl-utils/environment/export-ns';

import type {ESLSelectOption} from './esl-select-wrapper';

/**
 * ESLSelectItem component
 * @author Alexey Stsefanovich (ala'n)
 *
 * ESLSelectItem - inner component to render an option
 */
@ExportNs('SelectItem')
export class ESLSelectItem extends ESLBaseElement {
  public static override readonly is: string = 'esl-select-item';
  public static observedAttributes = ['selected', 'disabled'];

  /** Option value */
  @attr() public value: string;
  /** Selected state marker */
  @boolAttr() public selected: boolean;
  /** Disabled state marker */
  @boolAttr() public disabled: boolean;

  /** Original option */
  public original: ESLSelectOption;

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.tabIndex = 0;
    this.setAttribute('role', 'checkbox');
    this.setAttribute('aria-selected', String(this.selected));
  }

  protected override attributeChangedCallback(attrName: string): void {
    if (attrName === 'selected') {
      this.setAttribute('aria-selected', String(this.selected));
    }
    if (attrName === 'disabled') {
      this.setAttribute('aria-disabled', String(this.disabled));
    }
  }

  public update(option?: ESLSelectOption): void {
    if (option) this.original = option;
    this.value = this.original.value;
    this.disabled = this.original.disabled;
    this.selected = this.original.selected;
    this.textContent = this.original.text;
  }

  /** Helper to create an option item */
  public static build(option: ESLSelectOption): ESLSelectItem {
    const item = ESLSelectItem.create();
    item.update(option);
    return item;
  }
}

declare global {
  export interface ESLLibrary {
    SelectItem: typeof ESLSelectItem;
  }
  export interface HTMLElementTagNameMap {
    'esl-select-item': ESLSelectItem;
  }
}
