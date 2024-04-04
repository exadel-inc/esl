import {memoize} from '@exadel/esl/modules/esl-utils/decorators';

/** Type for both <script> or <template> containers */
export type UIPSnippetTemplate = HTMLTemplateElement | HTMLScriptElement;

/** Proxy-interface to access template elements properties */
export class UIPSnippetItem {
  public constructor(protected readonly $element: UIPSnippetTemplate) {}

  /** @returns snippet's js element */
  @memoize()
  public get $elementJS(): HTMLElement | null {
    return this.jsSnippetId ? document.getElementById(this.jsSnippetId) : null;
  }

  /** @returns snippet's note element */
  @memoize()
  public get $elementNote(): HTMLElement | null {
    return this.noteSnippetId ? document.getElementById(this.noteSnippetId) : null;
  }

  /** @returns snippet's label */
  @memoize()
  public get label(): string {
    return this.$element.getAttribute('label') || '';
  }

  /** @returns snippet's js id */
  @memoize()
  public get jsSnippetId(): string {
    return this.$element.getAttribute('uip-snippet-js') || '';
  }

  /** @returns snippet's note id */
  @memoize()
  public get noteSnippetId(): string {
    return this.$element.getAttribute('uip-snippet-note') || '';
  }

  /** @returns snippet's html content */
  @memoize()
  public get html(): string {
    return this.$element.innerHTML;
  }

  /** @returns snippet's js content */
  @memoize()
  public get js(): string {
    return this.$elementJS ? this.$elementJS.innerHTML : '';
  }

  /** @returns snippet's note content */
  @memoize()
  public get note(): string {
    return this.$elementNote ? this.$elementNote.innerHTML : '';
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
    this.$elementNote?.toggleAttribute('active', active);
  }
}
