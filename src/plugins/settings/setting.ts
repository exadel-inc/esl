import {ESLBaseElement, prop} from '@exadel/esl/modules/esl-base-element/core';
import {attr, listen, memoize} from '@exadel/esl/modules/esl-utils/decorators';
import {getAttr, setAttr} from '@exadel/esl/modules/esl-utils/dom/attr';

import {ChangeAttrConfig, UIPStateModel} from '../../core/base/model';
import {UIPSettings} from './settings';

/**
 * Custom element for manipulating with elements attributes
 * Custom settings should extend this class
 * to become connected with {@link UIPSettings}
 */
export abstract class UIPSetting extends ESLBaseElement {
  public static override is = 'uip-setting';

  /** No matching value message */
  @prop('No select match') public NO_MATCH_MSG: string;
  /** No target element message */
  @prop('No setting target') public NO_TARGET_MSG: string;
  /** Inconsistent values found message */
  @prop('Inconsistent value') public INCONSISTENT_VALUE_MSG: string;
  /** Multiple values found message */
  @prop('Multiple values') public MULTIPLE_VALUE_MSG: string;
  /** Invalid value message */
  @prop('Invalid setting value') public INVALID_VALUE_MSG: string;

  /** {@link target} attribute which is changed by setting */
  @attr() public attribute: string;

  /** Target to which setting's changes are attached */
  public get target(): string {
    return getAttr(this, 'target', this.$settings.target);
  }
  /** Sets target to which setting's changes are attached */
  public set target(target: string) {
    setAttr(this, 'target', target);
  }

  /** Closest {@link UIPSettings} element */
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

  /**
   * Handles setting value change and
   * dispatches `uip:change` event
   */
  @listen('change')
  protected _onChange(e: Event): void {
    e.preventDefault();
    this.$$fire('uip:change');
  }

  /**
   * Changes markup in {@link UIPStateModel}
   * with setting's value
   */
  public applyTo(model: UIPStateModel): void {
    const cfg: ChangeAttrConfig = {
      target: this.target,
      attribute: this.attribute,
      value: this.getDisplayedValue(),
      modifier: this.$settings
    };
    this.isValid() ? model.changeAttribute(cfg) : this.setInconsistency(this.INVALID_VALUE_MSG);
  }

  /**
   * Updates setting's value with
   * active markup from {@link UIPStateModel}
   */
  public updateFrom(model: UIPStateModel): void {
    this.disabled = false;
    const values = model.getAttribute(this.target, this.attribute);

    if (!values.length) {
      this.disabled = true;
      this.setInconsistency(this.NO_TARGET_MSG);
    } else if (values.some(value => value !== values[0])) {
      this.setInconsistency(this.MULTIPLE_VALUE_MSG);
    } else {
      this.setValue(values[0]);
    }
  }

  /**
   * Checks whether setting's value is valid or not
   * Use for custom validation
   */
  protected isValid(): boolean {
    return true;
  }

  /**
   * Indicates setting's incorrect state
   * (e.g. multiple attribute values or no target provided)
   */
  protected setInconsistency(msg: string = this.INCONSISTENT_VALUE_MSG): void {
    return;
  }

  /**
   * Disable setting
   * By default is used when there are no setting's targets
   */
  set disabled(force: boolean) {
    return;
  }

  /**
   * Gets setting's value
   * to update markup in {@link UIPStateModel}
   */
  protected abstract getDisplayedValue(): string | boolean;

  /**
   * Sets setting's value
   * after processing markup in {@link UIPStateModel}
   */
  protected abstract setValue(value: string | null): void;
}
