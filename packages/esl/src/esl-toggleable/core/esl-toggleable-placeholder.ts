import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core';

import type {ESLToggleable} from '../../esl-toggleable/core';

@ExportNs('ToggleablePlaceholder')
export class ESLToggleablePlaceholder extends ESLBaseElement {
  public static override is = 'esl-toggleable-placeholder';

  /** List of attributes allowed to copy from origin to this element */
  public static readonly allowedAttrs: string[] = ['id', 'class'];

  public $origin: ESLToggleable | null;

  /** Сreates a placeholder for a given element of the toggleable's descendant */
  public static from<T extends typeof ESLToggleablePlaceholder>(this: T, $el: ESLToggleable): InstanceType<T> {
    const $placeholder = document.createElement(this.is) as InstanceType<T>;
    $placeholder.$origin = $el;
    return $placeholder;
  }

  public override connectedCallback(): void {
    this.copyAttributesFromOrigin();
    super.connectedCallback();
  }

  /** Builds attribute name for copy */
  protected buildAttrName(name: string): string {
    return name === 'id' ? 'original-id' : name;
  }

  /** Copies allowed attributes from origin to this element */
  protected copyAttributesFromOrigin(): void {
    const {$origin} = this;
    if (!$origin) return;

    (this.constructor as typeof ESLToggleablePlaceholder).allowedAttrs.forEach((name) => {
      const value = $origin.getAttribute(name);
      if (value) {
        this.setAttribute(this.buildAttrName(name), value);
      }
    });

    // sanitize class list of placeholder from the tag name of origin's element
    this.classList.remove(($origin.constructor as typeof ESLBaseElement).is);
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
