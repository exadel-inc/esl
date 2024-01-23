import {memoize} from '@exadel/esl/modules/esl-utils/decorators';

/** Type for both <script> or <template> containers */
export type UIPSnippetTemplate = HTMLTemplateElement | HTMLScriptElement;

/** Proxy-interface to access template elements properties */
export class UIPSnippetItem {
  public constructor(protected readonly $element: UIPSnippetTemplate) {}

  @memoize()
  public get $elementJS(): UIPSnippetTemplate | null {
    const $root = this.$element.closest('uip-root') || document.body;
    const selectors = [];
    if (this.$element.id) selectors.push(`[uip-js-snippet="${this.$element.id}"]`);
    if (this.label) selectors.push(`[uip-js-snippet="${this.label}"]`, `[uip-js-snippet][label="${this.label}"]`);
    return $root.querySelector(selectors.join(',')) as UIPSnippetTemplate;
  }

  /** @returns snippet's label */
  @memoize()
  public get label(): string {
    return this.$element.getAttribute('label') || '';
  }

  /** @returns snippet's html content */
  @memoize()
  public get html(): string {
    return this.$element.innerHTML;
  }

  @memoize()
  public get js(): string {
    return this.$elementJS ? this.$elementJS.innerHTML : '';
  }

  /** @returns if the snippet is in active state */
  public get active(): boolean {
    return this.$element.hasAttribute('active');
  }

  /** Sets the snippet active state */
  public set active(active: boolean) {
    this.$element.toggleAttribute('active', active);
    this.$elementJS?.toggleAttribute('active', active);
  }
}
