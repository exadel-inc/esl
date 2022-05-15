import {ESLMediaRuleList} from '../esl-media-rule-list';
import {memoizeFn} from '../../../esl-utils/misc/memoize';

import type {RulePayloadParser} from '../esl-media-rule';

// Defines rule to create a unique hash of @media params
const hashFn = (...args: any[]): string | undefined => {
  let serialized = '';
  for (const arg of args) {
    if (typeof arg === 'function' && !arg.name) return undefined;
    serialized += typeof arg === 'function' ? arg.name : String(arg);
  }
  return serialized;
};

/**
 * Decorator to access active value of the passed {@link ESLMediaRuleList}
 * Applicable to both properties and methods
 *
 * @param query - media queries definitions separated by `|`
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
 *
 * @deprecated until testing phase completed
 */
export const media = memoizeFn(mediaDecorator, hashFn);


function mediaDecorator(query: string): PropertyDecorator;
function mediaDecorator<U>(query: string, parser: RulePayloadParser<U>): PropertyDecorator;
function mediaDecorator(mask: string, values: string): PropertyDecorator;
function mediaDecorator<U>(mask: string, values: string, parser: RulePayloadParser<U>): PropertyDecorator;
function mediaDecorator(...args: any[]): PropertyDecorator {
  const rules: ESLMediaRuleList = ESLMediaRuleList.parse(...args as Parameters<typeof ESLMediaRuleList.parse>);

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
