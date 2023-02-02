import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {attr} from '@exadel/esl/modules/esl-base-element/core';
import {memoize} from '@exadel/esl/modules/esl-utils/decorators/memoize';
import {listen} from '@exadel/esl/modules/esl-utils/decorators/listen';
import type {ESLScrollbar} from '@exadel/esl/modules/esl-scrollbar/core/esl-scrollbar';

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

  /** {@link ESLScrollbar} scroll element */
  @memoize()
  public get $scroll(): ESLScrollbar {
    const $scroll = document.createElement('esl-scrollbar');
    $scroll.setAttribute('target', '::prev(.settings-list)');
    return $scroll;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.updateInner();
  }

  /** Initializes settings layout */
  protected updateInner() {
    const $settingsList = document.createElement('div');
    $settingsList.className = 'settings-list esl-scrollable-content';
    [...this.childNodes].forEach( (node: HTMLElement) => {
      $settingsList.appendChild(node);
    });
    this.$inner.appendChild($settingsList);
    this.$scroll && this.$inner.appendChild(this.$scroll);
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
