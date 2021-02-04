import {attr} from '../../../esl-base-element/core';
import {bind} from '../../../esl-utils/decorators/bind';
import {CSSUtil} from '../../../esl-utils/dom/styles';

import {ESLBaseTrigger} from '../../../esl-base-trigger/core/esl-base-trigger';
import {ESLBasePopup} from '../../../esl-base-popup/core/esl-base-popup';
import {ESLSelectText} from './esl-select-text';
import {ESLSelectModel} from './esl-select-model';
import {ESLSelectList} from './esl-select-list';
import {ESLSelectItem} from './esl-select-item';
import {ESLSelectDropdown} from './esl-select-dropdown';
import {EventUtils} from '../../../esl-utils/dom/events';

export class ESLSelect extends ESLBaseTrigger {
  public static readonly is = 'esl-select';

  @attr() public name: string;
  @attr() public emptyText: string;
  @attr() public hasValueClass: string;
  @attr() public hasFocusClass: string;
  @attr({defaultValue: 'Select All'}) public selectAllLabel: string;
  @attr({defaultValue: '+ {rest} more...'}) public moreLabelFormat: string;

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
    this.$text.emptyText = this.emptyText;
    this.$text.moreLabelFormat = this.moreLabelFormat;
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
      this._model.addListener(this._onChange);
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
    const hasValue = this.model.fill;
    this.toggleAttribute('has-value', hasValue);
    CSSUtil.toggleClsTo(this, this.hasValueClass, hasValue);
    const focusEl = document.activeElement;
    const hasFocus = this.$popup.open || focusEl && this.contains(focusEl);
    CSSUtil.toggleClsTo(this, this.hasFocusClass, !!hasFocus);
  }

  @bind
  public _onChange() {
    this.update();
    EventUtils.dispatch(this, 'change');
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
