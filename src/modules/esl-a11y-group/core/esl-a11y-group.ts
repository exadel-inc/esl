import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement, attr, boolAttr} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';
import {ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP} from '../../esl-utils/dom/keys';
import {TraversingQuery} from '../../esl-traversing-query/core/esl-traversing-query';

export type GroupTarget = 'next' | 'prev' | 'current';

@ExportNs('A11yGroup')
export class ESLA11yGroup extends ESLBaseElement {
  public static is = 'esl-a11y-group';

  @attr({defaultValue: '::child'}) public targets: string;
  @boolAttr({}) public activateSelected: boolean;

  /**
   * @returns {HTMLElement} root element of this
   */
  public get $root(): HTMLElement {
    return this.parentElement as HTMLElement;
  }
  /**
   * @returns {HTMLElement[]} targets of plugin
   */
  public get $targets(): HTMLElement[] {
    return TraversingQuery.all(this.targets, this.$root) as [];
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.bindEvents();
  }
  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindEvents();
  }

  protected bindEvents() {
    this.$root.addEventListener('keydown', this._onKeydown);
  }
  protected unbindEvents() {
    this.$root.removeEventListener('keydown', this._onKeydown);
  }

  @bind
  protected _onKeydown(e: KeyboardEvent) {
    const target = e.target as HTMLElement;

    if (!this.$targets.includes(target)) return;

    if ([ARROW_UP, ARROW_LEFT].includes(e.key)) {
      this.goTo('prev', target);
      e.preventDefault();
    }

    if ([ARROW_DOWN, ARROW_RIGHT].includes(e.key)) {
      this.goTo('next', target);
      e.preventDefault();
    }
  }

  /**
   * Go to target from passed element or current focused target by default
   */
  public goTo(target: GroupTarget, from: HTMLElement | null = this.current()) {
    if (!from) return;
    const targetEl = this[target](from);
    if (!targetEl) return;
    targetEl.focus();
    this.activateSelected && targetEl.click();
  }

  /**
   * @returns {HTMLElement} next target fot trigger
   */
  public next(trigger: HTMLElement) {
    const triggers = this.$targets;
    const index = triggers.indexOf(trigger);
    return triggers[(index + 1) % triggers.length];
  }

  /**
   * @returns {HTMLElement} previous target fot trigger
   */
  public prev(trigger: HTMLElement): HTMLElement | undefined {
    const triggers = this.$targets;
    const index = triggers.indexOf(trigger);
    return triggers[(index - 1 + triggers.length) % triggers.length];
  }

  /**
   * @returns {HTMLElement} current focused element from targets
   */
  public current(): HTMLElement | null {
    const $active = document.activeElement as HTMLElement;
    return this.$targets.includes($active) ? $active : null;
  }
}
