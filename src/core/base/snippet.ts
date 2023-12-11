import {memoize} from '@exadel/esl/modules/esl-utils/decorators';

/** Type for both <script> or <template> containers */
export type UIPSnippetTemplate = HTMLTemplateElement | HTMLScriptElement;

export class UIPSnippetItem {
  public constructor(
    protected readonly $element: UIPSnippetTemplate
  ) {
  }

  @memoize()
  public get label(): string {
    return this.$element.getAttribute('label') || '';
  }

  @memoize()
  public get html(): string {
    return this.$element.innerHTML;
  }

  public get active(): boolean {
    return this.$element.hasAttribute('active');
  }

  public set active(active: boolean) {
    if (active) this.$element.setAttribute('active', '');
    else this.$element.removeAttribute('active');
  }
}
