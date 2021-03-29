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
    return ['selected'];
  }

  /** Option value */
  @attr() public value: string;
  /** Selected state marker */
  @boolAttr() public selected: boolean;

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
  }

  /** Helper to create an option item */
  public static build(option: ESLSelectOption) {
    const item = document.createElement(ESLSelectItem.is) as ESLSelectItem;
    item.original = option;
    item.value = option.value;
    item.selected = option.selected;
    item.textContent = option.text;
    return item;
  }
}
