import './uip-dir.shape';

import {listen, memoize} from '@exadel/esl/modules/esl-utils/decorators';
import {UIPPluginButton} from '../../core/button/plugin-button';
import type {UIPPreview} from '../../core/preview/preview';

export class UIPDirSwitcher extends UIPPluginButton {
  public static override is = 'uip-toggle-dir';
  public static override defaultTitle = 'Switch direction (RTL/LTR)';

  @memoize()
  get $preview(): UIPPreview {
    return this.root!.querySelector('uip-preview')!;
  }

  protected override connectedCallback(): void {
    if (!this.root || !this.$preview) return;
    super.connectedCallback();
    this.onDirChange();
  }

  protected override onAction(): void {
    if (!this.$preview) return;
    this.$preview.dir = this.dir === 'rtl' ? 'ltr' : 'rtl';
  }

  @listen({
    event: 'uip:dirchange',
    target: ($this: UIPDirSwitcher) => $this.$preview,
  })
  protected onDirChange(): void {
    this.dir = this.$preview.dir;
  }
}
