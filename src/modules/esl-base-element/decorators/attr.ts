import {toKebabCase} from '../../esl-utils/misc/format';
import {identity} from '../../esl-utils/misc/functions';

import type {ESLBaseElement} from '../core/esl-base-element';
import type {Serializer} from './serializers';

/** HTML attribute mapping configuration */
type AttrDescriptor<T> = {
  /** HTML attribute name. Uses kebab-cased variable name by default */
  name?: string;
  /** Create getter only */
  readonly?: boolean;
  /** Use data-* attribute */
  dataAttr?: boolean;
  /** Default property value. Used if no attribute is present on the element. Empty string by default. */
  defaultValue?: T ;
  /** Serializer allows to edit atrebutate values*/
  serializer?: Serializer<T>;
};

function buildSimpleDescriptor<T>(attrName: string, readOnly: boolean, defaultValue: T, serializer: Serializer<T>): PropertyDescriptor {

  function get(): T {
    const value = this.getAttribute(attrName);
    if (typeof value === 'string') return serializer.parse(value);
    return defaultValue;
  }

  function set(val: T): void {
    const value = serializer.serialize(val);
    if (value === undefined || value === null || value === false) {
      this.removeAttribute(attrName);
    } else {
      this.setAttribute(attrName, value === true ? '' : value);
    }
  }

  return readOnly ? {get} : {get, set};
}

const buildAttrName =
  (propName: string, dataAttr: boolean): string => dataAttr ? `data-${toKebabCase(propName)}` : toKebabCase(propName);

/**
 * Decorator to map current property to element attribute value.
 * Maps string type property.
 * @param config - mapping configuration. See {@link AttrDescriptor}
 */

export const attr = <T = string>(config: AttrDescriptor<T> = {}): PropertyDecorator => {
  config = Object.assign({defaultValue: '', serializer : {parse: identity, serialize: identity}}, config);

  return (target: ESLBaseElement, propName: string): void => {
    const attrName = buildAttrName(config.name || propName, !!config.dataAttr);
    Object.defineProperty(target, propName, buildSimpleDescriptor(attrName, !!config.readonly, config.defaultValue, config.serializer!));
  };
};
