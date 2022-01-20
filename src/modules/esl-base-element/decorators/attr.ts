import {toKebabCase} from '../../esl-utils/misc/format';
import type {ESLBaseElement} from '../core/esl-base-element';

/** HTML attribute mapping configuration */
type AttrDescriptor<T> = {
  /** HTML attribute name. Uses kebab-cased variable name by default */
  name?: string;
  /** Create getter only */
  readonly?: boolean;
  /** Use data-* attribute */
  dataAttr?: boolean;
  /** Default property value. Used if no attribute is present on the element. Empty string by default. */
  defaultValue?: T | null;
  /** Parser allows to edit atrebutate values*/
  parser?: (value: string) => T;
};


function buildSimpleDescriptor<T>(attrName: string, readOnly: boolean, defaultValue: T, parser?: (value: string) => T): PropertyDescriptor {

  function get(): T | string {
    const value = this.getAttribute(attrName);
    if (typeof value === 'string') return parser ? parser(value) : value;
    return defaultValue;
  }

  function set(value: T | boolean): void {
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
export const attr = (config: AttrDescriptor<string> | AttrDescriptor<boolean> | AttrDescriptor<number> = {}): PropertyDecorator => {
  config = Object.assign({defaultValue: ''}, config);
  return (target: ESLBaseElement, propName: string): void => {
    const attrName = buildAttrName(config.name || propName, !!config.dataAttr);
    Object.defineProperty(target, propName, buildSimpleDescriptor(attrName, !!config.readonly, config.defaultValue, config.parser));
  };
};
