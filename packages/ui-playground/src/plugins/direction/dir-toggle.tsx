import {listen, memoize} from '@exadel/esl/modules/esl-utils/decorators';
import {UIPPluginButton} from '../../core/button/plugin-button';
import type {UIPPreview} from '../../core/preview/preview';

import './dir-toggle.shape';

/** Text direction switcher button-plugin for UI Playground widget */
export class UIPDirSwitcher extends UIPPluginButton {
  public static override is = 'uip-dir-toggle';
  public static override defaultTitle = 'Switch direction';

  @memoize()
  get $preview(): UIPPreview {
    return this.$root!.querySelector('uip-preview')!;
  }

  @memoize()
  get $content(): HTMLElement {
    const type = this.constructor as typeof UIPDirSwitcher;
    return (
      <div class={type.is + '-figure'}>
        <span>L</span>
        <span>T</span>
        <span>R</span>
      </div>
    ) as HTMLElement;
  }
  @memoize()
  get $label(): HTMLElement {
    const type = this.constructor as typeof UIPDirSwitcher;
    return (<div class={type.is + '-label'}>{this.label || this.title}</div>) as HTMLElement;
  }

  protected override connectedCallback(): void {
    if (!this.$root || !this.$preview) return;
    this.$$attr('uip-settings-content', true);
    this.$$fire('uip:settings:invalidate');
    super.connectedCallback();
    this.appendChild(this.$label);
    this.appendChild(this.$content);
    this.onDirChange();
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    super.attributeChangedCallback(attrName, oldVal, newVal);
    if (attrName === 'label') this.$label.textContent = this.label || this.title;
  }

  protected override onAction(): void {
    if (!this.$preview) return;
    this.$preview.dir = this.$content.dir === 'rtl' ? 'ltr' : 'rtl';
  }

  @listen({
    event: 'uip:dirchange',
    target: ($this: UIPDirSwitcher) => $this.$preview,
  })
  protected onDirChange(): void {
    this.$content.dir = this.$preview.dir;
  }
}
