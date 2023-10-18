import React from 'jsx-dom';

import {debounce} from '@exadel/esl/modules/esl-utils/async/debounce';
import {attr, decorate, listen, memoize} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPluginPanel} from '../../core/panel/plugin-panel';
import {UIPSetting} from './base-setting/base-setting';
import {SettingsIcon} from './settings.icon';

/**
 * Settings {@link UIPPlugin} custom element definition
 * Container for {@link UIPSetting}
 */
export class UIPSettings extends UIPPluginPanel {
  public static is = 'uip-settings';

  /** Attribute to set all inner {@link UIPSetting} settings' {@link UIPSetting#target} targets */
  @attr() public target: string;

  /** Header section block */
  @memoize()
  protected get $header(): HTMLElement {
    const type = this.constructor as typeof UIPSettings;
    const a11yLabel = this.collapsible ? 'Collapse/expand' + this.label : this.label;
    return (
      <div class={type.is + '-header uip-plugin-header ' + (this.label ? '' : 'no-label')}>
        <span class="uip-plugin-header-icon" title={this.label}><SettingsIcon/></span>
        <span class="uip-plugin-header-title">{this.label}</span>
        {this.collapsible ? <button type="button" class="uip-plugin-header-trigger" aria-label={a11yLabel} title={a11yLabel}/> : ''}
      </div>
    ) as HTMLElement;
  }

  @memoize()
  protected get $inner(): HTMLElement {
    const type = this.constructor as typeof UIPSettings;
    return (<div class={type.is + '-inner uip-plugin-inner uip-plugin-inner-bg'}>
      <esl-scrollbar class={type.is + '-scrollbar'} target="::next"/>
      {this.$container}
    </div>) as HTMLElement;
  }

  @memoize()
  protected get $container(): HTMLElement {
    const type = this.constructor as typeof UIPSettings;
    return (<div class={type.is + '-container esl-scrollable-content'}></div>) as HTMLElement;
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.appendChild(this.$header);
    this.appendChild(this.$inner);
    this.invalidate();
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.append(...this.settings);
    this.removeChild(this.$header);
    this.removeChild(this.$inner);
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    super.attributeChangedCallback(attrName, oldVal, newVal);
    if (attrName === 'label' || attrName === 'collapsible') {
      this.$header.remove();
      memoize.clear(this, '$header');
      this.insertAdjacentElement('afterbegin', this.$header);
    }
  }

  /** Collects all {@link UIPSetting} items */
  protected get settings(): UIPSetting[] {
    return Array.from(this.$container.childNodes).filter(UIPSetting.isSetting);
  }

  @decorate(debounce, 100)
  protected invalidate(): void {
    const items = [...this.childNodes].filter(UIPSetting.isSetting);
    const outside = items.filter((el) => el.parentElement !== this.$container);
    outside.forEach((el) => this.$container.appendChild(el));
  }

  @listen('uip:settings:invalidate')
  protected onInvalidate(): void {
    this.invalidate();
  }
}
