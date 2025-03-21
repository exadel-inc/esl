import {onDocumentReady} from '../dom/ready';
import type {AnyToVoidFnSignature} from '../misc/functions';

/** Defer method execution to the next task with dom ready state precondition */
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
