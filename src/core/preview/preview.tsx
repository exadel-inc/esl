import React from 'jsx-dom';
import {bind, memoize} from '@exadel/esl/modules/esl-utils/decorators';
import {afterNextRender, promisifyTransition} from '@exadel/esl/modules/esl-utils/async';

import {UIPPlugin} from '../base/plugin';

/**
 * Preview {@link UIPPlugin} custom element definition
 * Element that displays active markup
 */
export class UIPPreview extends UIPPlugin {
  static is = 'uip-preview';
  static observedAttributes: string[] = ['dir', 'resizable'];

  /** Extra element to animate decreasing height of content smoothly */
  @memoize()
  protected get $stub(): HTMLElement {
    const type = this.constructor as typeof UIPPreview;
    return (<span class={type.is + '-stub'}/>) as HTMLElement;
  }

  /** {@link UIPPlugin} section wrapper */
  @memoize()
  protected get $inner(): HTMLElement {
    const pluginType = this.constructor as typeof UIPPlugin;
    return <div className={`${pluginType.is}-inner uip-plugin-inner`}></div> as HTMLElement;
  }

  /** Changes preview markup from state changes */
  @bind
  protected _onRootStateChange(): void {
    this.$stub.style.height = `${this.$inner.offsetHeight}px`;
    this.appendChild(this.$stub);
    this.$inner.innerHTML = this.model!.html;

    afterNextRender(() => this.$stub.style.height = '0px');
    promisifyTransition(this.$stub, 'height').then(() => this.removeChild(this.$stub));
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.appendChild(this.$inner);
  }
  protected override disconnectedCallback(): void {
    this.$inner.remove();
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
}
