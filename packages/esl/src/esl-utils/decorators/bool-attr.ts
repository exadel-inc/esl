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
 * Maps boolean type property.
 * @param config - mapping configuration. See {@link BoolAttrDescriptor}
 */
export const boolAttr = (config: BoolAttrDescriptor = {}): ESLAttributeDecorator => {
  return (target: ESLDomElementTarget, propName: string): any => {
    const attrName = buildAttrName(config.name || propName, !!config.dataAttr);
    Object.defineProperty(target, propName, buildConditionalDescriptor(attrName, !!config.readonly));
    return {};
  };
};
