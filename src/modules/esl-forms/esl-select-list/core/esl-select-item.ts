import {attr, boolAttr, ESLBaseElement} from '../../../esl-base-element/core';
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
  public static readonly is: string = 'esl-select-item';

  public static get observedAttributes() {
    return ['selected', 'disabled'];
  }

  /** Option value */
  @attr() public value: string;
  /** Selected state marker */
  @boolAttr() public selected: boolean;
  /** Disabled state marker */
  @boolAttr() public disabled: boolean;

  /** Original option */
  public original: ESLSelectOption;

  protected connectedCallback() {
    super.connectedCallback();
    this.tabIndex = 0;
    this.setAttribute('role', 'checkbox');
    this.setAttribute('aria-selected', String(this.selected));
  }

  protected attributeChangedCallback(attrName: string) {
    if (attrName === 'selected') {
      this.setAttribute('aria-selected', String(this.selected));
    }
    if (attrName === 'disabled') {
      this.setAttribute('aria-disabled', String(this.disabled));
    }
  }

  public update(option?: ESLSelectOption) {
    if (option) this.original = option;
    this.value = this.original.value;
    this.disabled = this.original.disabled;
    this.selected = this.original.selected;
    this.textContent = this.original.text;
  }

  /** Helper to create an option item */
  public static build(option: ESLSelectOption) {
    const item = document.createElement(ESLSelectItem.is) as ESLSelectItem;
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
