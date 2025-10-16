import {attr, listen, memoize, prop} from '@exadel/esl/modules/esl-utils/decorators';
import {ESLIntersectionTarget} from '@exadel/esl/modules/esl-event-listener/core';
import {parseBoolean, toBooleanAttribute} from '@exadel/esl/modules/esl-utils/misc';
import {promisifyEvent, promisifyNextRender, promisifyTimeout} from '@exadel/esl/modules/esl-utils/async';

import {UIPPlugin} from '../base/plugin';
import {UIPRenderingTemplatesService} from '../processors/templates';
import {UIPJSRenderingPreprocessors, UIPHTMLRenderingPreprocessors} from '../processors/rendering';

import type {UIPChangeEvent} from '../base/model.change';
import type {ESLIntersectionEvent} from '@exadel/esl/modules/esl-event-listener/core';

/**
 * Preview {@link UIPPlugin} custom element definition.
 * Mandatory for UI Playground rendering. Displays active playground content
 */
export class UIPPreview extends UIPPlugin {
  public static override is = 'uip-preview';
  public static override observedAttributes: string[] = ['dir'];

  /** Sync height with inner iframe content height */
  @prop(true) public resizeLoop: boolean;

  /** Marker to force iframe rerendering */
  @attr({parser: parseBoolean, serializer: toBooleanAttribute}) public forceUpdate: boolean;

  /** Delay to show new content after isolated full refresh */
  @attr({defaultValue: 150, parser: parseInt}) public refreshDelay: number;

  protected _iframeResizeRAF: number = 0;

  /** {@link UIPPlugin} section wrapper */
  @memoize()
  protected get $inner(): HTMLElement {
    const pluginType = this.constructor as typeof UIPPlugin;
    return <div className={`${pluginType.is}-inner uip-plugin-inner esl-scrollable-content`}></div> as HTMLElement;
  }

  @memoize()
  protected get $iframe(): HTMLIFrameElement {
    return <iframe className="uip-preview-iframe" frameBorder="0"></iframe> as HTMLIFrameElement;
  }

  /** Extra element to animate decreasing height of content smoothly */
  @memoize()
  protected get $container(): HTMLElement {
    const type = this.constructor as typeof UIPPreview;
    return (
      <div class={`uip-plugin-content ${type.is}-container`}>
        <esl-scrollbar class={type.is + '-v-scroll'} target="::next(.uip-plugin-inner)"/>
        <esl-scrollbar class={type.is + '-h-scroll'} target="::next(.uip-plugin-inner)" horizontal/>
        {this.$inner}
      </div>
    ) as HTMLElement;
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.syncResizableState();
    this.appendChild(this.$container);
  }

  protected override disconnectedCallback(): void {
    this.$container.remove();
    super.disconnectedCallback();
  }

  protected override attributeChangedCallback(attrName: string): void {
    if (attrName === 'dir') this.updateDir();
  }

  protected async update(e?: UIPChangeEvent): Promise<void> {
    const isolated = this.model!.activeSnippet?.isolated || false;

    if (!isolated) return this.writeContent();
    if (!e || this.forceUpdate || e.force) return this.writeIsolatedContent();
    return this.updateIsolatedContent();
  }

  /** Writes the content directly to the inner area (non-isolated frame) */
  protected async writeContent(): Promise<void> {
    this.$inner.innerHTML = UIPHTMLRenderingPreprocessors.preprocess(this.model!.html);
    this.stopIframeResizeLoop();
    return promisifyNextRender();
  }

  protected async updateIsolatedContent(): Promise<void> {
    if (!this.$iframe.contentWindow) return;
    const $document = this.$iframe.contentWindow?.document;
    const $root = $document?.querySelector('[uip-content-root]') || $document?.body;

    if ($root) {
      $root.innerHTML = UIPHTMLRenderingPreprocessors.preprocess(this.model!.html);
      return promisifyNextRender();
    }
  }

