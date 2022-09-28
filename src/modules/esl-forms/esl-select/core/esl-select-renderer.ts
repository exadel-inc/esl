import {ESLBaseElement, listen} from '../../../esl-base-element/core';
import {rafDecorator} from '../../../esl-utils/async/raf';
import {bind, attr, boolAttr} from '../../../esl-utils/decorators';
import {format} from '../../../esl-utils/misc/format';

import type {ESLSelect} from './esl-select';

/**
 * ESLSelectRenderer component
 * @author Alexey Stsefanovich (ala'n)
 *
 * Auxiliary inner custom element to render {@link ESLSelect} inline field
 */
export class ESLSelectRenderer extends ESLBaseElement {
  public static readonly is = 'esl-select-renderer';

  /** Attribute for empty text value */
  @attr() public emptyText: string;
  /** Attribute for more label format */
  @attr() public moreLabelFormat: string;
  /** Marker attribute to reflect filled state */
  @boolAttr() public hasValue: boolean;

  protected $container: HTMLDivElement;
  protected $rest: HTMLElement;
  protected $text: HTMLElement;
  protected $remove: HTMLButtonElement;

  protected _deferredRerender = rafDecorator(() => this.render());

  constructor() {
    super();

    this.$remove = document.createElement('button');
    this.$remove.type = 'button';
    this.$remove.setAttribute('aria-label', 'Clear');
    this.$remove.classList.add('esl-select-clear-btn');
    this.$remove.classList.add('icon-nav-close-menu');

    this.$container = document.createElement('div');
    this.$container.classList.add('esl-select-text-container');
    this.$text = document.createElement('span');
    this.$text.classList.add('esl-select-text');
    this.$container.appendChild(this.$text);
    this.$rest = document.createElement('span');
    this.$rest.classList.add('esl-select-text');
    this.$container.appendChild(this.$rest);
  }

  /** ESLSelect owner */
  get owner(): ESLSelect | null {
    if (!this.parentElement || !this.parentElement.matches('esl-select')) return null;
    return this.parentElement as ESLSelect;
  }

  protected connectedCallback(): void {
    super.connectedCallback();
    this.appendChild(this.$container);
    this.appendChild(this.$remove);

    this.$$on({event: 'esl:change:value', target: this.owner}, this.render);
    this.$$on({event: 'resize', target: window}, this._deferredRerender);

    customElements.whenDefined(ESLSelectRenderer.is).then(() => this.render());
  }
  protected disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeChild(this.$container);
    this.removeChild(this.$remove);
  }

  /** Rerender component with markers */
  @bind
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
  @listen({
    event: 'click',
    selector: '.esl-select-clear-btn'
  })
  protected _onClear(e: MouseEvent): void {
    if (!this.owner) return;
    this.owner.setAllSelected(false);
    e.stopPropagation();
    e.preventDefault();
  }
}

declare global {
  export interface HTMLElementTagNameMap {
    'esl-select-renderer': ESLSelectRenderer;
  }
}
