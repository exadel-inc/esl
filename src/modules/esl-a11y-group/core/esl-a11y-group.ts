import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement, attr, boolAttr} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';
import {ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP} from '../../esl-utils/dom/keys';
import {TraversingQuery} from '../../esl-traversing-query/core/esl-traversing-query';

export type GroupTarget = 'next' | 'prev' | 'current';

@ExportNs('A11yGroup')
export class ESLA11yGroup extends ESLBaseElement {
  public static is = 'esl-a11y-group';

  @attr({defaultValue: '::parent::child'}) public targets: string;
  @boolAttr({}) public clickOnActive: boolean;

  private _$targets?: HTMLElement[];

  /**
   * @returns {HTMLElement[]} targets of plugin
   */
  public get $targets(): HTMLElement[] {
    return this._$targets as HTMLElement[] || [];
  }
  public set $targets($targets: HTMLElement[]) {
    if (!$targets) return;
    this.unbindEvents();
    this._$targets = $targets;
    this.bindEvents();
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (!this.connected && oldVal === newVal) return;
    if (attrName === 'targets') this.updateTargets();
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.updateTargets();
  }
  protected disconnectedCallback() {
    this.unbindEvents();
  }

  protected bindEvents() {
    this.$targets.forEach((target) => target.addEventListener('keydown', this._onKeydown));
  }
  protected unbindEvents() {
    this.$targets.forEach((target) => target.removeEventListener('keydown', this._onKeydown));
  }

  protected updateTargets() {
    this.unbindEvents();
    this.$targets = TraversingQuery.all(this.targets, this) as [];
    this.bindEvents();
  }

  @bind
  protected _onKeydown(e: KeyboardEvent) {
    const target = e.target as HTMLElement;

    if ([ARROW_UP, ARROW_LEFT].includes(e.key)) {
      this.goTo('prev', target);
      e.preventDefault();
    }

    if ([ARROW_DOWN, ARROW_RIGHT].includes(e.key)) {
      this.goTo('next', target);
      e.preventDefault();
    }
  }

  public goTo(target: GroupTarget, from: HTMLElement | null = this.current()) {
    if (!from) return;
    const targetEl = this[target](from);
    if (!targetEl) return;
    targetEl.focus();
    this.clickOnActive && targetEl.click();
  }

  public next(trigger: HTMLElement) {
    const triggers = this.$targets;
    const index = triggers.indexOf(trigger);
    return triggers[(index + 1) % triggers.length];
  }

  public prev(trigger: HTMLElement) {
    const triggers = this.$targets;
    const index = triggers.indexOf(trigger);
    return triggers[(index - 1 + triggers.length) % triggers.length];
  }

  public current(): HTMLElement | null {
    const $active = document.activeElement as HTMLElement;
    return this.$targets.includes($active) ? $active : null;
  }
}
