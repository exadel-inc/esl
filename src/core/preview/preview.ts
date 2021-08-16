import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {UIPPlugin} from '../base/plugin';

/**
 * Custom element that displays active markup.
 * @extends UIPPlugin
 */
export class UIPPreview extends UIPPlugin {
  static is = 'uip-preview';

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
}
