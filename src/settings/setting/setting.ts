import {attr, ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {EventUtils} from '@exadel/esl/modules/esl-utils/dom/events';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';

import {ChangeAttrConfig, UIPStateModel} from '../../core/state-model';
import {UIPSettings} from '../settings';
import {WARN} from '../../utils/warn-messages/warn';

/**
 * Component for manipulating with elements attributes. Custom settings should extend
 * this class if you want them to be connected with {@link UIPSettings}.
 */
export abstract class UIPSetting extends ESLBaseElement {
  static is = 'uip-setting';
  /** Event fired when setting's value is changed. */
  static changeEvent = 'change';

  /** [Target's]{@link target} attribute which is changed by setting. */
  @attr() public attribute: string;
  /** Target to which setting's changes are attached. */
  @attr() public target: string;

  public get settingContainer(): HTMLElement | null {
    return this.closest(UIPSettings.is);
  }

  public get settings() {
    return this.settingContainer as UIPSettings;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.classList.add(UIPSetting.is);
    this.bindEvents();

    if (this.target) return;
    const settingsTarget = this.settingContainer?.getAttribute('target');
    if (settingsTarget) this.target = settingsTarget;
  }

  protected disconnectedCallback() {
    this.unbindEvents();
    super.disconnectedCallback();
  }

  protected bindEvents(): void {
    this.addEventListener(UIPSetting.changeEvent, this._onChange);
  }

  protected unbindEvents(): void {
    this.removeEventListener(UIPSetting.changeEvent, this._onChange);
  }

  @bind
  protected _onChange(e: Event): void {
    e.preventDefault();
    EventUtils.dispatch(this, 'uip:change');
  }

  /** Changing {@link UIPStateModel} state according to setting's value. */
  public applyTo(model: UIPStateModel): void {
    const cfg: ChangeAttrConfig = {
      target: this.target,
      attribute: this.attribute,
      value: this.getDisplayedValue(),
      modifier: this.settings
    };
    this.isValid() ? model.changeAttribute(cfg) : this.setInconsistency(WARN.invalid);
  }

  /** Updating setting's value according to {@link UIPStateModel} state. */
  public updateFrom(model: UIPStateModel): void {
    const values = model.getAttribute(this.target, this.attribute);

    if (!values.length) {
      this.setInconsistency(WARN.noTarget);
    } else if (values.some(value => value !== values[0])) {
      this.setInconsistency(WARN.multiple);
    } else {
      this.setValue(values[0]);
    }
  }

  /**
   * Checking whether setting's value is valid or not.
   * Can be used for custom validation.
   */
  protected isValid(): boolean {
    return true;
  }

  /**
   * Indicating setting's incorrect state
   * (e.g. multiple attribute values or no target provided).
   */
  protected setInconsistency(msg = WARN.inconsistent): void {
    return;
  }

  /**
   * Getting setting's value
   * to update {@link UIPStateModel} state.
   */
  protected abstract getDisplayedValue(): string | boolean;

  /**
   * Setting setting's value
   * after processing {@link UIPStateModel} state.
   */
  protected abstract setValue(value: string | null): void;
}
