import React from 'jsx-dom';

import {attr, boolAttr, memoize} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPlugin} from '../../core/base/plugin';
import {UIPSetting} from './base-setting/base-setting';

const isSetting = (el: Node): el is UIPSetting => el instanceof UIPSetting;

/**
 * Settings {@link UIPPlugin} custom element definition
 * Container for {@link UIPSetting}
 */
export class UIPSettings extends UIPPlugin {
  public static is = 'uip-settings';

  /** Attribute to set all inner {@link UIPSetting} settings' {@link UIPSetting#target} targets */
  @attr() public target: string;

  /** Marker to make enable toggle collapse action for section header */
  @boolAttr() public collapsible: boolean;

  /** Visible label */
  @attr({defaultValue: 'Settings'}) public label: string;

  /** Header section block */
  @memoize()
  protected get $header(): HTMLElement {
    const type = this.constructor as typeof UIPSettings;
    return (
      <div class={type.is + '-header ' + (this.label ? '' : 'no-label')}>
        <span class={type.is + '-header-title'}>{this.label}</span>
        {this.collapsible ? <button class={type.is + '-header-trigger'} aria-label="Collapse/expand"/> : ''}
      </div>
    ) as HTMLElement;
  }

  @memoize()
  protected get $inner(): HTMLElement {
    const type = this.constructor as typeof UIPSettings;
    return (
      <div class={type.is + '-inner uip-plugin-inner esl-scrollable-content'}>
        <esl-scrollbar target="::prev(.settings-list)"></esl-scrollbar>
      </div>
    ) as HTMLElement;
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('uip-settings-holder', '');
    this.$inner.append(...this.settings);
    this.appendChild(this.$header);
    this.appendChild(this.$inner);
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.append(...this.settings);
    this.removeChild(this.$header);
    this.removeChild(this.$inner);
  }

  public add(setting: UIPSetting): boolean {
    if (setting.parentElement === this.$inner) return false;
    this.$inner.appendChild(setting);
    return true;
  }

  /** Collects all {@link UIPSetting} items */
  protected get settings(): UIPSetting[] {
    return [
      ...Array.from(this.childNodes).filter(isSetting),
      ...Array.from(this.$inner.childNodes).filter(isSetting),
    ];
  }
}
