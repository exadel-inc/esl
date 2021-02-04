import {attr} from '../../../esl-base-element/core';
import {bind} from '../../../esl-utils/decorators/bind';

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
  @attr() public selectAllLabel: string;

  protected _model?: ESLSelectModel;

  protected $text: ESLSelectText;
  protected $select: HTMLSelectElement;
  protected $popup: ESLSelectDropdown;

  constructor() {
    super();

    this.$text = document.createElement(ESLSelectText.is) as ESLSelectText;
    this.$popup = document.createElement(ESLSelectDropdown.is) as ESLSelectDropdown;
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
    this.$popup.model = this.model;
    this.$popup.selectAllLabel = this.selectAllLabel;
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

  public get model(): ESLSelectModel {
    if (!this._model) {
      this._model = new ESLSelectModel(this.options);
    }
    return this._model;
  }
  public get options(): HTMLOptionElement[] {
    return this.$select ? Array.from(this.$select.options) : [];
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
