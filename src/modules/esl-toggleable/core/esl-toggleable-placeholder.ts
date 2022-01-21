import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core';

import type {ESLToggleable} from '../../esl-toggleable/core';

@ExportNs('ToggleablePlaceholder')
export class ESLToggleablePlaceholder extends ESLBaseElement {
  public static is = 'esl-toggleable-placeholder';

  public static readonly allowedExtraAttrs: string[] = [];

  public $origin: ESLToggleable | null;

  /** Сreates a placeholder for a given element of the toggleable's descendant */
  public static from<T extends typeof ESLToggleablePlaceholder>(this: T, $el: ESLToggleable): InstanceType<T> {
    const $placeholder = document.createElement(this.is) as InstanceType<T>;
    $placeholder.$origin = $el;
    return $placeholder;
  }

  /** List of attributes allowed to copy from origin to this element */
  protected get allowedAttrs(): string[] {
    return ['id', 'class'].concat((this.constructor as typeof ESLToggleablePlaceholder).allowedExtraAttrs);
  }

  public connectedCallback(): void {
    this.copyAttributesFromOrigin();
    super.connectedCallback();
  }

  /** Copies allowed attributes from origin to this element */
  protected copyAttributesFromOrigin(): void {
    if (!this.$origin) return;

    [...this.$origin.attributes]
      .filter((attr) => this.allowedAttrs.includes(attr.nodeName))
      .forEach((attr) => {
        const {nodeName, nodeValue} = attr;
        if (nodeValue) {
          this.setAttribute(nodeName === 'id' ? 'original-id' : nodeName, nodeValue);
        }
      });

    // sanitize class list of placeholder from the tag name of origin's element
    this.classList.remove((this.$origin.constructor as typeof ESLBaseElement).is);
  }
}

declare global {
  export interface ESLLibrary {
    ToggleablePlaceholder: typeof ESLToggleablePlaceholder;
  }
  export interface HTMLElementTagNameMap {
    'esl-toggleable-placeholder': ESLToggleablePlaceholder;
  }
}
