import {toKebabCase, evaluate} from '@esl/utils/src/misc/format';
import type {ESLBaseElement} from '../core/esl-base-element';

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
  function get(): T | null {
    const attrContent = (this.getAttribute(attrName) || '').trim();
    return evaluate(attrContent, defaultValue);
  }

  function set(value: any): void {
    if (typeof value !== 'object') {
      console.error('Can not set json value: value should be object');
    }
    try {
      if (value) {
        const serializedValue = JSON.stringify(value);
        this.setAttribute(attrName, serializedValue);
      } else {
        this.removeAttribute(attrName);
      }
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
export const jsonAttr = <T>(config: JsonAttrDescriptor<T> = {}): PropertyDecorator => {
  config = Object.assign({defaultValue: {}}, config);
  return (target: ESLBaseElement, propName: string): void => {
    const attrName = buildAttrName(config.name || propName, !!config.dataAttr);
    Object.defineProperty(target, propName, buildJsonAttrDescriptor(attrName, !!config.readonly, config.defaultValue));
  };
};
