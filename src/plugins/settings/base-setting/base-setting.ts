import {attr, prop, listen} from '@exadel/esl/modules/esl-utils/decorators';
import {getAttr, setAttr} from '@exadel/esl/modules/esl-utils/dom/attr';

import {UIPPlugin} from '../../../core/base/plugin';

import type {UIPStateModel} from '../../../core/base/model';

/**
 * Custom element for manipulating with elements attributes
 * Custom settings should extend this class
 * to become connected with {@link UIPSettings}
 */
export abstract class UIPSetting extends UIPPlugin {
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
  /** No value specified */
  @prop('No value specified') public NOT_VALUE_SPECIFIED_MSG: string;

  /** Class for label field element */
  @attr({defaultValue: 'label-field'}) public labelFieldClass: string;
  /** Class for label input element */
  @attr({defaultValue: 'label-input'}) public labelInputClass: string;
  /** Class for label message element */
  @attr({defaultValue: 'label-msg'}) public labelMsgClass: string;
  /** Class for inconsistent message element */
  @attr({defaultValue: 'inconsistency-msg'}) public inconsistencyMsgClass: string;
  /** {@link target} attribute which is changed by setting */
  @attr() public attribute: string;

  /** Target to which setting's changes are attached */
  public get target(): string {
    const target = this.closest('[target]');
    return target ? getAttr(target, 'target')! : '';
  }
  /** Sets target to which setting's changes are attached */
  public set target(target: string) {
    setAttr(this, 'target', target);
  }

  protected override connectedCallback(): void {
    this.$$attr('uip-settings-content', true);
    this.$$fire('uip:settings:invalidate');
    super.connectedCallback();
    this.classList.add(UIPSetting.is);
    this._onRootStateChange();
  }

  /**
   * Handles setting value change and
   * dispatches `uip:change` event
   */
  @listen('change')
  protected _onChange(e: Event): void {
    e.preventDefault();
    if (!this.model) return;
    this.applyTo(this.model);
  }

  /**
   * Changes markup in {@link UIPStateModel}
   * with setting's value
   */
  public applyTo(model: UIPStateModel): void {
    if (this.isValid()) {
      model.changeAttribute({
        target: this.target,
        attribute: this.attribute,
        value: this.getDisplayedValue(),
        modifier: this
      });
    } else {
      this.setInconsistency(this.INVALID_VALUE_MSG);
    }
  }

  /**
   * Updates setting's value with active markup from {@link UIPStateModel}
   */
  public updateFrom(model: UIPStateModel): void {
    const values = model.getAttribute(this.target, this.attribute);
    this.classList.toggle('uip-inactive-setting', !values.length);
    this.setDisabled(!values.length);
  }

  /** Updates {@link UIPSetting} values */
  @listen({event: 'uip:change', target: ($this: UIPSetting) => $this.$root})
  protected _onRootStateChange(): void {
    this.$$fire('uip:settings:state:change');
    this.updateFrom(this.model!);
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
  public setDisabled(force: boolean): void {
    this.$$attr('disabled', force);
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
