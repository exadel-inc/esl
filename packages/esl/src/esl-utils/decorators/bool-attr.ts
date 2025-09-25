import {hasAttr, setAttr} from '../dom/attr';
import {toKebabCase} from '../misc/format';

import type {ESLAttributeDecorator} from '../dom/attr';
import type {ESLDomElementTarget} from '../abstract/dom-target';

/** HTML boolean (marker) attribute mapping configuration */
type BoolAttrDescriptor = {
  /** HTML attribute name. Uses kebab-cased variable name by default */
  name?: string;
  /** Create getter only */
  readonly?: boolean;
  /** Use data-* attribute */
  dataAttr?: boolean;
};

function buildConditionalDescriptor(attrName: string, readOnly: boolean): PropertyDescriptor {
  function get(): boolean {
    return hasAttr(this, attrName);
  }
  function set(value: unknown): void {
    setAttr(this, attrName, !!value);
  }

  return readOnly ? {get} : {get, set};
}

const buildAttrName =
  (propName: string, dataAttr: boolean): string => dataAttr ? `data-${toKebabCase(propName)}` : toKebabCase(propName);

/**
 * Decorator to map current property to element boolean (marker) attribute state.
 * - Presence mapping: attribute present means true, attribute absent means false (no third state)
 * - No `defaultValue` option; cannot implicitly default to true without attribute (use `@attr` tri‑state pattern for that)
 * - Setting property: truthy value ensures attribute presence (empty string); falsy value removes the attribute
 * - `readonly` option exposes getter only (writes ignored at JS level)
 * - Supports `data-*` via `dataAttr`
 * - Works with wrapper objects exposing `$host` (resolved internally by underlying DOM helpers)
 * @param config - mapping configuration. See {@link BoolAttrDescriptor}
 */
export const boolAttr = (config: BoolAttrDescriptor = {}): ESLAttributeDecorator => {
  return (target: ESLDomElementTarget, propName: string): any => {
    const attrName = buildAttrName(config.name || propName, !!config.dataAttr);
    Object.defineProperty(target, propName, buildConditionalDescriptor(attrName, !!config.readonly));
    return {};
  };
};
