import React from 'jsx-dom';

import {bind, attr, listen} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPlugin} from '../../core/base/plugin';
import {UIPSetting} from './setting';

/**
 * Settings {@link UIPPlugin} custom element definition
 * Container for {@link UIPSetting}
 * @extends UIPPlugin
 */
export class UIPSettings extends UIPPlugin {
  public static is = 'uip-settings';

  /**
   * Attribute to set all inner {@link UIPSetting settings'}
   * {@link UIPSetting#target targets}
   */
  @attr() public target: string;
  @attr({defaultValue: 'Settings'}) public label: string;

  protected connectedCallback() {
    super.connectedCallback();
    this.updateInner();
    this._onRootStateChange();
  }

  /** Initializes settings layout */
  protected updateInner() {
    const $content = <div className="settings-list esl-scrollable-content">
      <esl-scrollbar target="::prev(.settings-list)"></esl-scrollbar>
    </div>;
    $content.append(...this.childNodes);
    this.$inner.appendChild($content);
    this.appendChild(this.$inner);
  }

  protected disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  /**
   * Handles `uip:change` event to
   * apply changes to the state
   */
  @listen('uip:change')
  protected _onSettingChanged(e: any) {
    e.stopPropagation();
    if (!this.model) return;
    (e.target as UIPSetting).applyTo(this.model);
  }

  /** Collects all {@link UIPSetting} items */
  protected get settings(): UIPSetting[] {
    return Array.from(this.getElementsByClassName(UIPSetting.is)) as UIPSetting[];
  }

  /** Updates {@link UIPSetting} values */
  @bind
  protected _onRootStateChange(): void {
    this.settings.forEach(setting => setting.updateFrom(this.model!));
  }
}
