import type {
  ESLEventListener,
  ESLListenerHandler,
  ESLListenerCriteria,
  ESLListenerDescriptor
} from '../../esl-event-listener/core';

export interface ESLBaseComponent {
  /** Subscribes `handler` method marked with `@listen` decorator */
  $$on(handler: ESLListenerHandler): ESLEventListener[];
  /** Subscribes `handler` function by the passed DOM event descriptor {@link ESLListenerDescriptor} or event name */
  $$on<EType extends keyof ESLListenerEventMap>(
    event: EType | ESLListenerDescriptor<EType>,
    handler: ESLListenerHandler<ESLListenerEventMap[EType]>
  ): ESLEventListener[];

  /** Unsubscribes event listeners */
  $$off(...condition: ESLListenerCriteria[]): ESLEventListener[];

  /**
   * Dispatches component custom event on current DOM related element.
   * @param eventName - event name
   * @param eventInit - custom event init. See {@link CustomEventInit}
   */
  $$fire(eventName: string, eventInit?: CustomEventInit): boolean;

  /**
   * Gets or sets CSS classes for current DOM related element.
   * @param cls - CSS classes query {@link CSSClassUtils}
   * @param value - boolean to set CSS class(es) state or undefined to skip mutation
   * @returns current classes state or passed state
   */
  $$cls(cls: string, value?: boolean): boolean;

  /**
   * Gets or sets an attribute for the current DOM related element.
   * If the `value` param is undefined then skips mutation.
   * @param name - attribute name
   * @param value - string attribute value, boolean attribute state or `null` to delete attribute
   * @returns the current attribute value or previous value for mutation
   */
  $$attr(name: string, value?: null | boolean | string): string | null;
}
