import {isArrayLike} from '../misc/object';

import type {ArrayLike} from '../misc/object';

export type AttributeTarget = {$host: Element};
export type AttributeDecorator = (target: Element | AttributeTarget, propName: string) => void;

/** @returns if attribute presented */
export function hasAttr($el: Element | AttributeTarget | undefined | null, name: string): boolean {
  if (!$el) return false;
  if ('$host' in $el) $el = $el.$host;
  return $el.hasAttribute(name);
}

/** @returns attribute or passed fallback value. Identical to getAttribute by default */
export function getAttr($el: Element | AttributeTarget | undefined | null, name: string): string | null;
export function getAttr<T>($el: Element | AttributeTarget | undefined | null, name: string, fallback: T): string | T;
export function getAttr($el: Element | AttributeTarget | undefined | null, name: string, fallback: string | null = null): string | null {
  if (!$el) return null;
  if ('$host' in $el) $el = $el.$host;
  const value = $el.getAttribute(name);
  return value === null ? fallback : value;
}

/** Sets attribute */
export function setAttr<T extends Element | AttributeTarget>(
  $el: ArrayLike<T> | Element | AttributeTarget | undefined | null,
  name: string,
  value: undefined | null | boolean | string
): void {
  if (isArrayLike($el)) {
    Array.from($el).forEach((element: T) => setAttr(element, name, value));
    return;
  }
  if (!$el) return;
  if ('$host' in $el) $el = $el.$host;
  if (value === undefined || value === null || value === false) {
    $el.removeAttribute(name);
  } else {
    $el.setAttribute(name, value === true ? '' : value);
  }
}
