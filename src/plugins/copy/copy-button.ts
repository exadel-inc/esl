import './copy-button.shape';

import {UIPPluginButton} from '../../core/button/plugin-button';

import type {AlertActionParams} from '@exadel/esl/modules/esl-alert/core';

export class UIPCopy extends UIPPluginButton {
  public static override is = 'uip-copy';
  public static override defaultTitle = 'Copy to clipboard';

  public static msgConfig: AlertActionParams = {
    text: 'Markup copied',
    cls: 'uip-alert-info'
  };

  protected override connectedCallback(): void {
    if (!navigator.clipboard) this.hidden = true;
    super.connectedCallback();
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.innerHTML = '';
  }

  public override onAction(): void {
    this.copy().then(() => this.dispatchMessage());
  }

  /** Dispatches success alert message */
  protected dispatchMessage(): void {
    const detail = (this.constructor as typeof UIPCopy).msgConfig;
    this.$$fire('esl:alert:show', {detail});
  }

  /** Copy model content to clipboard */
  public copy(): Promise<void> {
    return navigator.clipboard.writeText(this.model!.html);
  }
}
