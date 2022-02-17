import {setAttr} from '../../esl-utils/dom/attr';
import {toKebabCase} from '../../esl-utils/misc/format';
import type {AttributeDecorator, AttributeTarget} from '../../esl-utils/dom/attr';

/** HTML boolean (marker) attribute mapping configuration */
type BoolAttrDescriptor = {
  /** HTML attribute name. Uses kebab-cased variable name by default */
  name?: string;
  /** Create getter only */
  readonly?: boolean;
  /** Use data-* attribute */
  dataAttr?: boolean;
};

function buildConditionalDescriptor(attrName: string, readOnly: boolean): PropertyDescriptor {
  function get(): boolean {
    return this.hasAttribute(attrName);
  }
  function set(value: unknown): void {
    setAttr(this, attrName, !!value);
  }

  return readOnly ? {get} : {get, set};
}

const buildAttrName =
  (propName: string, dataAttr: boolean): string => dataAttr ? `data-${toKebabCase(propName)}` : toKebabCase(propName);

/**
 * Decorator to map current property to element boolean (marker) attribute state.
 * Maps boolean type property.
 * @param config - mapping configuration. See {@link BoolAttrDescriptor}
 */
export const boolAttr = (config: BoolAttrDescriptor = {}): AttributeDecorator => {
  return (target: AttributeTarget, propName: string): void => {
    const attrName = buildAttrName(config.name || propName, !!config.dataAttr);
    Object.defineProperty(target, propName, buildConditionalDescriptor(attrName, !!config.readonly));
  };
};
