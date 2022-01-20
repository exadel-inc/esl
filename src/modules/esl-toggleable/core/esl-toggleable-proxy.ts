import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core';

import type {ESLToggleable} from '../../esl-toggleable/core';

const cloneAttributes = (target: HTMLElement, source: HTMLElement): void => {
  [...source.attributes].forEach((attribute) => {
    if (attribute.nodeValue) {
      target.setAttribute(attribute.nodeName === 'id' ? 'proxy-id' : attribute.nodeName, attribute.nodeValue);
    }
  });
};

@ExportNs('ToggleableProxy')
export class ESLToggleableProxy extends ESLBaseElement {
  static is = 'esl-toggleable-proxy';

  public $origin: ESLToggleable | null;

  public static from<T extends typeof ESLToggleableProxy>(this: T, $el: ESLToggleable): InstanceType<T> {
    const $proxy = document.createElement(this.is) as InstanceType<T>;
    $proxy.$origin = $el;
    cloneAttributes($proxy, $el);
    return $proxy;
  }
}

declare global {
  export interface ESLLibrary {
    ToggleableProxy: typeof ESLToggleableProxy;
  }
  export interface HTMLElementTagNameMap {
    'esl-toggleable-proxy': ESLToggleableProxy;
  }
}
