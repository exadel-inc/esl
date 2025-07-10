import {listen} from '../../esl-utils/decorators/listen';
import {ESLEventUtils} from '../../esl-event-listener/core/api';
import {DelayedTask} from '../../esl-utils/async/delayed-task';

import {TAB} from '../../esl-utils/dom/keys';
import {handleFocusChain} from '../../esl-utils/dom/focus';

import type {ESLToggleable} from './esl-toggleable';

/** Focus flow behaviors */
export type ESLA11yType = 'none' | 'autofocus' | 'popup' | 'dialog' | 'modal';

let instance: ESLToggleableManager;
/** Focus manager for toggleable instances. Singleton. */
export class ESLToggleableManager {
  /** Active toggleable */
  protected active = new Set<ESLToggleable>();
  /** Focus scopes stack. Manager observes only top level scope. */
  protected stack: ESLToggleable[] = [];

  /** A delayed task for the focus management */
  private _focusTaskMng = new DelayedTask();

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

  /** Finds the related toggleable element for the specified element */
  public findRelated(element: HTMLElement | null | undefined): ESLToggleable | undefined {
    if (!element) return undefined;
    return this.stack.find((el) => el.contains(element));
  }

  /** Returns the stack of the toggleable elements for the specified element */
  public getChainFor(element: ESLToggleable | undefined): ESLToggleable[] {
    const stack: ESLToggleable[] = [];
    while (element) {
      if (stack.includes(element)) break;
      stack.push(element);
      element = this.findRelated(element.activator);
    }
    return stack;
  }

  /** Checks if the element is related to the specified toggleable open chain */
  public isRelates(element: HTMLElement, related: ESLToggleable): boolean {
    const scope = this.findRelated(element);
    return this.getChainFor(scope).includes(related);
  }

  /** Focuses on the first focusable element of the toggleable, if possible */
  protected grabFocus(element: ESLToggleable, options: FocusOptions = {preventScroll: true}): void {
    if (!element || !element.open) return;
    (element.$focusables[0] || element).focus(options);
  }

  /** Changes focus scope to the specified element. Previous scope saved in the stack. */
  public attach(element: ESLToggleable): void {
    this.active.add(element);
    if (element.a11y === 'none' && element !== this.current) return;
    // Make sure popup at least can be focused itself
    if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1');
    // Drop all popups on modal focus
    if (element.a11y === 'modal') {
      this.stack
        .filter((el) => el.a11y === 'popup')
        .forEach((el) => el.hide({initiator: 'focus'}));
    }
    // Remove the element from the stack and add it on top
    this.stack = this.stack.filter((el) => el !== element).concat(element);
    // Focus on the first focusable element
    this.queue(() => this.grabFocus(element));
  }

  /** Removes the specified element from the known focus scopes. */
  public detach(element: ESLToggleable, fallback?: HTMLElement | null): void {
    this.active.delete(element);
    if (fallback && (element === this.current || element.contains(document.activeElement))) {
      // Return focus to the fallback element
      this.queue(() => fallback.focus({preventScroll: true}));
    }
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

  /** Focus event handler for the focus management */
  @listen({event: 'focusin', target: document})
  protected _onFocusIn(e: FocusEvent): void {
    const {current} = this;
    if (!current || current.a11y === 'autofocus') return;
    // Check if the focus is still inside the element
    if (current.contains(document.activeElement)) return;

    // Hide popup on focusout
    if (current.a11y === 'popup') this.onOutsideInteraction(e, current);
    // Trap focus inside the element
    if (current.a11y === 'modal') {
      this._focusTaskMng.cancel();
      this.grabFocus(current);
    }
  }

  /** Catch all user interactions to initiate outside interaction handling */
  @listen({event: 'mouseup touchend keydown', target: document, capture: true})
  protected _onOutsideInteraction(e: Event): void {
    for (const el of this.active) {
      this.onOutsideInteraction(e, el);
    }
  }

  /**
   * Hides a toggleable element on outside interaction in case
   * it is an outside interaction and it is allowed
   */
  protected onOutsideInteraction(e: Event, el: ESLToggleable): void {
    if (!el.closeOnOutsideAction || !el.isOutsideAction(e)) return;
    // Used 10ms delay to decrease priority of the request but positive due to iOS issue
    el.hide({initiator: 'outsideaction', hideDelay: 10, event: e});
  }

  /** Queues delayed task of the focus management */
  private queue(cb: () => void): void {
    // 34ms = macrotask + at least 1 frame
    this._focusTaskMng.put(cb, 34);
  }
}
