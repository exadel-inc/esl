import {toKebabCase} from '../misc/format';
import {getAttr, setAttr} from '../dom/attr';
import type {AttributeDecorator, AttributeTarget} from '../dom/attr';

/** HTML attribute mapping configuration */
type AttrDescriptor = {
  /** HTML attribute name. Uses kebab-cased variable name by default */
  name?: string;
  /** Create getter only */
  readonly?: boolean;
  /** Use data-* attribute */
  dataAttr?: boolean;
  /** Default property value. Used if no attribute is present on the element. Empty string by default. */
  defaultValue?: string | boolean | null;
};

function buildSimpleDescriptor(attrName: string, readOnly: boolean, defaultValue: string | boolean | null | undefined): PropertyDescriptor {
  function get(): string | boolean | null | undefined {
    return getAttr(this, attrName, defaultValue);
  }

  function set(value: string | boolean | null | undefined): void {
    setAttr(this, attrName, value);
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
export const attr = (config: AttrDescriptor = {}): AttributeDecorator => {
  config = Object.assign({defaultValue: ''}, config);
  return (target: Element | AttributeTarget, propName: string): void => {
    const attrName = buildAttrName(config.name || propName, !!config.dataAttr);
    Object.defineProperty(target, propName, buildSimpleDescriptor(attrName, !!config.readonly, config.defaultValue));
  };
};
