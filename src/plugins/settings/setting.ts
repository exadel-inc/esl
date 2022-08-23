import {attr, ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {EventUtils} from '@exadel/esl/modules/esl-utils/dom/events';
import {listen} from '@exadel/esl/modules/esl-utils/decorators/listen';
import {memoize} from '@exadel/esl/modules/esl-utils/decorators/memoize';

import {ChangeAttrConfig, UIPStateModel} from '../../core/base/model';
import {UIPSettings} from './settings';
import {WARNING_MSG} from '../../utils/warning-msg';
import {getAttr, setAttr} from '@exadel/esl/modules/esl-utils/dom/attr';

/**
 * Custom element for manipulating with elements attributes.
 * Custom settings should extend this class
 * to become connected with {@link UIPSettings}.
 */
export abstract class UIPSetting extends ESLBaseElement {
  static is = 'uip-setting';

  /** [Target's]{@link target} attribute which is changed by setting. */
  @attr() public attribute: string;
  /** Target to which setting's changes are attached. */
  public get target(): string {
    return getAttr(this, 'target', this.$settings.target);
  }

  public set target(target: string) {
    setAttr(this, 'target', target);
  }

  @memoize()
  public get $settings() {
    return this.closest(UIPSettings.is) as UIPSettings;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.classList.add(UIPSetting.is);
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
  }

  @listen('change')
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
      modifier: this.$settings
    };
    this.isValid() ? model.changeAttribute(cfg) : this.setInconsistency(WARNING_MSG.invalid);
  }

  /**
   * Update setting's value with
   * active markup in {@link UIPStateModel}.
   */
  public updateFrom(model: UIPStateModel): void {
    this.disabled = false;
    const values = model.getAttribute(this.target, this.attribute);

    if (!values.length) {
      this.disabled = true;
      this.setInconsistency(WARNING_MSG.noTarget);
    } else if (values.some(value => value !== values[0])) {
      this.setInconsistency(WARNING_MSG.multiple);
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
  protected setInconsistency(msg: string = WARNING_MSG.inconsistent): void {
    return;
  }

  /**
   * Disable setting.
   * By default is used when there are no setting's targets.
   */
  set disabled(force: boolean) {
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
