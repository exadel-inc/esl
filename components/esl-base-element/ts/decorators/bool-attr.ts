import {toKebabCase} from '../../../esl-utils/misc/format';
import type {ESLBaseElement} from '../esl-base-element';

type BoolAttrDescriptor = {
  name?: string;
  readonly?: boolean;
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

export const boolAttr = (config: BoolAttrDescriptor = {}) => {
  return (target: ESLBaseElement, propName: string) => {
    const attrName = config.name || buildAttrName(propName, !!config.dataAttr);
    Object.defineProperty(target, propName, buildConditionalDescriptor(attrName, !!config.readonly));
  };
};
