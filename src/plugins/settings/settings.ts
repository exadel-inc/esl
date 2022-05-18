import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {attr} from '@exadel/esl/modules/esl-base-element/core';
import {memoize} from '@exadel/esl/modules/esl-utils/decorators/memoize';

import {UIPPlugin} from '../../core/base/plugin';
import {UIPSetting} from './setting';

/**
 * Custom element, container for [settings]{@link UIPSetting}.
 * @extends UIPPlugin
 */
export class UIPSettings extends UIPPlugin {
  public static is = 'uip-settings';

  /**
   * Attribute to set all inner [settings']{@link UIPSetting}
   * [targets]{@link UIPSetting#target}.
   */
  @attr() public target: string;
  @attr({defaultValue: 'Settings'}) public label: string;

  @memoize()
  public get $scroll() {
    const $scroll = document.createElement('esl-scrollbar');
    $scroll.setAttribute('target', '::prev(.settings-list)');
    return $scroll;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.bindEvents();
    this.updateInner();
  }

  /** Initialize settings layout. */
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
    this.unbindEvents();
    super.disconnectedCallback();
  }

  protected bindEvents() {
    this.addEventListener('uip:change', this._onSettingChanged);
    this.root?.addEventListener('uip:configchange', this._onRootConfigChange);
  }

  protected unbindEvents(): void {
    this.removeEventListener('uip:change', this._onSettingChanged);
    this.root?.removeEventListener('uip:configchange', this._onRootConfigChange);
  }

  protected _onSettingChanged(e: any) {
    e.stopPropagation();
    if (!this.model) return;
    (e.target as UIPSetting).applyTo(this.model);
  }

  protected get settings(): UIPSetting[] {
    return Array.from(this.getElementsByClassName(UIPSetting.is)) as UIPSetting[];
  }

  @bind
  protected _onRootStateChange(): void {
    this.settings.forEach(setting => setting.updateFrom(this.model!));
  }

  @bind
  protected _onRootConfigChange(e: CustomEvent) {
    if (e.detail.attribute !== 'settings-collapsed') return false;
    this.classList.toggle('collapsed', e.detail.value !== null);
  }
}
