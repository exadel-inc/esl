import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {UIPRoot} from '../core/root';
import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';

export class UIPPreview extends ESLBaseElement {
  static is = 'uip-preview';
  protected playground: UIPRoot;

  protected connectedCallback() {
    super.connectedCallback();
    this.playground = this.closest(`${UIPRoot.is}`) as UIPRoot;
    if (this.playground) {
      this.playground.addEventListener('state:change', this.setMarkup);
    }
  }

  @bind
  protected setMarkup(e: CustomEvent): void {
    const {markup, source} = e.detail;
    if (source !== UIPPreview.is) {
      this.innerHTML = markup;
    }
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.playground && this.playground.removeEventListener('state:change', this.setMarkup);
  }
}

