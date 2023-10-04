import React from 'jsx-dom';

import {attr} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPlugin} from '../../core/base/plugin';
import {UIPSetting} from './base-setting/base-setting';

/**
 * Settings {@link UIPPlugin} custom element definition
 * Container for {@link UIPSetting}
 */
export class UIPSettings extends UIPPlugin {
  public static is = 'uip-settings';

  /** Attribute to set all inner {@link UIPSetting} settings' {@link UIPSetting#target} targets */
  @attr() public target: string;
  @attr({defaultValue: 'Settings'}) public label: string;

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.updateInner();
  }

  /** Initializes settings layout */
  protected updateInner(): void {
    const $content =
      <div className="settings-list esl-scrollable-content">
        <esl-scrollbar target="::prev(.settings-list)"></esl-scrollbar>
      </div>;
    $content.append(...this.childNodes);
    this.$inner.appendChild($content);
    this.appendChild(this.$inner);
  }

  /** Collects all {@link UIPSetting} items */
  protected get settings(): UIPSetting[] {
    return Array.from(this.getElementsByClassName(UIPSetting.is)) as UIPSetting[];
  }
}
