import {ESLBaseElement} from '../../../esl-base-element/core/esl-base-element';
import {rafDecorator} from '../../../esl-utils/async/raf';
import {bind} from '../../../esl-utils/decorators/bind';
import {attr} from '../../../esl-base-element/decorators/attr';
import {boolAttr} from '../../../esl-base-element/decorators/bool-attr';
import {compile} from '../../../esl-utils/misc/format';

import type {ESLSelect} from './esl-select';

export class ESLSelectText extends ESLBaseElement {
  public static readonly is = 'esl-select-text';

  @attr() public emptyText: string;
  @attr() public moreLabelFormat: string;
  @boolAttr() public hasValue: boolean;

  protected $container: HTMLDivElement;
  protected $rest: HTMLElement;
  protected $text: HTMLElement;
  protected $remove: HTMLButtonElement;

  protected _select: ESLSelect;
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

  get model() {
    return this._select;
  }
  set model(mod: ESLSelect) {
    this.unbindEvents();
    this._select = mod;
    this.bindEvents();
    this.render();
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.appendChild(this.$container);
    this.appendChild(this.$remove);
    this.bindEvents();
  }
  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.removeChild(this.$container);
    this.removeChild(this.$remove);
    this.unbindEvents();
  }

  protected bindEvents() {
    if (!this.model) return;
    this.model.addEventListener('change', this.render);
    this.$remove.addEventListener('click', this._onClear);
    window.addEventListener('resize', this._deferredRerender);
  }
  protected unbindEvents() {
    if (!this.model) return;
    this.model.removeEventListener('change', this.render);
    this.$remove.removeEventListener('click', this._onClear);
    window.removeEventListener('resize', this._deferredRerender);
  }

  @bind
  protected _onClear(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.model && this.model.setAllSelected(false);
  }

  @bind
  public render() {
    if (!this.model) return;
    const selected = this.model.selected;
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
      this.$rest.textContent = compile(this.moreLabelFormat || '', options);
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
}
