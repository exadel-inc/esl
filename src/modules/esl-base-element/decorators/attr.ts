import {toKebabCase} from '../../esl-utils/misc/format';
import type {ESLBaseElement} from '../core/esl-base-element';

/** HTML attribute mapping configuration */
type AttrDescriptor = {
  /** HTML attribute name. Use kebab-cased variable name by default */
  name?: string;
  /** Create getter only */
  readonly?: boolean;
  /** Use data-* attribute */
  dataAttr?: boolean;
  /** Default property value. Used if no attribute presented on the element. Empty string by default. */
  defaultValue?: string | boolean | null;
};

function buildSimpleDescriptor(attrName: string, readOnly: boolean, defaultValue: string | boolean | null | undefined) {
  function get() {
    const value = this.getAttribute(attrName);
    return typeof value === 'string' ? value : defaultValue;
  }

  function set(value: string | boolean | null | undefined) {
    if (value === undefined || value === null || value === false) {
      this.removeAttribute(attrName);
    } else {
      this.setAttribute(attrName, value === true ? '' : value);
    }
  }

  return readOnly ? {get} : {get, set};
}

const buildAttrName =
  (propName: string, dataAttr: boolean) => dataAttr ? `data-${toKebabCase(propName)}` : toKebabCase(propName);

/**
 * Decorator to map current property to element attribute value.
 * Maps string type property.
 * @param [config] - mapping configuration. See {@link AttrDescriptor}
 */
export const attr = (config: AttrDescriptor = {}) => {
  config = Object.assign({defaultValue: ''}, config);
  return (target: ESLBaseElement, propName: string) => {
    const attrName = buildAttrName(config.name || propName, !!config.dataAttr);
    Object.defineProperty(target, propName, buildSimpleDescriptor(attrName, !!config.readonly, config.defaultValue));
  };
};
