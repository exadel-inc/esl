import {ESLMixinElement} from '../../esl-mixin-element/core';
import {attr, listen, prop, memoize} from '../../esl-utils/decorators';
import {ESLIntersectionTarget, ESLIntersectionEvent} from '../../esl-event-listener/core/targets/intersection.target';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {getViewportForEl} from '../../esl-utils/dom/scroll';

@ExportNs('LazyTemplate')
export class ESLLazyTemplate extends ESLMixinElement {
  public static override is = 'esl-lazy-template';

  @prop(750) baseMargin: number;
  @prop([0, 0.01]) protected INTERSECTION_THRESHOLD: number[];

  /** URL to load content from */
  @attr({name: ESLLazyTemplate.is})
  public url?: string;

  /** IntersectionObserver rootMargin value */
  protected get rootMargin(): string {
    return `${this.baseMargin * this.connectionRatio}px`;
  }

  /** Connection speed ratio */
  protected get connectionRatio(): number {
    switch (navigator.connection?.effectiveType) {
      case 'slow-2g':
      case '2g': return 2;
      case '3g': return 1.5;
      case '4g':
      default: return 1;
    }
  }

  /** Host element is a template */
  protected get isHostTemplate(): boolean {
    return this.$host instanceof HTMLTemplateElement;
  }

  /** LazyTemplate placeholder */
  @memoize()
  public get $placeholder(): HTMLElement {
    const placeholder = document.createElement('div');
    placeholder.className = `${ESLLazyTemplate.is}-placeholder`;
    this.$host.before(placeholder);
    return placeholder;
  }

  /** LazyTemplate viewport (root element for IntersectionObservers checking visibility) */
  @memoize()
  protected get $viewport(): Element | undefined {
    return getViewportForEl(this.$host);
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.$placeholder.remove();
    memoize.clear(this, '$placeholder');
  }

  /** Loads content from the URL */
  @memoize()
  protected async loadContent(url: string): Promise<Node | string> {
    try {
      const response = await fetch(url);
      if (!response.ok) return '';
      const $template = document.createElement('template');
      $template.innerHTML = await response.text();
      return $template.content.cloneNode(true);
    } catch (e) {
      return '';
    }
  }

  /** Gets content from the URL or host template element */
  protected async getContent(): Promise<string | Node> {
    if (this.url) return this.loadContent(this.url);
    if (this.isHostTemplate) return (this.$host as HTMLTemplateElement).content.cloneNode(true);
    return '';
  }

  /** Replaces host element with content */
  protected async replaceWithContent(): Promise<void> {
    const content = await this.getContent();
    this.$host.replaceWith(content);
  }

  @listen({
    event: ESLIntersectionEvent.IN,
    target: (that: ESLLazyTemplate) => ESLIntersectionTarget.for(that.$placeholder, {
      root: that.$viewport,
      rootMargin: that.rootMargin,
      threshold: that.INTERSECTION_THRESHOLD
    })
  })
  protected _onIntersect(e: ESLIntersectionEvent): void {
    this.replaceWithContent();
  }
}

declare global {
  export interface ESLLibrary {
    LazyTemplate: typeof ESLLazyTemplate;
  }

  interface Navigator extends NavigatorNetworkInformation {}
  interface NavigatorNetworkInformation {
    readonly connection?: {
      readonly effectiveType: 'slow-2g' | '2g' | '3g' | '4g';};
  }
}
