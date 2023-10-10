import React from 'jsx-dom';

import {ESLMediaQuery} from '@exadel/esl/modules/esl-media-query/core';
import {debounce} from '@exadel/esl/modules/esl-utils/async/debounce';
import {attr, boolAttr, decorate, listen, memoize} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPlugin} from '../../core/base/plugin';
import {UIPSetting} from './base-setting/base-setting';
import {SettingsIcon} from './settings.icon';

/**
 * Settings {@link UIPPlugin} custom element definition
 * Container for {@link UIPSetting}
 */
export class UIPSettings extends UIPPlugin {
  public static is = 'uip-settings';
  public static observedAttributes: string[] = ['horizontal', 'collapsed', ...UIPPlugin.observedAttributes];

  /** Attribute to set all inner {@link UIPSetting} settings' {@link UIPSetting#target} targets */
  @attr() public target: string;

  /** Marker to collapse editor area */
  @boolAttr() public collapsed: boolean;

  /** Marker to make enable toggle collapse action for section header */
  @boolAttr() public collapsible: boolean;

  /** Media Query or marker to display UIPSettings horizontally */
  @attr({defaultValue: 'aot all'}) public horizontal: string;

  /** Visible label */
  @attr({defaultValue: 'Settings'}) public label: string;

  /** Header section block */
  @memoize()
  protected get $header(): HTMLElement {
    const type = this.constructor as typeof UIPSettings;
    const a11yLabel = this.collapsible ? 'Collapse/expand' + this.label : this.label;
    return (
      <div class={type.is + '-header ' + (this.label ? '' : 'no-label')}>
        <span class={type.is + '-header-icon'} title={this.label}><SettingsIcon/></span>
        <span class={type.is + '-header-title'}>{this.label}</span>
        {this.collapsible ? <button type="button" class={type.is + '-header-trigger'} aria-label={a11yLabel} title={a11yLabel}/> : ''}
      </div>
    ) as HTMLElement;
  }

  @memoize()
  protected get $inner(): HTMLElement {
    const type = this.constructor as typeof UIPSettings;
    return (<div class={type.is + '-inner uip-plugin-inner'}>
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
    this._onHorizontalModeChange();
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
    if (attrName === 'horizontal') {
      this.$$off(this._onHorizontalModeChange);
      this.$$on(this._onHorizontalModeChange);
      this._onHorizontalModeChange();
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

  @listen({
    event: 'change',
    target: (settings: UIPSettings) => ESLMediaQuery.for(settings.horizontal)
  })
  protected _onHorizontalModeChange(): void {
    const isHorizontal = ESLMediaQuery.for(this.horizontal).matches;
    this.classList.toggle('horizontal', isHorizontal);
    this.root?.classList.toggle('horizontal-settings', isHorizontal);
  }

  @listen({
    event: 'click',
    selector: `.${UIPSettings.is}-header-trigger`,
  })
  protected _onClick(): void {
    if (this.collapsible) this.collapsed = !this.collapsed;
  }
}
