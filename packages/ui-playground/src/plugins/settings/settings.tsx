import React from 'jsx-dom';

import {debounce} from '@exadel/esl/modules/esl-utils/async/debounce';
import {attr, boolAttr, decorate, listen, memoize} from '@exadel/esl/modules/esl-utils/decorators';
import {parseBoolean, toBooleanAttribute} from '@exadel/esl/modules/esl-utils/misc/format';

import {UIPPluginPanel} from '../../core/panel/plugin-panel';
import {ThemeToggleIcon} from '../theme/theme-toggle.icon';

import {UIPDefaults} from '../../core/config/config';
import {SettingsIcon} from './settings.icon';

import type {UIPSetting} from './base-setting/base-setting';

/**
 * Settings {@link UIPPlugin} custom element definition
 * Container for {@link UIPSetting}
 */
export class UIPSettings extends UIPPluginPanel {
  public static is = 'uip-settings';
  public static observedAttributes = ['dir-toggle', 'theme-toggle', ...UIPPluginPanel.observedAttributes];

  /** Attribute to set all inner {@link UIPSetting} settings' {@link UIPSetting#target} targets */
  @attr() public target: string;

  /** Marker to display copy widget */
  @attr({defaultValue: () => UIPDefaults.for('settings').label}) public label: string;

  /** Marker to display direction toggle button (ltr/rtl) */
  @attr({parser: parseBoolean, serializer: toBooleanAttribute, defaultValue: () => UIPDefaults.for('settings').dirToggle})
  public dirToggle: boolean;

  /** Marker to display theme toggle button (light/dark) */
  @attr({parser: parseBoolean, serializer: toBooleanAttribute, defaultValue: () => UIPDefaults.for('settings').themeToggle})
  public themeToggle: boolean;

  /** Marker to make settings panel hidden when no active settings found */
  @attr({parser: parseBoolean, serializer: toBooleanAttribute, defaultValue: () => UIPDefaults.for('settings').hideable})
  public hideable: boolean;

  /** Marker to make enable toggle collapse action for section header. @see UIPPluginPanel */
  @attr({parser: parseBoolean, serializer: toBooleanAttribute, defaultValue: () => UIPDefaults.for('settings').collapsible})
  public collapsible: boolean;

  /** Marker that indicates resizable state of the panel. @see UIPPluginPanel */
  @attr({parser: parseBoolean, serializer: toBooleanAttribute, defaultValue: () => UIPDefaults.for('settings').resizable})
  public resizable: boolean;

  /** @readonly internal settings items state marker */
  @boolAttr({readonly: true}) public inactive: boolean;

  protected override get $icon(): JSX.Element {
    return <SettingsIcon/>;
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
  protected get $items(): UIPSetting[] {
    return [...this.querySelectorAll('[uip-settings-content]')] as UIPSetting[];
  }

  /** @returns Element[] - active internal settings items */
  protected get $activeItems(): Element[] {
    return this.$items.filter(($el: Element) => !$el.classList.contains('uip-inactive-setting'));
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.hideable = this.hideable!;

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
    memoize.clear(this, '$items');
    const outside = this.$items.filter((el) => el.parentElement !== this.$container);
    outside.forEach((el) => this.$container.appendChild(el));
    this.onSettingsStateChange();
  }

  @listen('uip:settings:invalidate')
  protected onInvalidate(): void {
    this.invalidate();
  }

  /** Handles internal settings items state change */
  @listen('uip:settings:state:change')
  protected onSettingsStateChange(): void {
    this.$$attr('inactive', !this.$activeItems.length);
  }
}
