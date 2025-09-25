import {onDocumentReady} from '../dom/ready';
import type {AnyToVoidFnSignature} from '../misc/functions';

/**
 * `@ready` decorator: defers method execution until DOM is ready, then runs it in the next macrotask.
 * - Wraps a void method so each call schedules execution (arguments captured) after `DOMContentLoaded`
 * - If DOM already ready, still defers via `setTimeout(..., 0)` (next task boundary)
 * - Multiple calls before readiness schedule multiple executions (no coalescing)
 * - Return value is always `undefined` (original result not obtainable due to async defer)
 * - Exceptions inside deferred callback surface asynchronously (not caught)
 *
 * @throws TypeError when applied to a non-method
 */
export function ready<T extends AnyToVoidFnSignature>(target: any,
                                                      propertyKey: string,
                                                      descriptor: TypedPropertyDescriptor<T>): void {
  if (!descriptor || typeof descriptor.value !== 'function') {
    throw new TypeError('Only class methods can be decorated via document ready decorator');
  }
  const fn = descriptor.value;
  descriptor.value = function (...arg: any[]) {
    onDocumentReady(() => fn.call(this, ...arg));
  } as T;
}
