import {ESLBaseElement} from '../../../esl-base-element/core';
import {format} from '../../../esl-utils/misc/format';
import {rafDecorator} from '../../../esl-utils/async/raf';
import {attr, boolAttr, decorate, listen, memoize} from '../../../esl-utils/decorators';

import type {ESLSelect} from './esl-select';

/**
 * ESLSelectRenderer component
 * @author Alexey Stsefanovich (ala'n)
 *
 * Auxiliary inner custom element to render {@link ESLSelect} inline field
 */
export class ESLSelectRenderer extends ESLBaseElement {
  public static override readonly is = 'esl-select-renderer';

  /** Attribute for empty text value */
  @attr() public emptyText: string;
  /** Attribute for more label format */
  @attr() public moreLabelFormat: string;
  /** Marker attribute to reflect filled state */
  @boolAttr() public hasValue: boolean;

  /** Internal container */
  @memoize()
  protected get $container(): HTMLElement {
    const $container = document.createElement('div');
    $container.className = 'esl-select-text-container';
    $container.appendChild(this.$text);
    $container.appendChild(this.$rest);
    return $container;
  }

  /** Inner remove button */
  @memoize()
  protected get $remove(): HTMLElement {
    const $remove = document.createElement('button');
    $remove.type = 'button';
    $remove.setAttribute('aria-label', 'Clear');
    $remove.className = 'esl-select-clear-btn icon-nav-close-menu';
    return $remove;
  }

  /** Inner text element */
  @memoize()
  protected get $text(): HTMLElement {
    const $text = document.createElement('span');
    $text.className = 'esl-select-text';
    return $text;
  }

  /** Inner rest label element */
  @memoize()
  protected get $rest(): HTMLElement {
    const $rest = document.createElement('span');
    $rest.className = 'esl-select-text';
    return $rest;
  }

  /** ESLSelect owner */
  get owner(): ESLSelect | null {
    if (!this.parentElement || !this.parentElement.matches('esl-select')) return null;
    return this.parentElement as ESLSelect;
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.appendChild(this.$container);
    this.appendChild(this.$remove);
    Promise.resolve().then(() => this.render());
  }
  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeChild(this.$container);
    this.removeChild(this.$remove);
  }

  /** Rerender component with markers */
  @listen({
    event: 'esl:change:value',
    target: (el: ESLSelectRenderer) => el.owner
  })
  public render(): void {
    if (!this.owner) return;
    const selected = this.owner.selectedOptions;
    this.hasValue = !!selected.length;
    this.toggleAttribute('multiple', this.owner.multiple);
    this.applyItems(selected.map((item) => item.text));
  }

  /** Render item with a visible items limit */
  protected apply(items: string[], limit: number): void {
    const length = items.length;
    const rest = length - limit;
    const options = {rest, length, limit};
    this.$text.textContent = items.slice(0, limit).join(', ');
    if (rest > 0) {
      this.$rest.textContent = format(this.moreLabelFormat || '', options);
    } else {
      this.$rest.textContent = '';
    }
  }
  /** Render items using adaptive algorithm */
  protected applyItems(items: string[]): void {
    let size = 0;
    do {
      this.apply(items, ++size); // Render with extended limit while it not fits to the container
    } while (size <= items.length && this.$container.scrollWidth <= this.$container.clientWidth);
    this.apply(items, size - 1); // Render last limit that fits
  }

  /** Handle clear button click */
  @listen({event: 'click', selector: '.esl-select-clear-btn'})
  protected _onClear(e: MouseEvent): void {
    if (!this.owner) return;
    this.owner.setAllSelected(false);
    e.stopPropagation();
    e.preventDefault();
  }

  @listen({event: 'resize', target: window})
  @decorate(rafDecorator)
  protected _onResize(): void {
    this.render();
  }
}

declare global {
  export interface HTMLElementTagNameMap {
    'esl-select-renderer': ESLSelectRenderer;
  }
}
