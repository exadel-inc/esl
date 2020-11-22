import {toKebabCase} from '../../esl-utils/misc/format';
import type {ESLBaseElement} from '../core/esl-base-element';

/** HTML boolean (marker) attribute mapping configuration */
type BoolAttrDescriptor = {
  /** HTML attribute name. Use kebab-cased variable name by default */
  name?: string;
  /** Create getter only */
  readonly?: boolean;
  /** Use data-* attribute */
  dataAttr?: boolean;
};

function buildConditionalDescriptor(attrName: string, readOnly: boolean) {
  function get() {
    return this.hasAttribute(attrName);
  }

  function set(value: boolean) {
    this.toggleAttribute(attrName, value);
  }

  return readOnly ? {get} : {get, set};
}

const buildAttrName =
  (propName: string, dataAttr: boolean) => dataAttr ? `data-${toKebabCase(propName)}` : toKebabCase(propName);

/**
 * Decorator to map current property to element boolean (marker) attribute state.
 * Maps boolean type property.
 * @param [config] - mapping configuration. See {@link BoolAttrDescriptor}
 */
export const boolAttr = (config: BoolAttrDescriptor = {}) => {
  return (target: ESLBaseElement, propName: string) => {
    const attrName = buildAttrName(config.name || propName, !!config.dataAttr);
    Object.defineProperty(target, propName, buildConditionalDescriptor(attrName, !!config.readonly));
  };
};
