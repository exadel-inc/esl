import {ESLBaseElement, attr} from '@esl/element';
import {
  bind,
  ready,
  ArrayUtils,
  memoize,
  isIE
} from '@esl/utils';

export class ESLDemoMarquee extends ESLBaseElement {
  static is = 'esl-d-marquee';
  static STARS_SEL = [
    '#esl-logo-shield-stars > path',
    '#esl-logo-border-inner-stars > path',
    '#esl-logo-border-outer-stars > path',
    '#esl-logo-wrench-left-stars > path',
    '#esl-logo-wrench-right-stars > path'
  ].join(',');

  @attr({defaultValue: '4'}) public targetsNumber: string;
  @attr({defaultValue: '3000'}) public iterationTime: string;

  private _$active: HTMLElement[] = [];
  private _animateTimer: number = 0;

  @ready
  protected connectedCallback(): void {
    super.connectedCallback();
    if (isIE) return;
    this.startAnimation();
  }
  protected disconnectedCallback(): void {
    this.stopAnimation();
    super.disconnectedCallback();
  }

  @memoize()
  public get $stars(): HTMLElement[] {
    return Array.from(document.querySelectorAll((this.constructor as typeof ESLDemoMarquee).STARS_SEL));
  }
  public get $randomStar(): HTMLElement {
    const index = Math.floor(Math.random() * this.$stars.length);
    return this.$stars[index];
  }

  public startAnimation(): void {
    memoize.clear(this, '$stars');
    this.stopAnimation();
    if (this.$stars.length < 2) return;
    this._animateTimer = window.setTimeout(this._onIteration, +this.iterationTime);
  }
  public stopAnimation(): void {
    this._animateTimer && window.clearTimeout(this._animateTimer);
  }

  @bind
  protected _onIteration(): void {
    const $candidates = ArrayUtils.range(+this.targetsNumber, () => this.$randomStar);
    this._$active.forEach((star) => star.classList.remove('animate'));
    $candidates.forEach((star: HTMLElement) => star.classList.add('animate'));
    this._$active = $candidates;

    this._animateTimer = window.setTimeout(this._onIteration, +this.iterationTime);
  }
}
