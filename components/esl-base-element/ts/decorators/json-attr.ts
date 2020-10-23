import type {ESLBaseElement} from '../esl-base-element';
import {toKebabCase, evaluate} from '../../../esl-utils/misc/format';

interface JsonAttrDescriptor<T> {
  name?: string;
  default?: T;
  readonly?: boolean;
  dataAttr?: boolean;
}

function buildJsonAttrDescriptor<T>(attrName: string, readOnly: boolean, defaultValue: T | null) {
  function get() {
    const attrContent = (this.getAttribute(attrName) || '').trim();
    return evaluate(attrContent, defaultValue);
  }

  function set(value: any) {
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
      console.error('Can not set json value ', e);
    }
  }

  return readOnly ? {get} : {get, set};
}

const buildAttrName =
  (propName: string, dataAttr: boolean) => dataAttr ? `data-${toKebabCase(propName)}` : toKebabCase(propName);

export const jsonAttr = <T>(config: JsonAttrDescriptor<T> = {}) => {
  config = Object.assign({default: {}}, config);
  return (target: ESLBaseElement, propName: string) => {
    const attrName = config.name || buildAttrName(propName, !!config.dataAttr);
    Object.defineProperty(target, propName, buildJsonAttrDescriptor(attrName, !!config.readonly, config.default));
  };
};
