import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {UIPPlugin} from '../base/plugin';

/**
 * Custom element that displays active markup.
 * @extends UIPPlugin
 */
export class UIPPreview extends UIPPlugin {
  static is = 'uip-preview';

  protected connectedCallback() {
    super.connectedCallback();

    this.bindEvents();
  }

  @bind
  protected _onRootStateChange(): void {
    if (this.$inner.parentElement === this) this.removeChild(this.$inner);
    this.$inner.innerHTML = this.model!.html;
    this.appendChild(this.$inner);
  }

  protected bindEvents() {
    this.root?.addEventListener('uip:configchange', this._onRootConfigChange);
  }

  protected unbindEvents() {
    this.root?.removeEventListener('uip:configchange', this._onRootConfigChange);
  }

  /** Callback to catch direction changes from {@link UIPRoot}. */
  @bind
  protected _onRootConfigChange(e: CustomEvent) {
    console.log(e);
    if (e.detail.attribute !== 'direction') return false;
    this.$inner.dir = e.detail.value;
  }

  protected disconnectedCallback() {
    if (this.$inner.parentElement === this) this.removeChild(this.$inner);
    this.unbindEvents();
    super.disconnectedCallback();
  }
}
