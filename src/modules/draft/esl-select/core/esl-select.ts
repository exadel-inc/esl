import {attr} from '../../../esl-base-element/core';
import {bind} from '../../../esl-utils/decorators/bind';
import {memoize} from '../../../esl-utils/decorators/memoize';

import {ESLBaseTrigger} from '../../../esl-base-trigger/core/esl-base-trigger';
import {ESLBasePopup} from '../../../esl-base-popup/core/esl-base-popup';
import {ESLSelectText} from './esl-select-text';
import {ESLSelectModel} from './esl-select-model';
import {ESLSelectList} from './esl-select-list';
import {ESLSelectItem} from './esl-select-item';
import {ESLSelectDropdown} from './esl-select-dropdown';

export class ESLSelect extends ESLBaseTrigger {
  public static readonly is = 'esl-select';

  @attr() public name: string;
  @attr() public placeholder: string;
  @attr() public selectAll: string;

  protected $text: ESLSelectText;
  protected $select: HTMLSelectElement;
  protected $popup: ESLSelectDropdown;

  constructor() {
    super();

    this.$text = document.createElement(ESLSelectText.is) as ESLSelectText;
    this.$popup = document.createElement(ESLSelectDropdown.is) as ESLSelectDropdown;
    this.$popup.origin = this;
  }

  protected connectedCallback() {
    super.connectedCallback();

    this.$select = this.querySelector('[esl-select-target]') as HTMLSelectElement;
    if (!this.$select) return;

    this.prepare();
    this.bindEvents();
    this.update();
  }
  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindEvents();
    this.dispose();
  }

  protected prepare() {
    this.$text.model = this.model;
    this.$text.className = this.$select.className;
    this.appendChild(this.$text);
  }
  protected dispose() {
    this.$select.className = this.$text.className;
    this.removeChild(this.$text);
  }

  public get popup(): ESLBasePopup {
    return this.$popup;
  }
  public set popup(val: ESLBasePopup) {
    throw new Error('Method is not supported');
  }

  @memoize()
  public get model(): ESLSelectModel {
    return new ESLSelectModel(this.options);
  }
  public get options(): HTMLOptionElement[] {
    if (!this.$select) return [];
    const items = this.$select.getElementsByTagName('option');
    return Array.from(items);
  }

  @bind
  protected _onPopupStateChange() {
    super._onPopupStateChange();
    this.update();
  }

  @bind
  public update() {
    this.classList.toggle('has-value', this.model.fill);
    const focusEl = document.activeElement;
    const hasFocus = this.$popup.open || focusEl && this.contains(focusEl);
    this.classList.toggle('has-focus', !!hasFocus);
  }

  public updateA11y() {}

  public static register() {
    ESLSelectItem.register();
    ESLSelectList.register();
    ESLSelectDropdown.register();
    ESLSelectText.register();
    super.register();
  }
}
