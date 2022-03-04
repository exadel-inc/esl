export type AttributeTarget = {$host: Element};
export type AttributeDecorator = (target: Element | AttributeTarget, propName: string) => void;

/** @returns attribute or passed fallback value. Identical to getAttribute by default */
export function getAttr($el: Element | AttributeTarget, name: string): string | null;
export function getAttr<T>($el: Element | AttributeTarget, name: string, fallback: T): string | T;
export function getAttr($el: Element | AttributeTarget, name: string, fallback: string | null = null): string | null {
  if ('$host' in $el) $el = $el.$host;
  const value = $el.getAttribute(name);
  return value === null ? fallback : value;
}

/** Set attribute */
export function setAttr($el: Element | AttributeTarget, name: string, value: undefined | null | boolean | string): void {
  if ('$host' in $el) $el = $el.$host;
  if (value === undefined || value === null || value === false) {
    $el.removeAttribute(name);
  } else {
    $el.setAttribute(name, value === true ? '' : value);
  }
}
