import {UIPSetting} from './setting/setting';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {attr} from '@exadel/esl/modules/esl-base-element/core';
import {CSSClassUtils, memoize} from '@exadel/esl';
import {UIPPlugin} from '../core/plugin';

export class UIPSettings extends UIPPlugin {
  public static is = 'uip-settings';

  @attr() public target: string;
  @attr({defaultValue: 'Settings'}) public label: string;
  @attr({defaultValue: 'settings-attached'}) public rootClass: string;

  @memoize()
  public get $scroll() {
    const $scroll = document.createElement('esl-scrollbar');
    $scroll.setAttribute('target', '::prev(.settings-list)');
    return $scroll;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.bindEvents();
    this.root && CSSClassUtils.add(this.root, this.rootClass);
    this.updateInner();
  }

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
    this.root && CSSClassUtils.remove(this.root, this.rootClass);
    super.disconnectedCallback();
  }

  protected bindEvents() {
    this.addEventListener('uip:change', this._onSettingChanged);
  }

  protected unbindEvents(): void {
    this.removeEventListener('uip:change', this._onSettingChanged);
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
}

