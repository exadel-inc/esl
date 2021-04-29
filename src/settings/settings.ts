import {UIPSetting} from './setting/setting';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {attr} from '@exadel/esl/modules/esl-base-element/core';
import {CSSUtil} from '@exadel/esl';
import {UIPPlugin} from '../core/plugin';
import {UIPStateModel} from '../utils/state-model/state-model';

export class UIPSettings extends UIPPlugin {
  public static is = 'uip-settings';

  @attr() public target: string;
  @attr({defaultValue: 'Settings'}) public label: string;
  @attr({defaultValue: 'settings-attached'}) public rootClass: string;

  protected model: UIPStateModel;

  protected connectedCallback() {
    super.connectedCallback();
    this.bindEvents();
    this.model = new UIPStateModel();
    this.root && CSSUtil.addCls(this.root, this.rootClass);
  }

  protected disconnectedCallback(): void {
    this.unbindEvents();
    this.root && CSSUtil.removeCls(this.root, this.rootClass);
    super.disconnectedCallback();
  }

  protected bindEvents() {
    this.addEventListener('uip:change', this._onSettingChanged);
  }

  protected unbindEvents(): void {
    this.removeEventListener('uip:change', this._onSettingChanged);
  }

  protected _onSettingChanged(e: any) {
    (e.target as UIPSetting).applyTo(this.model);
    this.settings.forEach(setting => setting.updateFrom(this.model));

    this.dispatchChange(this.model.html);
  }

  protected get settings(): UIPSetting[] {
    return Array.from(this.getElementsByClassName(UIPSetting.is)) as UIPSetting[];
  }

  @bind
  public handleChange(e: CustomEvent): void {
    this.model.html = e.detail.markup;

    for (const setting of this.settings) {
      setting.updateFrom(this.model);
    }
  }
}

