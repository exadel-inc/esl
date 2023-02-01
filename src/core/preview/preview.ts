import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {UIPPlugin} from '../base/plugin';

/**
 * Preview {@link UIPPlugin} custom element definition
 * Element that displays active markup
 * @extends UIPPlugin
 */
export class UIPPreview extends UIPPlugin {
  static is = 'uip-preview';
  static observedAttributes: string[] = ['resizable'];

  /** Changes preview markup from state changes */
  @bind
  protected _onRootStateChange(): void {
    if (this.$inner.parentElement === this) this.removeChild(this.$inner);
    this.$inner.innerHTML = this.model!.html;
    this.appendChild(this.$inner);
  }

  protected disconnectedCallback() {
    if (this.$inner.parentElement === this) this.removeChild(this.$inner);
    super.disconnectedCallback();
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (attrName === 'resizable' && newVal === null) {
      this.clearInlineSize();
      this.$inner.classList.remove('resizable');
    } else {
      this.$inner.classList.add('resizable');
    }
  }

  /** Resets element both inline height and width properties */
  protected clearInlineSize() {
    this.$inner.style.removeProperty('height');
    this.$inner.style.removeProperty('width');
  }
}
