import {listen} from '../../esl-utils/decorators/listen';
import {afterNextRender} from '../../esl-utils/async/raf';
import {ESLEventUtils} from '../../esl-event-listener/core/api';

import {TAB} from '../../esl-utils/dom/keys';
import {handleFocusChain} from '../../esl-utils/dom/focus';

import type {ESLToggleable} from './esl-toggleable';

/** Focus flow behaviors */
export type ESLFocusFlowType = 'none' | 'grab' | 'loop' | 'chain';

let instance: ESLToggleableFocusManager;
/** Focus manager for toggleable instances. Singleton. */
export class ESLToggleableFocusManager {
  /** Focus scopes stack. Manger observes only top level scope. */
  protected stack: ESLToggleable[] = [];

  public constructor() {
    if (instance) return instance;
    ESLEventUtils.subscribe(this);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    instance = this;
  }

  /** Current focus scope */
  public get current(): ESLToggleable {
    return this.stack[this.stack.length - 1];
  }

  /** Checks if the element is in the known focus scopes */
  public has(element: ESLToggleable): boolean {
    return this.stack.includes(element);
  }

  /** Changes focus scope to the specified element. Previous scope saved in the stack. */
  public attach(element: ESLToggleable): void {
    if (element.focusBehavior === 'none' && element !== this.current) return;
    // Remove the element from the stack and add it on top
    this.stack = this.stack.filter((el) => el !== element).concat(element);
    // Focus on the first focusable element
    queueMicrotask(() => afterNextRender(() => element.focus({preventScroll: true})));
  }

  /** Removes the specified element from the known focus scopes. */
  public detach(element: ESLToggleable, fallback?: HTMLElement | null): void {
    if (element === this.current || document.activeElement === element || element.contains(document.activeElement)) {
      fallback && queueMicrotask(() => afterNextRender(() => fallback.focus({preventScroll: true})));
    }
    if (!this.has(element)) return;
    this.stack = this.stack.filter((el) => el !== element);
  }

  /** Keyboard event handler for the focus management */
  @listen({event: 'keydown', target: document})
  protected _onKeyDown(e: KeyboardEvent): void | boolean {
    if (!this.current || e.key !== TAB) return;

    const {focusBehavior, $focusables} = this.current;

    const $first = $focusables[0];
    const $last = $focusables[$focusables.length - 1];
    const $fallback = this.current.activator || this.current;

    if (focusBehavior === 'loop') return handleFocusChain(e, $first, $last);
    if (focusBehavior === 'chain') {
      if ($last && e.target !== (e.shiftKey ? $first : $last)) return;
      $fallback.focus();
      e.preventDefault();
    }
  }

  /** Focusout event handler */
  @listen({event: 'focusout', target: document})
  protected _onFocusOut(e: FocusEvent): void {
    const {current} = this;
    if (!current || !current.contains(e.target as HTMLElement)) return;
    afterNextRender(() => {
      // Check if the focus is still inside the element
      if (current === document.activeElement || current.contains(document.activeElement)) return;
      if (current.focusBehavior === 'chain') {
        current.hide({initiator: 'focusout', event: e});
      }
      if (current.focusBehavior === 'loop') {
        current.focus({preventScroll: true});
      }
    });
  }
}
