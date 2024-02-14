import React from 'jsx-dom';

import {attr, listen, memoize, prop} from '@exadel/esl/modules/esl-utils/decorators';
import {ESLIntersectionTarget} from '@exadel/esl/modules/esl-event-listener/core';
import {parseBoolean, toBooleanAttribute} from '@exadel/esl/modules/esl-utils/misc';
import {afterNextRender, skipOneRender} from '@exadel/esl/modules/esl-utils/async';

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
  static is = 'uip-preview';
  static observedAttributes: string[] = ['dir', 'resizable', 'isolation', 'isolation-template'];

  /** Sync height with inner iframe content height */
  @prop(true) public resizeLoop: boolean;

  /** Marker to use iframe isolated rendering */
  @attr({parser: parseBoolean, serializer: toBooleanAttribute}) public isolation: boolean;
  /** Marker to use iframe isolated rendering */
  @attr({parser: parseBoolean, serializer: toBooleanAttribute}) public forceUpdate: boolean;
  /** Template to use for isolated rendering */
  @attr({defaultValue: 'default'}) public isolationTemplate: string;

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
      <div class={type.is + '-container'}>
        <esl-scrollbar class={type.is + '-v-scroll'} target="::next(.uip-plugin-inner)"/>
        <esl-scrollbar class={type.is + '-h-scroll'} target="::next(.uip-plugin-inner)" horizontal/>
        {this.$inner}
      </div>
    ) as HTMLElement;
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.appendChild(this.$container);
  }

  protected override disconnectedCallback(): void {
    this.$container.remove();
    super.disconnectedCallback();
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (attrName === 'resizable' && newVal === null) this.clearInlineSize();
    if (attrName === 'dir') this.updateDir();
    if (attrName === 'isolation' || attrName === 'isolation-template') {
      this.$$on(this._onIframeLoad);
      this._onRootStateChange();
    }
  }

  protected update(e?: UIPChangeEvent): void {
    if (!this.isolation) return this.writeContent();
    if (!e || e.jsChanges.length || this.forceUpdate) this.writeContentIsolated();
    this._onIframeLoad();
  }

  /** Writes the content directly to the inner area (non-isolated frame) */
  protected writeContent(): void {
    this.$inner.innerHTML = UIPHTMLRenderingPreprocessors.preprocess(this.model!.html);
    this.stopIframeResizeLoop();
  }

  /** Writes the content to the iframe inner (isolated frame) */
  protected writeContentIsolated(): void {
    if (this.$iframe.parentElement !== this.$inner) {
      this.$inner.innerHTML = '';
      this.$inner.appendChild(this.$iframe);
    }
    this.stopIframeResizeLoop();
    this.$iframe.src = '';
    this.startIframeResizeLoop();
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
    if (!this._iframeResizeRAF) return;
    cancelAnimationFrame(this._iframeResizeRAF);
    this._iframeResizeRAF = 0;
  }

  /** Resets element both inline height and width properties */
  protected clearInlineSize(): void {
    this.$inner.style.removeProperty('height');
    this.$inner.style.removeProperty('width');
  }
  private updateDir(): void {
    const isChanged = this.dir !== this.$inner.dir;
    this.$inner.dir = this.dir;
    isChanged && this.$$fire('uip:dirchange');
  }

  @listen({
    event: 'load',
    target: ($this: UIPPreview) => $this.$iframe,
    condition: ($this: UIPPreview) => $this.isolation
  })
  protected _onIframeLoad(): void {
    if (!this.$iframe.contentWindow) return;

    const title = this.model!.activeSnippet?.label || 'UI Playground';
    const script = UIPJSRenderingPreprocessors.preprocess(this.model!.js);
    const content = UIPHTMLRenderingPreprocessors.preprocess(this.model!.html);
    const html = UIPRenderingTemplatesService.render(this.isolationTemplate, {title, content, script});

    this.$iframe.contentWindow?.document.close();
    this.$iframe.contentWindow?.document.write(html);
    this.$iframe.contentWindow?.document.close();
  }

  /** Updates preview content from the model state changes */
  @listen({event: 'uip:change', target: ($this: UIPPreview) => $this.$root})
  protected _onRootStateChange(e?: UIPChangeEvent): void {
    this.$container.style.minHeight = `${this.$inner.offsetHeight}px`;
    this.update(e);

    afterNextRender(() => this.$container.style.minHeight = '0px');
    skipOneRender(() => {
      if (this.$container.clientHeight !== this.$inner.offsetHeight) return;
      this.$container.style.removeProperty('min-height');
    });
  }

  /** Handles end of animation playing while the demo content change */
  @listen({
    event: 'transitionend',
    target: (preview: UIPPreview) => preview.$container,
  })
  protected _onTransitionEnd(e: TransitionEvent): void {
    if (e.propertyName !== 'min-height') return;
    this.$container.style.removeProperty('min-height');
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
