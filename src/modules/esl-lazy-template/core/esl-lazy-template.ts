import {ESLMixinElement} from '../../esl-mixin-element/core';
import {attr, listen, prop, memoize} from '../../esl-utils/decorators';
import {ESLIntersectionTarget, ESLIntersectionEvent} from '../../esl-event-listener/core/targets/intersection.target';
import {ExportNs} from '../../esl-utils/environment/export-ns';

@ExportNs('LazyTemplate')
export class ESLLazyTemplate extends ESLMixinElement {
  public static override is = 'esl-lazy-template';
  public static viewportProvider: (node: Element) => Element | null = () => null;

  @prop(750) baseMargin: number;

  @attr({name: ESLLazyTemplate.is})
  public url?: string;

  protected get rootMargin(): string {
    return `${this.baseMargin * this.connectionRatio}px`;
  }

  protected get connectionRatio(): number {
    switch (navigator.connection?.effectiveType) {
      case 'slow-2g':
      case '2g': return 2;
      case '3g': return 1.5;
      case '4g':
      default: return 1;
    }
  }

  protected get isHostTemplate(): boolean {
    return this.$host instanceof HTMLTemplateElement;
  }

  protected get intersectionOptions(): IntersectionObserverInit {
    return {
      root: ESLLazyTemplate.viewportProvider(this.$host),
      rootMargin: this.rootMargin,
      threshold: [0.01]
    };
  }

  @memoize()
  public get $placeholder(): HTMLElement {
    const placeholder = document.createElement('div');
    placeholder.className = `${ESLLazyTemplate.is}-placeholder`;
    this.$host.before(placeholder);
    return placeholder;
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.$placeholder.remove();
    memoize.clear(this, '$placeholder');
  }

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

  protected async getContent(): Promise<string | Node> {
    if (this.url) return this.loadContent(this.url);
    if (this.isHostTemplate) return (this.$host as HTMLTemplateElement).content.cloneNode(true);
    return '';
  }

  protected async replaceWithContent(): Promise<void> {
    const content = await this.getContent();
    this.$host.replaceWith(content);
  }

  @listen({
    event: ESLIntersectionEvent.IN,
    target: (that: ESLLazyTemplate) => ESLIntersectionTarget.for(that.$placeholder, that.intersectionOptions)
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
