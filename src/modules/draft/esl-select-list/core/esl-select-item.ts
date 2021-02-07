import type {ESLSelectOption} from './esl-select-wrapper';
import {attr, boolAttr, ESLBaseElement} from '../../../esl-base-element/core';

export class ESLSelectItem extends ESLBaseElement {
  public static readonly is: string = 'esl-select-item';

  public static get observedAttributes() {
    return ['selected'];
  }

  @attr() public value: string;
  @boolAttr() public selected: boolean;

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

  public static build(option: ESLSelectOption) {
    const item = document.createElement(ESLSelectItem.is) as ESLSelectItem;
    item.original = option;
    item.value = option.value;
    item.selected = option.selected;
    item.textContent = option.text;
    return item;
  }
}
