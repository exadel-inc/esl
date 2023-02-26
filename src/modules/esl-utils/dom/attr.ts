export type AttributeTarget = {$host: Element};
export type AttributeDecorator = (target: Element | AttributeTarget, propName: string) => void;

type ArgumentTarget = (Element | AttributeTarget)[] | Element | AttributeTarget | undefined | null;

/** @returns true if attribute presented */
export function hasAttr($el: ArgumentTarget, name: string): boolean {
  if (!$el) return false;
  if (Array.isArray($el)) return $el.every((element: Element) => hasAttr(element, name));
  if ('$host' in $el) $el = $el.$host;
  return $el.hasAttribute(name);
}

/** @returns attribute or passed fallback value. Identical to getAttribute by default */
export function getAttr($el: ArgumentTarget, name: string): string | null;
export function getAttr<T>($el: ArgumentTarget, name: string, fallback: T): string | T;
export function getAttr($el: ArgumentTarget, name: string, fallback: string | null = null): string | null {
  if (!$el) return null;
  if (Array.isArray($el)) return getAttr($el[0], name);
  if ('$host' in $el) $el = $el.$host;
  const value = $el.getAttribute(name);
  return value === null ? fallback : value;
}

/** Sets attribute */
export function setAttr($el: ArgumentTarget, name: string, value: undefined | null | boolean | string): void {
  if (!$el) return;
  if (Array.isArray($el)) {
    $el.forEach((element: Element) => setAttr(element, name, value));
    return;
  }
  if ('$host' in $el) $el = $el.$host;
  if (value === undefined || value === null || value === false) {
    $el.removeAttribute(name);
  } else {
    $el.setAttribute(name, value === true ? '' : value);
  }
}
