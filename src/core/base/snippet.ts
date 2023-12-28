import {memoize} from '@exadel/esl/modules/esl-utils/decorators';

/** Type for both <script> or <template> containers */
export type UIPSnippetTemplate = HTMLTemplateElement | HTMLScriptElement;

/** Proxy-interface to access template elements properties */
export class UIPSnippetItem {
  public constructor(protected readonly $element: UIPSnippetTemplate) {}

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

  /** @returns if the snippet is in active state */
  public get active(): boolean {
    return this.$element.hasAttribute('active');
  }

  /** Sets the snippet active state */
  public set active(active: boolean) {
    if (active) this.$element.setAttribute('active', '');
    else this.$element.removeAttribute('active');
  }
}
