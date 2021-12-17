import {ready} from '../../../src/modules/esl-utils/decorators/ready';
import {attr} from '../../../src/modules/esl-base-element/decorators/attr';
import {bind} from '../../../src/modules/esl-utils/decorators/bind';
import {boolAttr, ESLBaseElement} from '../../../src/modules/esl-base-element/core';
import {TraversingQuery} from '../../../src/modules/all';

export class ESLDemoRTLSwitcher extends ESLBaseElement {
  static is = 'esl-d-rtl-switcher';

  protected _$target: HTMLElement | undefined;

  @boolAttr({readonly: true}) public active: boolean;

  @attr({defaultValue: '::next'}) public target: string;

  @ready
  protected connectedCallback() {
    this.bindEvents();
    this.updateTarget();
    this.setInitialDirection();
    super.connectedCallback();
  }

  @ready
  protected disconnectedCallback() {
    this.unbindEvents();
    super.disconnectedCallback();
  }

  public get $target(): HTMLElement | undefined {
    return this._$target;
  }

  public set $target(targetElement: HTMLElement | undefined) {
    this._$target = targetElement;
  }

  public get $active(): boolean {
    return this.$target?.dir === 'rtl';
  }

  protected updateTarget() {
    if (!this.target) return;
    this.$target = TraversingQuery.first(this.target, this) as HTMLElement;
  }

  protected bindEvents() {
    this.addEventListener('click', this._onClick);
  }

  protected unbindEvents() {
    this.removeEventListener('click', this._onClick);
  }

  protected setInitialDirection() {
    this.toggleRTLDirection(false);
  }

  public toggleRTLDirection(isRTLTargetDirection: boolean = !this.active) {
    this.$target?.setAttribute('dir', isRTLTargetDirection ? 'rtl' : 'ltr');
  }

  @bind
  protected _onClick(event: MouseEvent) {
    if (!this.$target) return;
    event.preventDefault();
    this.toggleRTLDirection();
    this.updateState();
  }

  public updateState() {
    this.toggleAttribute('active', this.$active);
  }
}
