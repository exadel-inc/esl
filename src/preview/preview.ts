import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {UIPRoot} from '../core/root';
import {ESLBaseElement, attr} from '@exadel/esl/modules/esl-base-element/core';

export class UIPPreview extends ESLBaseElement {
  static is = 'uip-preview';
  protected playground: UIPRoot;

  @attr({defaultValue: 'Preview'}) public label: string;

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
    if (source === UIPPreview.is) return;
    if (this.closest('.preview-wrapper')) {
      this.innerHTML = markup;
    } else {
      this.renderWrapper(markup);
    }
  }

  protected renderWrapper(markup: string) {
    const $wrapper = document.createElement('div');
    $wrapper.className = 'preview-wrapper';

    $wrapper.innerHTML = `
        <span class="section-name">${this.label}</span>
        <uip-preview> ${markup} </uip-preview>`;
    this.parentElement?.replaceChild($wrapper, this);
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.playground && this.playground.removeEventListener('state:change', this.setMarkup);
  }
}

