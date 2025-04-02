import {resolveDomTarget} from '../abstract/dom-target';

import type {ESLDomElementTarget} from '../abstract/dom-target';

export type ESLAttributeTarget = undefined | null | ESLDomElementTarget | ESLDomElementTarget[];
export type ESLAttributeDecorator = (target: ESLDomElementTarget, propName: string) => void;

/** @returns true if attribute presented */
export function hasAttr($el: ESLAttributeTarget, name: string): boolean {
  if (Array.isArray($el)) return $el.every((element: Element) => hasAttr(element, name));
  if (!($el = resolveDomTarget($el))) return false;
  return $el.hasAttribute(name);
}

/** @returns attribute or passed fallback value. Identical to getAttribute by default */
export function getAttr($el: ESLAttributeTarget, name: string): string | null;
export function getAttr<T>($el: ESLAttributeTarget, name: string, fallback: T): string | T;
export function getAttr($el: ESLAttributeTarget, name: string, fallback: string | null = null): string | null {
  if (Array.isArray($el)) return getAttr($el[0], name);
  if (!($el = resolveDomTarget($el))) return null;
  const value = $el.getAttribute(name);
  return value === null ? fallback : value;
}

/** Sets attribute */
export function setAttr($el: ESLAttributeTarget, name: string, value: undefined | null | boolean | string): void {
  if (Array.isArray($el)) {
    $el.forEach((element: Element) => setAttr(element, name, value));
    return;
  }
  if (!($el = resolveDomTarget($el))) return;
  if (value === undefined || value === null || value === false) {
    $el.removeAttribute(name);
  } else {
    $el.setAttribute(name, value === true ? '' : value);
  }
}

/** Gets attribute value from the closest element with group behavior settings */
export function getClosestAttr($el: ESLAttributeTarget, attrName: string): string | null {
  if (!($el = resolveDomTarget($el))) return null;
  const $closest = $el.closest(`[${attrName}]`);
  return $closest ? $closest.getAttribute(attrName) : null;
}
