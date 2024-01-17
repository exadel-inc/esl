import {ESLMixinElement} from '@exadel/esl/modules/esl-mixin-element/core';
import {listen, prop} from '@exadel/esl/modules/esl-utils/decorators';
import {ENTER} from '@exadel/esl/modules/esl-utils/dom/keys';
import {isReducedMotion} from '@exadel/esl/modules/esl-utils/environment';

export class ESLDMarqueeSecretLink extends ESLMixinElement {
  static override is = 'esl-d-marquee-secret-link';

  public override $host: HTMLAnchorElement;

  @prop('logo-animated') public cls: string;
  @prop(1000) public duration: number;

  private _processDefaultOnce: boolean = false;

  public navigate(): void {
    this._processDefaultOnce = true;
    this.$host.click();
  }

  public activate(): void {
    if (!isReducedMotion) this.$$cls(this.cls, true);
    setTimeout(() => this.navigate(), isReducedMotion ? 0 : this.duration);
  }

  @listen('click')
  protected _onClick(e: MouseEvent): void {
    if (!this._processDefaultOnce) e.preventDefault();
    this._processDefaultOnce = false;
  }

  @listen('keydown dblclick')
  protected _onKeyDown(e: KeyboardEvent): void {
    if (e.type === 'keydown' && e.key !== ENTER) return;
    e.preventDefault();
    this.activate();
  }
}
