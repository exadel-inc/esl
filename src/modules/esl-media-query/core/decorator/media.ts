import {ESLMediaRuleList} from '../esl-media-rule-list';
import {memoizeFn} from '../../../esl-utils/misc/memoize';

// Defines rule to create a unique hash of @media params
const hashFn = (queries: string, values: string = queries): string => [queries, values].join('=>');

/**
 * Decorator to access active value of the passed {@link ESLMediaRuleList}
 * Applicable to both properties and methods
 *
 * @param queries - media queries definitions separated by `|`
 * @param values - values for passed queries (equals to `queries` by default)
 *
 * If decorates property - creates an accessor for a current {@link ESLMediaRuleList} instance value
 * @example
 * ```ts
 * @media('@sm|@md|@lg', 'sm|md|lg') public breakpoint: string;
 * ```
 *
 * If decorates a method then marks it as an auto-subscribable `ESLEventListener` definition
 * Shortcut for `@listen({ event: 'change', target: ESlMediaRuleList.fromTuple(...) })`
 * @example
 * ```ts
 * @media('@sm|@md|@lg', 'sm|md|lg')
 * protected onBreakpointChange(e: ESLMediaRuleListEvent) { ... }
 * ```
 */
export const media = memoizeFn(mediaDecorator, hashFn);

/** `@media` decorator inner implementation */
function mediaDecorator(queries: string, values: string = queries): PropertyDecorator {
  const rules: ESLMediaRuleList<string> = ESLMediaRuleList.parseTuple(values, queries);

  return function listener(target: HTMLElement, propertyKey: string, descriptor?: PropertyDescriptor): void {
    if (descriptor) {
      if (typeof descriptor.value !== 'function') {
        throw Error('@media decorator is applicable only to listener methods or properties');
      }
      Object.assign(descriptor.value, {
        auto: true,
        event: 'change',
        target: rules
      });
      // Allow collecting
      descriptor.enumerable = true;
      return;
    }

    Object.defineProperty(target, propertyKey, {
      get: () => rules.value,
      enumerable: true,
      configurable: true
    });
  };
}
