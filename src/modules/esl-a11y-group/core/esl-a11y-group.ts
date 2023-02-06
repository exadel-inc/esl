import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement, attr, boolAttr} from '../../esl-base-element/core';
import {TraversingQuery} from '../../esl-traversing-query/core';
import {bind} from '../../esl-utils/decorators/bind';
import {ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP} from '../../esl-utils/dom/keys';

/** Relative targeting type definition */
export type GroupTarget = 'next' | 'prev' | 'current';

/**
 * ESLA11yGroup component
 * @author Julia Murashko
 *
 * ESLA11yGroup - helper custom element that adds a11y group behavior to targets.
 */
@ExportNs('A11yGroup')
export class ESLA11yGroup extends ESLBaseElement {
  public static is = 'esl-a11y-group';

  /** Target elements multiple selector ({@link TraversingQuery} syntax) */
  @attr({defaultValue: '::child'}) public targets: string;

  /** Activates target (via click event) on selection */
  @boolAttr({}) public activateSelected: boolean;
  /** Prevents scroll when target receives focus */
  @boolAttr({}) public preventScroll: boolean;

  /** @returns HTMLElement root element of the group */
  public get $root(): HTMLElement | null {
    return this.parentElement;
  }
  /** @returns HTMLElement[] targets of the group */
  public get $targets(): HTMLElement[] {
    if (!this.$root) return [];
    return TraversingQuery.all(this.targets, this.$root) as HTMLElement[];
  }

  protected connectedCallback(): void {
    super.connectedCallback();
    this.bindEvents();
  }
  protected disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unbindEvents();
  }

  protected bindEvents(): void {
    this.$root?.addEventListener('keydown', this._onKeydown);
  }
  protected unbindEvents(): void {
    this.$root?.removeEventListener('keydown', this._onKeydown);
  }

  @bind
  protected _onKeydown(e: KeyboardEvent): void {
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

  /** Go to the target from the passed element or currently focused target by default */
  public goTo(target: GroupTarget, from: HTMLElement | null = this.current()): void {
    if (!from) return;
    const targetEl = this[target](from);
    if (!targetEl) return;
    targetEl.focus({preventScroll: this.preventScroll});
    this.activateSelected && targetEl.click();
  }

  /** @returns HTMLElement next target fot trigger */
  public next(trigger: HTMLElement): HTMLElement | undefined {
    const triggers = this.$targets;
    const index = triggers.indexOf(trigger);
    return triggers[(index + 1) % triggers.length];
  }

  /** @returns HTMLElement previous target fot trigger */
  public prev(trigger: HTMLElement): HTMLElement | undefined {
    const triggers = this.$targets;
    const index = triggers.indexOf(trigger);
    return triggers[(index - 1 + triggers.length) % triggers.length];
  }

  /** @returns HTMLElement currently focused element from targets */
  public current(): HTMLElement | null {
    const $active = document.activeElement as HTMLElement;
    return this.$targets.includes($active) ? $active : null;
  }
}

declare global {
  export interface ESLLibrary {
    A11yGroup: typeof ESLA11yGroup;
  }
  export interface HTMLElementTagNameMap {
    'esl-a11y-group': ESLA11yGroup;
  }
}
