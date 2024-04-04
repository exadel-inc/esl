import {memoize} from '@exadel/esl/modules/esl-utils/decorators';

/** Type for both <script> or <template> containers */
export type UIPSnippetTemplate = HTMLTemplateElement | HTMLScriptElement;

/** Proxy-interface to access template elements properties */
export class UIPSnippetItem {
  public constructor(protected readonly $element: UIPSnippetTemplate) {}

  @memoize()
  public get $elementJS(): UIPSnippetTemplate | null {
    const $root: Element = this.$element.closest('uip-root') || document.body;
    const selectors = [];
    if (this.$element.id) selectors.push(`[uip-js-snippet="${this.$element.id}"]`);
    if (this.label) selectors.push(`[uip-js-snippet][label="${this.label}"]`);
    return $root.querySelector(selectors.join(','))!;
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

  /** @returns template to use for isolated rendering */
  @memoize()
  public get isolatedTemplate(): string {
    return this.$element.getAttribute('isolated-template') || '';
  }

  /** @returns if snippet should preview in isolated iframe */
  public get isolated(): boolean {
    return this.$element.hasAttribute('uip-isolated');
  }

  /** @returns snippet's anchor id */
  public get anchor(): string | null {
    return this.$element.getAttribute('anchor');
  }

  /** @returns if the snippet is in active state */
  public get active(): boolean {
    return this.$element.hasAttribute('active');
  }

  /** @returns if the snippet is readonly */
  public get isJsReadonly(): boolean {
    return this.$element.hasAttribute('uip-js-readonly') || (!this.isolated);
  }

  /** Sets the snippet active state */
  public set active(active: boolean) {
    this.$element.toggleAttribute('active', active);
    this.$elementJS?.toggleAttribute('active', active);
  }
}
