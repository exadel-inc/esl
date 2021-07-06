import {CSSClassUtils} from '@exadel/esl';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {UIPPlugin} from '../core/plugin';

export class UIPSnippets extends UIPPlugin {
  public static is = 'uip-snippets';
  public static ACTIVE_CLASS = 'active';
  public static ITEM_CLASS = 'snippets-list-item';

  public get $items(): HTMLElement[] {
    const items = this.querySelectorAll(`.${UIPSnippets.ITEM_CLASS}`);
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

  get $inner() {
    const $inner = document.createElement('div');
    CSSClassUtils.add($inner, 'uip-snippets-inner esl-scrollable-content');

    return $inner;
  }

  get $scroll() {
    const $scroll = document.createElement('esl-scrollbar');
    $scroll.setAttribute('target', '::prev(.uip-snippets-inner)');

    return $scroll;
  }

  get $snippetsList() {
    const $ul = document.createElement('ul');
    $ul.className = 'snippets-list';

    return $ul;
  }

  get $snippetsListItem() {
    const $li = document.createElement('li');
    $li.classList.add(UIPSnippets.ITEM_CLASS);

    return $li;
  }

  protected render(): void {
    const inner = this.$inner;
    const snippetsList = this.$snippetsList;
    const snippets = this.querySelectorAll('[uip-snippet]');
    if (!snippets.length) return;

    Array.from(snippets)
      .map((snippet: HTMLTemplateElement) => this.createListItem(snippet))
      .forEach((item) => item && snippetsList.appendChild(item));

    this.$active = this.$active as HTMLElement;

    inner.appendChild(snippetsList);
    this.innerHTML = inner.outerHTML + this.$scroll.outerHTML;
  }

  protected createListItem(snippet: HTMLTemplateElement) {
    const listItem = this.$snippetsListItem;
    const label = snippet.getAttribute('label');
    if (!label) return;
    listItem.textContent = label;
    listItem.appendChild(snippet);
    return listItem;
  }

  protected applyActive(): void {
    const tmpl = this.$active?.querySelector('[uip-snippet]');
    if (!tmpl || !this.model) return;
    this.model.setHtml(tmpl.innerHTML, this);
  }

  @bind
  protected _onClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.classList.contains(UIPSnippets.ITEM_CLASS)) return;
    this.$active = target;

    this.applyActive();
  }
}
