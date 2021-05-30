import {UIPSetting} from './setting/setting';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {attr} from '@exadel/esl/modules/esl-base-element/core';
import {CSSClassUtils} from '@exadel/esl';
import {UIPPlugin} from '../core/plugin';

export class UIPSettings extends UIPPlugin {
  public static is = 'uip-settings';

  @attr() public target: string;
  @attr({defaultValue: 'Settings'}) public label: string;
  @attr({defaultValue: 'settings-attached'}) public rootClass: string;

  protected connectedCallback() {
    super.connectedCallback();
    this.bindEvents();
    this.root && CSSClassUtils.add(this.root, this.rootClass);
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
    if (!this.root) return;

    (e.target as UIPSetting).applyTo(this.root.model);
    this.settings.forEach(setting => setting.updateFrom(this.root!.model));
    this.dispatchChange(this.root.model.html);
  }

  protected get settings(): UIPSetting[] {
    return Array.from(this.getElementsByClassName(UIPSetting.is)) as UIPSetting[];
  }

  @bind
  protected handleChange(): void {
    const model = this.root!.model;

    for (const setting of this.settings) {
      setting.updateFrom(model);
    }
  }
}

