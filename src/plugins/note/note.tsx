import React from 'jsx-dom';

import {listen, memoize} from '@exadel/esl/modules/esl-utils/decorators';
import {UIPPlugin} from '../../core/base/plugin';

/**
 * Note {@link UIPPlugin} custom element definition
 * Container that is associated with a snippet item {@link UIPSnippetsTitle}
 */
export class UIPNote extends UIPPlugin {
  public static override is = 'uip-note';
  public static title = 'Note: ';

  @memoize()
  protected get $inner(): HTMLElement {
    return (<div class={UIPNote.is + '-inner uip-plugin-inner uip-plugin-inner-bg'}></div>) as HTMLElement;
  }

  @memoize()
  protected get $title(): HTMLElement {
    return (<div class={UIPNote.is + '-title'}>{UIPNote.title}</div>) as HTMLElement;
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.appendChild(this.$title);
    this.appendChild(this.$inner);
  }

  protected override disconnectedCallback(): void {
    this.removeChild(this.$inner);
    this.removeChild(this.$title);
    super.disconnectedCallback();
  }

  /** Updates note content from the model state changes */
  @listen({event: 'uip:change', target: ($this: UIPNote) => $this.$root})
  protected _onRootStateChange(): void {
    this.writeContent();
  }

  protected writeContent(): void {
    this.$title.textContent = UIPNote.title;
    this.$inner.innerHTML = this.model!.note || '';
  }
}
