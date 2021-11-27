import {memoize} from '@exadel/esl/modules/esl-utils/decorators/memoize';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {UIPPlugin} from '../base/plugin';

/**
 * Container class for snippets (component's templates).
 * @extends UIPPlugin
 */
export class UIPSnippets extends UIPPlugin {
  public static is = 'uip-snippets';
  /** CSS Class added to active snippet. */
  public static ACTIVE_CLASS = 'active';
  /** CSS Class for snippets list items. */
  public static ITEM_CLASS = 'snippets-list-item';
  /** CSS query for snippets. */
  public static CONTENT_SEL = '[uip-snippet]';

  protected connectedCallback() {
    super.connectedCallback();
    this.render();
    this.bindEvents();

    if (this.$items.length < 2) this.classList.add('hide-snippets');
    // Initial update
    setTimeout(() => this.$active = this.$active || this.$items[0]);
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

  @memoize()
  public get $items(): HTMLElement[] {
    const items = this.querySelectorAll(`.${UIPSnippets.ITEM_CLASS}`);
    return Array.from(items) as HTMLElement[];
  }

  public get $active(): HTMLElement | null {
    return this.$items.find(item => item.classList.contains(UIPSnippets.ACTIVE_CLASS)) || null;
  }
  public set $active(snippet: HTMLElement | null) {
    this.$items.forEach((item) => item.classList.toggle(UIPSnippets.ACTIVE_CLASS, snippet === item));
    this.applyActive();
  }

  @memoize()
  public get $scroll() {
    const $scroll = document.createElement('esl-scrollbar');
    $scroll.setAttribute('target', '::prev(.snippets-list)');
    return $scroll;
  }

  /** Render snippets list. */
  protected render(): void {
    const snippets = this.querySelectorAll(UIPSnippets.CONTENT_SEL);
    if (!snippets.length) return;
    const $ul = document.createElement('ul');
    $ul.className = 'snippets-list esl-scrollable-content';

    Array.from(snippets)
      .map((snippet: HTMLTemplateElement) => this.buildListItem(snippet))
      .forEach((item) => item && $ul.appendChild(item));

    this.$inner.appendChild($ul);
    this.$scroll && this.$inner.appendChild(this.$scroll);
    this.appendChild(this.$inner);
  }

  /** Build snippets list item. */
  protected buildListItem(snippet: HTMLTemplateElement) {
    const label = snippet.getAttribute('label');
    if (!label) return;

    const $li = document.createElement('li');
    $li.classList.add(UIPSnippets.ITEM_CLASS);
    $li.textContent = label;
    $li.appendChild(snippet);
    return $li;
  }

  /** Apply active snippet's markup to {@link UIPStateModel}. */
  protected applyActive(): void {
    const tmpl = this.$active?.querySelector(UIPSnippets.CONTENT_SEL);
    if (!tmpl || !this.model) return;
    this.model.setHtml(tmpl.innerHTML, this);
  }

  @bind
  protected _onClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.classList.contains(UIPSnippets.ITEM_CLASS)) return;
    this.$active = target;
  }
}
