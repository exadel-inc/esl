import {identity, resolveProperty} from '../misc/functions';
import {parseString, toKebabCase} from '../misc/format';
import {getAttr, getClosestAttr, setAttr} from '../dom/attr';

import type {PropertyProvider} from '../misc/functions';
import type {ESLAttributeDecorator} from '../dom/attr';
import type {ESLDomElementTarget} from '../abstract/dom-target';

export type AttrParser<T> = (attr: string | null) => T;
export type AttrSerializer<T> = (val: T) => null | boolean | string;

/** HTML attribute mapping configuration */
type AttrDescriptor<T = string> = {
  /** HTML attribute name. Uses kebab-cased variable name by default */
  name?: string;
  /** Create getter only */
  readonly?: boolean;
  /**
   * Specifies the attribute inheritance behavior.
   * If `inherit` is set to `true`, the attribute will inherit the value from the same-named attribute of the closest parent element in the DOM tree.
   * For instance, `@attr({inherit: true}) ignore;` will look for an `ignore` attribute in the parent elements if it's not defined in the current element.
   * If `dataAttr` is also true, it will search for `data-ignore` instead.
   *
   * If `inherit` is set to a string, it will use this string as the attribute name to search for in the parent elements.
   * For example, `@attr({inherit: 'alt-ignore'}) ignore;` will first look for its own `ignore` attribute (or 'data-ignore' if `dataAttr` is true),
   * and if not found, it will look for an `alt-ignore` attribute in the parent elements.
   */
  inherit?: boolean | string;
  /** Use data-* attribute */
  dataAttr?: boolean;
  /** Default property value. Used if no attribute is present on the element. Empty string by default. Supports provider function. */
  defaultValue?: T | PropertyProvider<T>;
  /** Parser from attribute value */
  parser?: AttrParser<T>;
  /** Serializer to transform passed value to attribute value */
  serializer?: AttrSerializer<T>;
};

const buildAttrName =
  (propName: string, dataAttr: boolean): string => dataAttr ? `data-${toKebabCase(propName)}` : toKebabCase(propName);

/**
 * Decorator to map current property to element attribute value.
 * Maps string type property.
 * @param config - mapping configuration. See {@link AttrDescriptor}
 */
export const attr = <T = string>(config: AttrDescriptor<T> = {}): ESLAttributeDecorator => {
  return (target: ESLDomElementTarget, propName: string): any => {
    const attrName = buildAttrName(config.name || propName, !!config.dataAttr);
    const inheritAttrName = typeof config.inherit === 'string' ? config.inherit : attrName;

    function get(): T | null {
      const val = config.inherit ? getAttr(this, attrName) || getClosestAttr(this, inheritAttrName) : getAttr(this, attrName);
      if (val === null && 'defaultValue' in config) return resolveProperty(config.defaultValue, this) as T;
      return (config.parser || parseString as AttrParser<any>)(val);
    }

    function set(value: T): void {
      setAttr(this, attrName, (config.serializer as AttrSerializer<any> || identity)(value));
    }

    Object.defineProperty(target, propName, config.readonly ? {get} : {get, set});
    return {};
  };
};
