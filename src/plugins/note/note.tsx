import React from 'jsx-dom';

import {listen, memoize} from '@exadel/esl/modules/esl-utils/decorators';
import {UIPPlugin} from '../../core/base/plugin';

export class UIPNote extends UIPPlugin {
  static is = 'uip-note';
  static title = 'Note! ';

  @memoize()
  protected get $inner(): HTMLElement {
    return (<div class={UIPNote.is + '-inner uip-plugin-inner uip-plugin-inner-bg'}></div>) as HTMLElement;
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.appendChild(this.$inner);
  }

  protected override disconnectedCallback(): void {
    this.removeChild(this.$inner);
    super.disconnectedCallback();
  }

  /** Updates note content from the model state changes */
  @listen({event: 'uip:change', target: ($this: UIPNote) => $this.$root})
  protected _onRootStateChange(): void {
    this.writeContent();
  }

  protected writeContent(): void {
    const content = `<span><b>${UIPNote.title}</b></span><span>${this.model!.note}</span>`;
    this.$inner.innerHTML = content;
  }
}
