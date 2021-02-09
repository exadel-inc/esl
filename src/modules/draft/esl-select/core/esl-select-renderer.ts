import {attr, boolAttr, ESLBaseElement} from '../../../esl-base-element/core';
import {rafDecorator} from '../../../esl-utils/async/raf';
import {bind} from '../../../esl-utils/decorators/bind';
import {format} from '../../../esl-utils/misc/format';

import {ESLSelect} from './esl-select';

/**
 * Auxiliary custom element to render select field
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
    return this.parentElement instanceof ESLSelect ? this.parentElement : null;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.appendChild(this.$container);
    this.appendChild(this.$remove);
    this.bindEvents();

    customElements.whenDefined(ESLSelectRenderer.is).then(() => this.render());
  }
  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.removeChild(this.$container);
    this.removeChild(this.$remove);
    this.unbindEvents();
  }

  protected bindEvents() {
    if (!this.owner) return;
    this.owner.addEventListener('change', this.render);
    this.$remove.addEventListener('click', this._onClear);
    window.addEventListener('resize', this._deferredRerender);
  }
  protected unbindEvents() {
    if (!this.owner) return;
    this.owner.removeEventListener('change', this.render);
    this.$remove.removeEventListener('click', this._onClear);
    window.removeEventListener('resize', this._deferredRerender);
  }

  /** Rerender component with markers */
  @bind
  public render() {
    if (!this.owner) return;
    const selected = this.owner.selected;
    this.hasValue = !!selected.length;
    this.applyItems(selected.map((item) => item.text));
  }

  /** Render item with a visible items limit */
  protected apply(items: string[], limit: number) {
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
  protected applyItems(items: string[]) {
    let size = 0;
    do {
      this.apply(items, ++size); // Render with extended limit while it not fits to the container
    } while (size <= items.length && this.$container.scrollWidth <= this.$container.clientWidth);
    this.apply(items, size - 1); // Render last limit that fits
  }

  /** Handle clear button click */
  @bind
  protected _onClear(e: MouseEvent) {
    if (!this.owner) return;
    this.owner.setAllSelected(false);
    e.stopPropagation();
    e.preventDefault();
  }
}
