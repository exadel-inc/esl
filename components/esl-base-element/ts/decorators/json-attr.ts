import {toKebabCase} from '../../../esl-utils/misc/format';
import type {ESLBaseElement} from '../esl-base-element';

interface JsonAttrDescriptor<T> {
  default?: T;
  readonly?: boolean;
  dataAttr?: boolean;
  staticDefault?: string;
}

const JSON_ATTR_HOLDER = '_json_attr';

function getJsonAttr(target: HTMLElement, attrName: string) {
  try {
    const attrContent = target.getAttribute(attrName);
    return attrContent ? (new Function(`return ${attrContent}`))() : null;
  } catch (e) {
    console.debug('Cannot parse initial params: ', e);
    return null;
  }
}

export const jsonAttr = <T>(config: JsonAttrDescriptor<T> = {}) => {
  return (target: ESLBaseElement, propName: string) => {
    const attrName = config.dataAttr ? `data-${toKebabCase(propName)}` : toKebabCase(propName);

    function get(): T | null {
      const value = this[JSON_ATTR_HOLDER] && this[JSON_ATTR_HOLDER][propName];
      if (value) return value;
      const attrValue = getJsonAttr(this, attrName);
      if (attrValue) return attrValue;
      if (config.staticDefault) return this.constructor[config.staticDefault];
      return config.default || null;
    }

    function set(value: T) {
      this[JSON_ATTR_HOLDER] = this[JSON_ATTR_HOLDER] || {};
      this[JSON_ATTR_HOLDER][propName] = value;
    }

    Object.defineProperty(target, propName, config.readonly ? {get} : {get, set});
  };
};
