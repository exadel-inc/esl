import React from 'jsx-dom';

import {isElement} from '@exadel/esl/modules/esl-utils/dom/api';
import {debounce} from '@exadel/esl/modules/esl-utils/async/debounce';
import {attr, boolAttr, decorate, listen, memoize} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPluginPanel} from '../../core/panel/plugin-panel';
import {ThemeToggleIcon} from '../theme/theme-toggle.icon';

import {UIPSetting} from './base-setting/base-setting';
import {ArrowIcon} from './arrow.icon';

/**
 * Settings {@link UIPPlugin} custom element definition
 * Container for {@link UIPSetting}
 */
export class UIPSettings extends UIPPluginPanel {
  public static is = 'uip-settings';
  public static observedAttributes = ['dir-toggle', 'theme-toggle', ...UIPPluginPanel.observedAttributes];

  /** Attribute to set all inner {@link UIPSetting} settings' {@link UIPSetting#target} targets */
  @attr() public target: string;

  @boolAttr() public dirToggle: boolean;
  @boolAttr() public themeToggle: boolean;

  /** @readonly internal settings items state marker */
  @boolAttr({readonly: true}) public inactive: boolean;

  protected override get $icon(): JSX.Element {
    return <ArrowIcon/>;
  }

  @memoize()
  protected override get $toolbar(): HTMLElement {
    const type = this.constructor as typeof UIPSettings;
    return (<div class={type.is + '-toolbar uip-plugin-header-toolbar'}>
      {this.themeToggle ? <uip-theme-toggle class={type.is + '-toolbar-option'}><ThemeToggleIcon/></uip-theme-toggle> : ''}
      {this.dirToggle ? <uip-dir-toggle class={type.is + '-toolbar-option'}/> : ''}
    </div>) as HTMLElement;
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
    return (<div class={`uip-plugin-content ${type.is}-container esl-scrollable-content`}/>) as HTMLElement;
  }

  @memoize()
  /** @returns HTMLElement[] - all internal items marked as settings item */
  protected get $items(): HTMLElement[] {
    return [...this.childNodes].filter(
      ($el: ChildNode): $el is HTMLElement => isElement($el) && $el.hasAttribute('uip-settings-content')
    );
  }

  /** @returns Element[] - active internal settings items */
  protected get $activeItems(): Element[] {
    return this.$items.filter(($el: Element) => !$el.classList.contains('uip-inactive-setting'));
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.appendChild(this.$header);
    this.appendChild(this.$inner);
    this.appendChild(this.$resize);
    this.invalidate();
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.append(...this.$items);
    this.removeChild(this.$header);
    this.removeChild(this.$inner);
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    super.attributeChangedCallback(attrName, oldVal, newVal);
    if (['label', 'collapsible', 'dir-toggle', 'theme-toggle'].includes(attrName)) {
      this.$header.remove();
      this.$toolbar.remove();
      memoize.clear(this, ['$header', '$toolbar']);
      this.insertAdjacentElement('afterbegin', this.$header);
    }
  }

  @decorate(debounce, 100)
  protected invalidate(): void {
    const outside = this.$items.filter((el) => el.parentElement !== this.$container);
    outside.forEach((el) => this.$container.appendChild(el));
  }

  @listen('uip:settings:invalidate')
  protected onInvalidate(): void {
    this.invalidate();
  }

  /** Handles internal settings items state change */
  @listen('uip:settings:state:change')
  @decorate(debounce, 100)
  protected onSettingsStateChange(): void {
    this.$$attr('inactive', !this.$activeItems.length);
  }
}
