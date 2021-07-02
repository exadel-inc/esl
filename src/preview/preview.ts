import {memoize} from '@exadel/esl';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {UIPPlugin} from '../core/plugin';

export class UIPPreview extends UIPPlugin {
  static is = 'uip-preview';

  @memoize()
  get $inner() {
    const $inner = document.createElement('div');
    $inner.classList.add('uip-preview-inner');
    return $inner;
  }

  @bind
  protected _onRootStateChange(): void {
    this.$inner.innerHTML = this.model!.html;
    this.innerHTML = '';
    this.appendChild(this.$inner);
  }
}
