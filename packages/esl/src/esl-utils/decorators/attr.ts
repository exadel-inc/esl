import {identity, resolveProperty} from '../misc/functions';
import {parseString, toKebabCase} from '../misc/format';
import {getAttr, getClosestAttr, setAttr} from '../dom/attr';

import type {PropertyProvider} from '../misc/functions';
import type {ESLAttributeDecorator} from '../dom/attr';
import type {ESLDomElementTarget} from '../abstract/dom-target';

/** Parser that handles nullable attribute value (when no `defaultValue` is provided) */
export type AttrParser<T> = (attr: string | null) => T;
/** Parser that receives a guaranteed non-null string (when `defaultValue` intercepts `null` before the parser is called) */
export type AttrSafeParser<T> = ((attr: string) => T) | AttrParser<T>;
/**
 * Serializer that transforms a property value to an attribute value; `null|false|undefined` removes the attribute,
 * `true` sets an empty string, other string sets exact value
 */
export type AttrSerializer<T> = (val: T) => null | boolean | string;

/** Shared HTML attribute mapping configuration fields */
type AttrDescriptorBase<T = string> = {
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
  /** Serializer to transform passed value to attribute value */
  serializer?: AttrSerializer<T>;
};

/**
 * Attribute descriptor with `defaultValue`.
 * When `defaultValue` is specified, `null` is intercepted before the parser is called,
 * so the parser is guaranteed to receive a non-null `string`.
 * This allows using functions like `parseInt`, `parseFloat`, `ESLMediaQuery.for`, etc. directly.
 */
type AttrDescriptorWithDefault<T> = AttrDescriptorBase<T> & {
  /** Default property value. Used if no attribute is present on the element. Supports provider function. */
  defaultValue: T | PropertyProvider<T>;
  /** Parser from attribute value. Receives a non-null `string` because `defaultValue` handles the `null` case. */
  parser?: AttrSafeParser<T>;
};

/**
 * Attribute descriptor without `defaultValue`.
 * The parser may receive `null` when the attribute is not present on the element,
 * so it must handle the `null` case explicitly.
 */
type AttrDescriptorWithoutDefault<T> = AttrDescriptorBase<T> & {
  defaultValue?: undefined;
  /** Parser from attribute value. May receive `null` if the attribute is absent. */
  parser?: AttrParser<T>;
};

/** HTML attribute mapping configuration */
type AttrDescriptor<T = string> = AttrDescriptorWithDefault<T> | AttrDescriptorWithoutDefault<T>;

const buildAttrName =
  (propName: string, dataAttr: boolean): string => dataAttr ? `data-${toKebabCase(propName)}` : toKebabCase(propName);

/**
 * `@attr` decorator: maps a property to an HTML attribute with optional parsing, serialization, default and inheritance.
 * - On get: reads local attribute (or inherited per `inherit`), returns parser(attr) or `defaultValue` if absent.
 * - `defaultValue` (or provider) affects only JS property when attribute is missing; it does NOT set an initial DOM attribute.
 * - Parser: `(string|null) => T` (default: `parseString`).
 * - When `defaultValue` is provided, parser receives a guaranteed non-null `string` (accepts `(string) => T`).
 * - Serializer: `(value: T) => string|boolean|null`; `null|false|undefined` removes attribute, `true` sets empty string, other string sets exact value.
 * - Inheritance: when enabled, falls back to closest ancestor attribute (optionally alternate name).
 * - Boolean with default pattern: `@attr({defaultValue: true, parser: parseBoolean, serializer: toBooleanAttribute})`
 * differs from `@boolAttr` by allowing a default `true` without attribute and explicit `false` via `attr="false"`.
 * - Works with wrapper objects exposing `$host` (resolved internally by underlying DOM helpers)
 */
export function attr<T>(config: AttrDescriptorWithDefault<T>): ESLAttributeDecorator;
/**
 * `@attr` decorator: maps a property to an HTML attribute with optional parsing, serialization, default and inheritance.
 * - On get: reads local attribute (or inherited per `inherit`), returns parser(attr) or `defaultValue` if absent.
 * - `defaultValue` (or provider) affects only JS property when attribute is missing; it does NOT set an initial DOM attribute.
 * - Parser: `(string|null) => T` (default: `parseString`). Must handle `null` when no `defaultValue` is set.
 * - Serializer: `(value: T) => string|boolean|null`; `null|false|undefined` removes attribute, `true` sets empty string, other string sets exact value.
 * - Inheritance: when enabled, falls back to closest ancestor attribute (optionally alternate name).
 * - Boolean with default pattern: `@attr({defaultValue: true, parser: parseBoolean, serializer: toBooleanAttribute})`
 * differs from `@boolAttr` by allowing a default `true` without attribute and explicit `false` via `attr="false"`.
 * - Works with wrapper objects exposing `$host` (resolved internally by underlying DOM helpers)
 */
export function attr<T = string>(config?: AttrDescriptorWithoutDefault<T>): ESLAttributeDecorator;
export function attr<T = string>(config: AttrDescriptor<T> = {}): ESLAttributeDecorator {
  return (target: ESLDomElementTarget, propName: string): any => {
    const attrName = buildAttrName(config.name || propName, !!config.dataAttr);
    const inheritAttrName = typeof config.inherit === 'string' ? config.inherit : attrName;

    function get(): T | null {
      const val = config.inherit ? getAttr(this, attrName) || getClosestAttr(this, inheritAttrName) : getAttr(this, attrName);
      if (val === null && 'defaultValue' in config) return resolveProperty(config.defaultValue, this) as T;
      // Note: if defaultValue is set, null is already handled above, so parser receives a non-null string;
      // otherwise parser is AttrParser<T> which accepts null. TS can't narrow the union here, so we cast.
      return ((config.parser || parseString) as AttrParser<any>)(val);
    }

    function set(value: T): void {
      setAttr(this, attrName, (config.serializer as AttrSerializer<any> || identity)(value));
    }

    Object.defineProperty(target, propName, config.readonly ? {get} : {get, set});
    return {};
  };
}
