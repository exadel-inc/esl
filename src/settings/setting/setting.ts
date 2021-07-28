import {attr, ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {EventUtils} from '@exadel/esl/modules/esl-utils/dom/events';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';

import {ChangeAttrConfig, UIPStateModel} from '../../core/state-model';
import {UIPSettings} from '../settings';
import {WARN} from '../../utils/warn-messages/warn';

/**
 * Custom element for manipulating with elements attributes.
 * Custom settings should extend this class
 * to become connected with {@link UIPSettings}.
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

  /**
   * Change markup in {@link UIPStateModel}
   * with setting's value.
   */
  public applyTo(model: UIPStateModel): void {
    const cfg: ChangeAttrConfig = {
      target: this.target,
      attribute: this.attribute,
      value: this.getDisplayedValue(),
      modifier: this.settings
    };
    this.isValid() ? model.changeAttribute(cfg) : this.setInconsistency(WARN.invalid);
  }

  /**
   * Update setting's value with
   * active markup in {@link UIPStateModel}.
   */
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
   * Check whether setting's value is valid or not.
   * Use for custom validation.
   */
  protected isValid(): boolean {
    return true;
  }

  /**
   * Indicate setting's incorrect state
   * (e.g. multiple attribute values or no target provided).
   */
  protected setInconsistency(msg = WARN.inconsistent): void {
    return;
  }

  /**
   * Get setting's value
   * to update markup in {@link UIPStateModel}.
   */
  protected abstract getDisplayedValue(): string | boolean;

  /**
   * Set setting's value
   * after processing markup in {@link UIPStateModel}.
   */
  protected abstract setValue(value: string | null): void;
}