  /** Writes the content to the iframe inner (isolated frame) */
  protected async writeIsolatedContent(): Promise<void> {
    if (this.$iframe.parentElement !== this.$inner) {
      this.$inner.innerHTML = '';
      this.$inner.appendChild(this.$iframe);
    }
    this.stopIframeResizeLoop();
    this.$iframe.src = 'about:blank';
    this.$iframe.hidden = true;
    this.startIframeResizeLoop();

    await promisifyEvent(this.$iframe, 'load');
    await promisifyTimeout(this.refreshDelay);
  }

  /** Start and do a resize sync-loop iteration. Recall itself on the next frame. */
  protected startIframeResizeLoop(): void {
    if (!this.resizeLoop) return;
    // Prevents multiple loops
    if (this._iframeResizeRAF) cancelAnimationFrame(this._iframeResizeRAF);
    // Addition loop fallback for iframe removal
    if (this.$iframe.parentElement !== this.$inner) return;
    const $document = this.$iframe.contentWindow?.document;
    const $root = $document?.querySelector('[uip-content-root]') || $document?.body;
    if (!$root) return;
    // Reflect iframe height with inner content
    this.$iframe.style.height = `${$root.scrollHeight}px`;
    this._iframeResizeRAF = requestAnimationFrame(this.startIframeResizeLoop.bind(this));
  }

  /** Stop resize loop iterations created by `startIframeResizeLoop` */
  protected stopIframeResizeLoop(): void {
    if (this._iframeResizeRAF) cancelAnimationFrame(this._iframeResizeRAF);
    this._iframeResizeRAF = 0;
  }

  /** Resets element both inline height and width properties */
  protected clearInlineSize(): void {
    this.$container.style.removeProperty('height');
    this.$container.style.removeProperty('width');
  }

  /** Synchronizes the resizable state from the active snippet to the element attribute */
  protected syncResizableState(): void {
    this.$$attr('resizable', this.model?.activeSnippet?.resizable);
  }

  private updateDir(): void {
    const isChanged = this.dir !== this.$inner.dir;
    this.$inner.dir = this.dir;
    isChanged && this.$$fire('uip:dirchange');
  }

  @listen({
    event: 'load',
    target: ($this: UIPPreview) => $this.$iframe
  })
  protected _onIframeLoad(): void {
    if (!this.$iframe.contentWindow) return;

    const title = this.model!.activeSnippet?.label || 'UI Playground';
    const script = UIPJSRenderingPreprocessors.preprocess(this.model!.js);
    const content = UIPHTMLRenderingPreprocessors.preprocess(this.model!.html);
    const isolatedTemplate = this.model!.activeSnippet?.isolatedTemplate || 'default';
    const html = UIPRenderingTemplatesService.render(isolatedTemplate, {title, content, script});

    this.$iframe.contentWindow?.document.close();
    this.$iframe.contentWindow?.document.write(html);
    this.$iframe.contentWindow?.document.close();
    this.$iframe.hidden = false;
    this.$iframe.title = title;
  }

  /** Updates preview content from the model state changes */
  @listen({event: 'uip:change', target: ($this: UIPPreview) => $this.$root})
  protected async _onRootStateChange(e?: UIPChangeEvent): Promise<void> {
    this.$container.style.transition = 'none';
    this.$container.style.minHeight = `${this.$inner.offsetHeight}px`;

    this.$$attr('loading', true);
    await this.update(e);
    this.$$attr('loading', false);

    this.$container.style.removeProperty('transition');
    this.$container.style.removeProperty('min-height');
  }

  @listen({event: 'uip:model:snippet:change', target: ($this: UIPPreview) => $this.model})
  protected async _onSnippetChange(): Promise<void> {
    this.syncResizableState();
    this.clearInlineSize();
  }

  /** Handles visibility change of the preview are to limit resize sync-loops to the active preview area */
  @listen({
    event: 'intersects',
    target: (preview: UIPPreview) => ESLIntersectionTarget.for(preview.$container, {threshold: 0.01}),
  })
  protected _onIntersects(e: ESLIntersectionEvent): void {
    e.isIntersecting ? this.startIframeResizeLoop() : this.stopIframeResizeLoop();
  }
}
