import React from 'jsx-dom';

import {bind, listen, memoize} from '@exadel/esl/modules/esl-utils/decorators';
import {afterNextRender, skipOneRender} from '@exadel/esl/modules/esl-utils/async';

import {UIPPlugin} from '../base/plugin';

/**
 * Preview {@link UIPPlugin} custom element definition
 * Element that displays active markup
 */
export class UIPPreview extends UIPPlugin {
  static is = 'uip-preview';
  static observedAttributes: string[] = ['dir', 'resizable'];

  /** {@link UIPPlugin} section wrapper */
  @memoize()
  protected get $inner(): HTMLElement {
    const pluginType = this.constructor as typeof UIPPlugin;
    return <div className={`${pluginType.is}-inner uip-plugin-inner esl-scrollable-content`}></div> as HTMLElement;
  }

  /** Extra element to animate decreasing height of content smoothly */
  @memoize()
  protected get $container(): HTMLElement {
    const type = this.constructor as typeof UIPPreview;
    return (
      <div class={type.is + '-container'}>
        <esl-scrollbar class={type.is + '-scroll'} target="::next(.uip-plugin-inner)"/>
        <esl-scrollbar class={type.is + '-scroll'} target="::next(.uip-plugin-inner)" horizontal/>
        {this.$inner}
      </div>
    ) as HTMLElement;
  }

  /** Changes preview markup from state changes */
  @bind
  protected _onRootStateChange(): void {
    this.$container.style.minHeight = `${this.$inner.offsetHeight}px`;
    this.$inner.innerHTML = this.model!.html;

    afterNextRender(() => this.$container.style.minHeight = '0px');
    skipOneRender(() => {
      if (this.$container.clientHeight !== this.$inner.offsetHeight) return;
      this.$container.style.removeProperty('min-height');
    });
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
    event: 'transitionend',
    target: (preview: UIPPreview) => preview.$container,
  })
  protected _onTransitionEnd(e: TransitionEvent): void {
    if (e.propertyName !== 'min-height') return;
    this.$container.style.removeProperty('min-height');
  }
}
