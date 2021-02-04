import {ESLBaseElement} from '../../../esl-base-element/core/esl-base-element';
import {ESLSelectModel} from './esl-select-model';
import {rafDecorator} from '../../../esl-utils/async/raf';
import {bind} from '../../../esl-utils/decorators/bind';
import {attr} from '../../../esl-base-element/decorators/attr';
import {boolAttr} from '../../../esl-base-element/decorators/bool-attr';

export class ESLSelectText extends ESLBaseElement {
  public static readonly is = 'esl-select-text';

  @attr() public emptyText: string;
  @boolAttr() public empty: boolean;

  protected $container: HTMLDivElement;
  protected $rest: HTMLElement;
  protected $text: HTMLElement;
  protected $remove: HTMLButtonElement;

  protected _model: ESLSelectModel;
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
    return this._model;
  }
  set model(mod: ESLSelectModel) {
    this.unbindEvents();
    this._model = mod;
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
    this.model.addListener(this.render);
    this.$remove.addEventListener('click', this._onClear);
    window.addEventListener('resize', this._deferredRerender);
  }
  protected unbindEvents() {
    if (!this.model) return;
    this.model.removeListener(this.render);
    this.$remove.removeEventListener('click', this._onClear);
    window.removeEventListener('resize', this._deferredRerender);
  }

  @bind
  protected _onClear(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.model && this.model.toggleAll(false);
  }

  @bind
  public render() {
    if (!this.model) return;
    const selected = this.model.selected;
    this.empty = !selected.length;
    this.applyItems(selected.map((item) => item.text));
  }

  /** Render item with a visible items limit */
  protected apply(items: string[], limit: number) {
    const rest = items.length - limit;
    this.$text.textContent = items.slice(0, limit).join(', ');
    this.$rest.textContent = rest > 0 ? `${rest} more...` : '';
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
