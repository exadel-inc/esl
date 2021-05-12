import {CSSClassUtils} from '@exadel/esl';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {UIPPlugin} from '../core/plugin';

export class UIPSnippets extends UIPPlugin {
  public static is = 'uip-snippets';

  public static ACTIVE_CLASS = 'active';

  public get $items(): HTMLElement[] {
    const items = this.querySelectorAll('.snippets-list-item');
    return Array.from(items) as HTMLElement[];
  }

  public get $active(): HTMLElement | null {
    return this.$items.find(item => item.classList.contains(UIPSnippets.ACTIVE_CLASS)) || null;
  }

  public set $active(snippet: HTMLElement | null) {
    this.$items.forEach((item) => item.classList.toggle(UIPSnippets.ACTIVE_CLASS, snippet === item));
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.bindEvents();

    this.render();
    if (!this.$active) this.$active = this.$items[0];
    this.applyActive();
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindEvents();
  }

  protected bindEvents() {
    this.addEventListener('click', this._onClick);
  }

  protected unbindEvents() {
    this.removeEventListener('click', this._onClick);
  }

  protected handleChange() {}

  protected render(): void {
    const $inner = document.createElement('div');
    CSSClassUtils.add($inner, 'uip-snippets-inner esl-scrollable-content');

    const $scroll = document.createElement('esl-scrollbar');
    $scroll.setAttribute('target', '::prev(.uip-snippets-inner)');

    const snippets = this.querySelectorAll('template[uip-snippet]');
    if (!snippets.length) return;
    const $ul = document.createElement('ul');
    $ul.className = 'snippets-list';

    Array.from(snippets)
      .map((snippet: HTMLTemplateElement) => this.createListItem(snippet))
      .forEach((item) => item && $ul.appendChild(item));

    this.$active = this.$active as HTMLElement;

    $inner.appendChild($ul);
    this.innerHTML = $inner.outerHTML + $scroll.outerHTML;
  }

  protected createListItem(snippet : HTMLTemplateElement) {
    const li = document.createElement('li');
    li.classList.add('snippets-list-item');
    const label = snippet.getAttribute('label');
    if (!label) return;
    li.textContent = label;
    li.appendChild(snippet);
    return li;
  }

  protected applyActive(): void {
    const tmpl = this.$active?.querySelector('template[uip-snippet]');
    if (!tmpl) return;

    this.dispatchChange(tmpl.innerHTML);
  }

  @bind
  protected _onClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('snippets-list-item')) return;
    this.$active = target;

    this.applyActive();
  }
}

