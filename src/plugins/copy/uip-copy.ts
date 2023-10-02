import './uip-copy.shape';

import {listen} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPlugin} from '../../core/base/plugin';

import type {AlertActionParams} from '@exadel/esl/modules/esl-alert/core';

export class UIPCopy extends UIPPlugin {
  public static override is = 'uip-copy';

  public static msgConfig: AlertActionParams = {
    text: 'Markup copied',
    cls: 'uip-alert-info'
  };

  /**
   * Creates uip-copy element
   * @param content - inner content of created element
   * @param cls - class name of created element
   */
  public static create(content?: string | Element | JSX.Element, cls: string = ''): UIPCopy {
    const $el = document.createElement(this.is) as UIPCopy;
    $el.className = cls;
    if (typeof content === 'string') $el.innerHTML = content;
    if (typeof content === 'object') $el.appendChild(content);
    return $el;
  }

  protected override connectedCallback(): void {
    if (!navigator.clipboard) this.hidden = true;
    super.connectedCallback();
    this.setAttribute('tabindex', '0');
    this.setAttribute('role', 'button');
    if (!this.hasAttribute('title')) {
      this.setAttribute('title', 'Copy to clipboard');
    }
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

  @listen('click')
  protected _onClick(e: PointerEvent): void {
    e.preventDefault();
    this.copy().then(() => this.dispatchMessage());
  }

  @listen('keydown')
  protected _onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') this.click();
  }
}
