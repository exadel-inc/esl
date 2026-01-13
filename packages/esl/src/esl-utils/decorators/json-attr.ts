import {getAttr, setAttr} from '../dom/attr';
import {toKebabCase, parseObjectSafe} from '../misc/format';

import type {ESLAttributeDecorator} from '../dom/attr';
import type {ESLDomElementTarget} from '../abstract/dom-target';

/** HTML attribute to object property mapping configuration */
interface JsonAttrDescriptor<T> {
  /** HTML attribute name. Uses kebab-cased variable name by default */
  name?: string;
  /** Create getter only */
  readonly?: boolean;
  /** Use data-* attribute */
  dataAttr?: boolean;
  /** Default property value. Used if no attribute is present on the element. Empty string by default. */
  defaultValue?: T;
}

function buildJsonAttrDescriptor<T>(attrName: string, readOnly: boolean, defaultValue: T | null): PropertyDescriptor {
  function fallback(value: string): T | null {
    console.warn('[ESL]: cannot parse attribute %s value "%s"', attrName, value);
    return defaultValue;
  }

  function get(): T | null {
    const attrContent = getAttr(this, attrName, '').trim();
    if (!attrContent) return defaultValue;
    return parseObjectSafe(attrContent, fallback);
  }

  function set(value: any): void {
    try {
      if (typeof value !== 'object') throw Error('value should be object');
      setAttr(this, attrName, value ? JSON.stringify(value) : false);
    } catch (e) {
      console.error('[ESL] jsonAttr: Can not set json value ', e);
    }
  }

  return readOnly ? {get} : {get, set};
}

const buildAttrName =
  (propName: string, dataAttr: boolean): string => dataAttr ? `data-${toKebabCase(propName)}` : toKebabCase(propName);

/**
 * Decorator to map current property to element attribute value using JSON (de-)serialization rules.
 * Maps object type property.
 * @param config - mapping configuration. See {@link JsonAttrDescriptor}
 */
export const jsonAttr = <T>(config: JsonAttrDescriptor<T> = {}): ESLAttributeDecorator => {
  config = Object.assign({defaultValue: {}}, config);
  return (target: ESLDomElementTarget, propName: string): any => {
    const attrName = buildAttrName(config.name || propName, !!config.dataAttr);
    Object.defineProperty(target, propName, buildJsonAttrDescriptor(attrName, !!config.readonly, config.defaultValue));
    return {};
  };
};
