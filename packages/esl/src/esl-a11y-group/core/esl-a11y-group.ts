import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, boolAttr, listen} from '../../esl-utils/decorators';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
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
  public static override is = 'esl-a11y-group';

  /** Mapping of the keyboard keys to {@link GroupTarget} */
  public static KEY_MAP: Record<string, GroupTarget> = {
    [ARROW_UP]: 'prev',
    [ARROW_LEFT]: 'prev',
    [ARROW_DOWN]: 'next',
    [ARROW_RIGHT]: 'next'
  };

  /** Target elements multiple selector ({@link ESLTraversingQuery} syntax) */
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
    return ESLTraversingQuery.all(this.targets, this.$root) as HTMLElement[];
  }

  @listen({
    event: 'keydown',
    target: (target: ESLA11yGroup) => target.$root
  })
  protected _onKeydown(e: KeyboardEvent): void {
    const target = e.target as HTMLElement;
    if (!this.$targets.includes(target)) return;

    const groupTarget = (this.constructor as typeof ESLA11yGroup).KEY_MAP[e.key];
    if (!groupTarget) return;

    this.goTo(groupTarget, target);
    e.preventDefault();
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
