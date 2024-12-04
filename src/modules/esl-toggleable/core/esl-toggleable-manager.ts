import {listen} from '../../esl-utils/decorators/listen';
import {afterNextRender} from '../../esl-utils/async/raf';
import {ESLEventUtils} from '../../esl-event-listener/core/api';

import {TAB} from '../../esl-utils/dom/keys';
import {handleFocusChain} from '../../esl-utils/dom/focus';

import type {ESLToggleable} from './esl-toggleable';

/** Focus flow behaviors */
export type ESLA11yType = 'none' | 'autofocus' | 'popup' | 'dialog' | 'modal';

let instance: ESLToggleableA11yManager;
/** Focus manager for toggleable instances. Singleton. */
export class ESLToggleableA11yManager {
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

  /** Checks if the element or its child has focus */
  public hasFocus(element: ESLToggleable): boolean {
    return element === document.activeElement || element.contains(document.activeElement);
  }

  protected queryFocusTask(element?: HTMLElement | null): void {
    if (!element) return;
    queueMicrotask(() => afterNextRender(() => element.focus({preventScroll: true})));
  }

  /** Changes focus scope to the specified element. Previous scope saved in the stack. */
  public attach(element: ESLToggleable): void {
    if (element.a11y === 'none' && element !== this.current) return;
    // Make sure popup at least can be focused itself
    if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1');
    // Focus on the first focusable element
    this.queryFocusTask(element.$focusables[0] || element);
    // Drop all popups on modal focus
    if (element.a11y === 'modal') {
      this.stack
        .filter((el) => el.a11y === 'popup')
        .forEach((el) => el.hide({initiator: 'focus'}));
    }
    // Remove the element from the stack and add it on top
    this.stack = this.stack.filter((el) => el !== element).concat(element);
  }

  /** Removes the specified element from the known focus scopes. */
  public detach(element: ESLToggleable, fallback?: HTMLElement | null): void {
    if (element === this.current || this.hasFocus(element)) this.queryFocusTask(fallback);
    if (!this.has(element)) return;
    this.stack = this.stack.filter((el) => el !== element);
  }

  /** Keyboard event handler for the focus management */
  @listen({event: 'keydown', target: document})
  protected _onKeyDown(e: KeyboardEvent): void | boolean {
    if (!this.current || e.key !== TAB) return;

    if (this.current.a11y === 'none' || this.current.a11y === 'autofocus') return;

    const {$focusables} = this.current;
    const $first = $focusables[0];
    const $last = $focusables[$focusables.length - 1];
    const $fallback = this.current.activator || this.current;

    if (this.current.a11y === 'popup') {
      if ($last && e.target !== (e.shiftKey ? $first : $last)) return;
      $fallback.focus();
      e.preventDefault();
    }
    if (this.current.a11y === 'modal' || this.current.a11y === 'dialog') {
      handleFocusChain(e, $first, $last);
    }
  }

  /** Focusout event handler */
  @listen({event: 'focusout', target: document})
  protected _onFocusOut(e: FocusEvent): void {
    const {current} = this;
    if (!current || !current.contains(e.target as HTMLElement)) return;
    afterNextRender(() => {
      // Check if the focus is still inside the element
      if (this.hasFocus(current)) return;
      if (current.a11y === 'popup') {
        current.hide({initiator: 'focusout', event: e});
      }
      if (current.a11y === 'modal') {
        const $focusable = current.$focusables[0] || current;
        $focusable.focus({preventScroll: true});
      }
    });
  }
}
