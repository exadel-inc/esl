import {createDeferred} from './promise/defered';
import {promisifyTimeout} from './promise/timeout';
import {promisifyTransition} from './promise/animation';
import {promisifyEvent, promisifyMarker} from './promise/event';
import {promisifiedTry, tryUntil} from './promise/try-until';
import {promisifyNextRender} from './promise/raf';

import type {AnyToAnyFnSignature} from '../misc/functions';
import type {Deferred} from './promise/defered';

/** Creates function type with the same signature but with the result type wrapped into promise */
export type PromisifyResultFn<F extends AnyToAnyFnSignature> = ((...args: Parameters<F>) => Promise<ReturnType<F> | void>);
export type {Deferred};

export {createDeferred, promisifyTimeout, promisifyEvent, promisifyMarker, promisifyNextRender, promisifiedTry, promisifyTransition};
export {tryUntil};

/**
 * Call async callback in a sequence passed number of times
 * Initial call starts as a microtask
 * @param callback - async chain function
 * @param count - count o calls
 * @returns sequence end promise
 */
export function repeatSequence<T>(callback: () => Promise<T>, count = 1): Promise<T> {
  if (count < 1) return Promise.reject();
  if (count === 1) return Promise.resolve().then(callback);
  return repeatSequence(callback, count - 1).then(callback);
}

/**
 * Safe wrap for Promise.resolve to use in Promise chain
 * @example
 * `const resolvedPromise = rejectedPromise.catch(resolvePromise);`
 */
export function resolvePromise<T>(arg: T | PromiseLike<T>): Promise<T> {
  return Promise.resolve(arg);
}

/**
 * Safe wrap for Promise.reject to use in Promise chain
 * @example
 * `const rejectedPromise = resolvedPromise.then(rejectPromise);`
 */
export function rejectPromise<T = never>(arg?: T | PromiseLike<T>): Promise<T> {
  return Promise.reject(arg);
}
