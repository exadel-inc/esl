import {getAttr, setAttr} from '../dom/attr';
import {toKebabCase, evaluate} from '../misc/format';
import type {AttributeDecorator, AttributeTarget} from '../dom/attr';

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

function buildJsonAttrDescriptor<T>(
  attrName: string,
  readOnly: boolean,
  defaultValue: T | null
): PropertyDescriptor {
  function get(): T | null {
    const attrContent = getAttr(this, attrName, '').trim();
    return evaluate(attrContent, defaultValue);
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

const buildAttrName = (propName: string, dataAttr: boolean): string =>
  dataAttr ? `data-${toKebabCase(propName)}` : toKebabCase(propName);

/**
 * Decorator to map current property to element attribute value using JSON (de-)serialization rules.
 * Maps object type property.
 * @param config - mapping configuration. See {@link JsonAttrDescriptor}
 */
export const jsonAttr = <T>(config: JsonAttrDescriptor<T> = {}): AttributeDecorator => {
  config = Object.assign({defaultValue: {}}, config);
  return (target: Element | AttributeTarget, propName: string): void => {
    const attrName = buildAttrName(config.name || propName, !!config.dataAttr);
    Object.defineProperty(
      target,
      propName,
      buildJsonAttrDescriptor(attrName, !!config.readonly, config.defaultValue)
    );
  };
};
